import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';
import * as mocks from 'node-mocks-http';
import * as Bcrypt from 'bcryptjs';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AdminController', () => {
  let controller: AdminController;
  let adminRepository: MockRepository<Admin>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      imports: [PassportModule, ConfigModule, JwtModule],
      providers: [
        AdminService,
        JwtService,
        { provide: getRepositoryToken(Admin), useValue: mockRepository() },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminRepository = module.get<MockRepository<Admin>>(
      getRepositoryToken(Admin),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const loginDto = {
    account: 'accountId',
    password: 'pass',
  };

  const userArgs = {
    account: 'accountId',
    name: '테스터',
    password: 'pass',
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('관리자 로그인()', () => {
    it('관리자 로그인 성공케이스', async () => {
      const salt = await Bcrypt.genSalt(10);
      userArgs.password = await Bcrypt.hash(userArgs.password, salt);
      adminRepository.save.mockResolvedValue(userArgs);
      adminRepository.findOne.mockReturnValue(userArgs);
      const req = mocks.createRequest();
      req.res = mocks.createResponse();
      process.env.ADMIN_ACCESS_TOKEN_SECRET = 'test';

      const result = await controller.login(loginDto, req.res);
      expect(result.name).toBe(userArgs.name);
    });
  });
});
