import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    group: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFirebaseToken', () => {
    it('should return null for invalid token format', async () => {
      const result = await service.validateFirebaseToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should return null for token without Bearer prefix', async () => {
      const result = await service.validateFirebaseToken('test:user@example.com');
      expect(result).toBeNull();
    });

    it('should create user if token is valid but user does not exist', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        firebaseUid: 'firebase-uid-1',
        groupId: 'group-1',
        role: 'member',
      };

      const mockGroup = {
        id: 'group-1',
        name: 'example.com Group',
        domain: 'example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.group.findUnique.mockResolvedValue(null);
      mockPrismaService.group.create.mockResolvedValue(mockGroup);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.validateFirebaseToken('Bearer firebase-uid-1:test@example.com');
      
      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        firebaseUid: 'firebase-uid-1',
        groupId: 'group-1',
        role: 'member',
      });
    });
  });
});