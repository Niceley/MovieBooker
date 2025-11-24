import { Test, TestingModule } from '@nestjs/testing';
import { AvisController } from './avis.controller';
import { AvisService } from './avis.service';
import { CreateAvisDto } from './dto/create-avis.dto';

describe('AvisController', () => {
  let controller: AvisController;
  const mockAvisService = {
    createAvis: jest.fn(),
    getUserAvis: jest.fn(),
    getAvisByMovie: jest.fn(),
    updateAvis: jest.fn(),
    deleteAvis: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashed',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvisController],
      providers: [
        {
          provide: AvisService,
          useValue: mockAvisService,
        },
      ],
    }).compile();

    controller = module.get<AvisController>(AvisController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAvis', () => {
    const payload: CreateAvisDto = {
      movieId: 1,
      movieName: 'Inception',
      note: 4,
      commentaire: 'Bien',
    };

    it('delegates creation to service', async () => {
      mockAvisService.createAvis.mockResolvedValue({ id: 1, ...payload });

      const result = await controller.createAvis(mockUser as any, payload);

      expect(result).toEqual({ id: 1, ...payload });
      expect(mockAvisService.createAvis).toHaveBeenCalledWith(
        mockUser,
        payload,
      );
    });
  });

  describe('getUserAvis', () => {
    it('returns avis list', async () => {
      mockAvisService.getUserAvis.mockResolvedValue([{ id: 1 }]);

      const result = await controller.getUserAvis(mockUser as any);

      expect(result).toEqual([{ id: 1 }]);
      expect(mockAvisService.getUserAvis).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getAvisByMovie', () => {
    it('returns avis for movie', async () => {
      mockAvisService.getAvisByMovie.mockResolvedValue([{ id: 1 }]);

      const result = await controller.getAvisByMovie('5');

      expect(result).toEqual([{ id: 1 }]);
      expect(mockAvisService.getAvisByMovie).toHaveBeenCalledWith(5);
    });
  });

  describe('updateAvis', () => {
    it('updates avis via service', async () => {
      mockAvisService.updateAvis.mockResolvedValue({ id: 1, note: 5 });

      const result = await controller.updateAvis('1', mockUser as any, {
        note: 5,
      });

      expect(result).toEqual({ id: 1, note: 5 });
      expect(mockAvisService.updateAvis).toHaveBeenCalledWith(1, mockUser, {
        note: 5,
      });
    });
  });

  describe('deleteAvis', () => {
    it('deletes avis via service', async () => {
      mockAvisService.deleteAvis.mockResolvedValue({ message: 'Avis supprimé' });

      const result = await controller.deleteAvis('1', mockUser as any);

      expect(result).toEqual({ message: 'Avis supprimé' });
      expect(mockAvisService.deleteAvis).toHaveBeenCalledWith(1, mockUser);
    });
  });
});
