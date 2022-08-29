import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Admin } from '../entities/admin.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as Bcrypt from 'bcryptjs';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('AdminService', () => {
  let service: AdminService;
  let adminRepository: MockRepository<Admin>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, ConfigModule, JwtModule],
      providers: [
        AdminService,
        { provide: getRepositoryToken(Admin), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    adminRepository = module.get(getRepositoryToken(Admin));
  });

  const adminArgs = {
    account: 'accountId',
    name: '테스터',
    password: 'pass',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser()', () => {
    it('관리자 비밀번호 테스트', async () => {
      const salt = await Bcrypt.genSalt(10);
      const password = await Bcrypt.hash(adminArgs.password, salt);
      const cryptUser = {
        ...adminArgs,
        password,
      };
      adminRepository.save.mockResolvedValue(cryptUser);
      adminRepository.findOne.mockReturnValue(cryptUser);

      const result = await service.validateAdmin(adminArgs);
      expect(result).toBe(cryptUser);
    });

    it('관리자 비밀번호 검증 실패', async () => {
      adminRepository.save.mockResolvedValue(adminArgs);
      adminRepository.findOne.mockReturnValue(adminArgs);

      try {
        await service.validateAdmin(adminArgs);
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('getAdmin()', () => {
    it('getUser not found', async () => {
      try {
        await service.getAdmin('user1');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });
});
