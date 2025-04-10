import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

describe('ReservationController', () => {
  let controller: ReservationController;
  let reservationService: ReservationService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
  };

  const mockReservationService = {
    reserveMovie: jest.fn(),
    getUserReservations: jest.fn(),
    cancelReservation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    reservationService = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    const reservationData: CreateReservationDto = {
      movieId: 1,
      movieName: 'Test Movie',
      date: new Date('2024-04-10T15:00:00Z'),
    };

    it('should create a new reservation', async () => {
      const mockReservation = {
        id: 1,
        userId: mockUser.id,
        movieId: reservationData.movieId,
        movieName: reservationData.movieName,
        date: reservationData.date,
      };

      mockReservationService.reserveMovie.mockResolvedValue(mockReservation);

      const result = await controller.createReservation(mockUser, reservationData);

      expect(result).toEqual(mockReservation);
      expect(reservationService.reserveMovie).toHaveBeenCalledWith(
        mockUser,
        reservationData.movieId,
        reservationData.movieName,
        reservationData.date,
      );
    });

    it('should return error message if reservation fails', async () => {
      const errorMessage = 'Error creating reservation';
      mockReservationService.reserveMovie.mockRejectedValue(new Error(errorMessage));

      const result = await controller.createReservation(mockUser, reservationData);

      expect(result).toBe(errorMessage);
    });
  });

  describe('getUserReservation', () => {
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

      mockReservationService.getUserReservations.mockResolvedValue(mockReservations);

      const result = await controller.getUserReservation(mockUser);

      expect(result).toEqual(mockReservations);
      expect(reservationService.getUserReservations).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      const reservationId = '1';
      const mockResponse = { message: 'Réservation annulée' };

      mockReservationService.cancelReservation.mockResolvedValue(mockResponse);

      const result = await controller.cancelReservation(reservationId);

      expect(result).toEqual(mockResponse);
      expect(reservationService.cancelReservation).toHaveBeenCalledWith(1);
    });

    it('should return error message if cancellation fails', async () => {
      const reservationId = '1';
      const errorMessage = 'Error cancelling reservation';
      mockReservationService.cancelReservation.mockRejectedValue(new Error(errorMessage));

      const result = await controller.cancelReservation(reservationId);

      expect(result).toBe(errorMessage);
    });
  });
});
