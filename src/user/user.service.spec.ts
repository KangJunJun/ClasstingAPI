import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

const mockUserRepository = () => ({
  //findOne: jest.fn((entity) => entity),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('UsersService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, ConfigModule, JwtModule],
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });
  const userArgs = {
    account: 'accountId',
    name: '테스터',
    password: 'pass',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser()', () => {
    it('should create user', async () => {
      userRepository.save.mockResolvedValue(userArgs);

      const result = await service.createUser(userArgs);
      expect(result).toBe(userArgs);
    });

    it('should throw on duplicate account', async () => {
      try {
        await service.createUser(userArgs);
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });
  });

  describe('validateUser()', () => {
    it('should validate user', async () => {
      userRepository.save.mockResolvedValue(userArgs);
      const user = await service.createUser(userArgs);

      const result = await service.validateUser(user);
      expect(result).toBe(userArgs);
    });
  });

  describe('getUser()', () => {
    // it('getUser Test', async () => {
    //   const findOneSpy = jest.spyOn(service, 'getUser');
    //   const findOneOptions: FindOneOptions = {};
    //   await service.getUser('user1');

    //   expect(findOneSpy).toHaveBeenCalledWith(findOneOptions);
    // });
    it('getUser not found', async () => {
      try {
        await service.getUser('user1');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });
});
