import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as Bcrypt from 'bcryptjs';
import { HttpStatus } from '@nestjs/common';
import * as mocks from 'node-mocks-http';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersController', () => {
  let controller: UserController;
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [PassportModule, ConfigModule, JwtModule],
      providers: [
        UserService,
        JwtService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
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

  describe('유저 로그인()', () => {
    it('유저 로그인 성공', async () => {
      const salt = await Bcrypt.genSalt(10);
      userArgs.password = await Bcrypt.hash(userArgs.password, salt);
      userRepository.save.mockResolvedValue(userArgs);
      userRepository.findOne.mockReturnValue(userArgs);
      const req = mocks.createRequest();
      req.res = mocks.createResponse();
      process.env.USER_ACCESS_TOKEN_SECRET = 'test';

      const result = await controller.login(loginDto, req.res);
      expect(result.name).toBe(userArgs.name);
    });
  });
});
