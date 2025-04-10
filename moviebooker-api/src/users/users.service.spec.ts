import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTestMessage', () => {
    it('should return a message with timestamp', async () => {
      const result = await service.getTestMessage();
      
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(result.message).toBe('Users service is working!');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });
  });
});
