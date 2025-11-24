import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
  };

  const mockPrismaService = {
    reservation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserveMovie', () => {
    const reservationData = {
      movieId: 1,
      movieName: 'Test Movie',
      date: new Date('2024-04-10T15:00:00Z'),
    };

    it('should create a new reservation', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);
      mockPrismaService.reservation.create.mockResolvedValue({
        id: 1,
        userId: mockUser.id,
        ...reservationData,
      });

      const result = await service.reserveMovie(
        mockUser,
        reservationData.movieId,
        reservationData.movieName,
        reservationData.date,
      );

      expect(result).toEqual({
        id: 1,
        userId: mockUser.id,
        ...reservationData,
      });
    });

    it('should throw error if user has overlapping reservation', async () => {
      const existingReservation = {
        id: 2,
        userId: mockUser.id,
        movieId: 2,
        movieName: 'Another Movie',
        date: new Date('2024-04-10T16:00:00Z'),
      };

      mockPrismaService.reservation.findFirst.mockResolvedValue(existingReservation);

      await expect(
        service.reserveMovie(
          mockUser,
          reservationData.movieId,
          reservationData.movieName,
          reservationData.date,
        ),
      ).rejects.toThrow();
    });
  });

  describe('getUserReservations', () => {
    it('should return user reservations', async () => {
      const mockReservations = [
        {
          id: 1,
          userId: mockUser.id,
          movieId: 1,
          movieName: 'Test Movie',
          date: new Date('2024-04-10T15:00:00Z'),
        },
      ];

      mockPrismaService.reservation.findMany.mockResolvedValue(mockReservations);

      const result = await service.getUserReservations(mockUser);

      expect(result).toEqual(mockReservations);
      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        orderBy: { date: 'asc' },
      });
    });

    it('should throw error if database query fails', async () => {
      mockPrismaService.reservation.findMany.mockRejectedValue(new Error());

      await expect(service.getUserReservations(mockUser)).rejects.toThrow(
        'Erreur lors de la récupération des réservations',
      );
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      const reservationId = 1;
      const mockReservation = {
        id: reservationId,
        userId: mockUser.id,
        movieId: 1,
        movieName: 'Test Movie',
        date: new Date('2024-04-10T15:00:00Z'),
      };

      mockPrismaService.reservation.findUnique.mockResolvedValue(mockReservation);
      mockPrismaService.reservation.delete.mockResolvedValue(mockReservation);

      const result = await service.cancelReservation(reservationId);

      expect(result).toEqual({ message: 'Réservation annulée' });
      expect(prismaService.reservation.delete).toHaveBeenCalledWith({
        where: { id: reservationId },
      });
    });

    it('should throw error if reservation not found', async () => {
      const reservationId = 1;
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.cancelReservation(reservationId)).rejects.toThrow(
        'Réservation non trouvée',
      );
    });
  });

  describe('getReservationById', () => {
    it('should return reservation by id', async () => {
      const reservationId = 1;
      const mockReservation = {
        id: reservationId,
        userId: mockUser.id,
        movieId: 1,
        movieName: 'Test Movie',
        date: new Date('2024-04-10T15:00:00Z'),
      };

      mockPrismaService.reservation.findUnique.mockResolvedValue(mockReservation);

      const result = await service.getReservationById(reservationId);

      expect(result).toEqual(mockReservation);
      expect(prismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: reservationId },
      });
    });

    it('should throw NotFoundException if reservation not found', async () => {
      const reservationId = 1;
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.getReservationById(reservationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
