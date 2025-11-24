import { Test, TestingModule } from '@nestjs/testing';
import { AvisService } from './avis.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AvisService', () => {
  let service: AvisService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashed',
  };

  const mockPrismaService = {
    avis: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvisService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AvisService>(AvisService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAvis', () => {
    const payload = {
      movieId: 123,
      movieName: 'Inception',
      note: 4.5,
      commentaire: 'Super film',
    };

    it('creates a new avis when none exists', async () => {
      mockPrismaService.avis.findFirst.mockResolvedValue(null);
      mockPrismaService.avis.create.mockResolvedValue({
        id: 1,
        userId: mockUser.id,
        ...payload,
      });

      const result = await service.createAvis(mockUser as any, payload);

      expect(result).toEqual({
        id: 1,
        userId: mockUser.id,
        ...payload,
      });
      expect(mockPrismaService.avis.create).toHaveBeenCalled();
    });

    it('throws if avis already exists for movie', async () => {
      mockPrismaService.avis.findFirst.mockResolvedValue({ id: 99 });

      await expect(service.createAvis(mockUser as any, payload)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getUserAvis', () => {
    it('returns avis for user', async () => {
      const avisList = [{ id: 1 }];
      mockPrismaService.avis.findMany.mockResolvedValue(avisList);

      const result = await service.getUserAvis(mockUser as any);

      expect(result).toEqual(avisList);
      expect(mockPrismaService.avis.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('getAvisByMovie', () => {
    it('returns avis for movie', async () => {
      const avisList = [{ id: 1, movieId: 42 }];
      mockPrismaService.avis.findMany.mockResolvedValue(avisList);

      const result = await service.getAvisByMovie(42);

      expect(result).toEqual(avisList);
      expect(mockPrismaService.avis.findMany).toHaveBeenCalledWith({
        where: { movieId: 42 },
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('updateAvis', () => {
    it('updates avis when owned by user', async () => {
      const avis = { id: 1, userId: mockUser.id };
      mockPrismaService.avis.findUnique.mockResolvedValue(avis);
      mockPrismaService.avis.update.mockResolvedValue({ ...avis, note: 5 });

      const result = await service.updateAvis(1, mockUser as any, { note: 5 });

      expect(result).toEqual({ ...avis, note: 5 });
      expect(mockPrismaService.avis.update).toHaveBeenCalled();
    });

    it('throws NotFound when avis missing', async () => {
      mockPrismaService.avis.findUnique.mockResolvedValue(null);

      await expect(
        service.updateAvis(1, mockUser as any, { note: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws Forbidden when avis not owned', async () => {
      mockPrismaService.avis.findUnique.mockResolvedValue({ id: 1, userId: 2 });

      await expect(
        service.updateAvis(1, mockUser as any, { note: 5 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteAvis', () => {
    it('deletes avis when owned', async () => {
      mockPrismaService.avis.findUnique.mockResolvedValue({
        id: 1,
        userId: mockUser.id,
      });
      mockPrismaService.avis.delete.mockResolvedValue(null);

      const result = await service.deleteAvis(1, mockUser as any);

      expect(result).toEqual({ message: 'Avis supprimé' });
      expect(mockPrismaService.avis.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('throws NotFound when missing', async () => {
      mockPrismaService.avis.findUnique.mockResolvedValue(null);

      await expect(service.deleteAvis(1, mockUser as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
