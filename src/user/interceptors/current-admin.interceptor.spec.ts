import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { CurrentUserInterceptor } from './current-user.interceptor';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const executionContext = {
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn().mockReturnThis(),
};

const callHandler = {
  handle: jest.fn(),
};

describe('Admin Interceptor', () => {
  let service: UserService;
  let interceptor: CurrentUserInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, ConfigModule, JwtModule],
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    interceptor = new CurrentUserInterceptor(service);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('admin inteceptor test', async () => {
    (
      executionContext.switchToHttp().getRequest as jest.Mock<any, any>
    ).mockReturnValueOnce({});
    callHandler.handle.mockResolvedValueOnce('next handle');
    const actualValue = await interceptor.intercept(
      executionContext,
      callHandler,
    );
    expect(actualValue).toBe('next handle');
    expect(executionContext.switchToHttp().getRequest().body).toEqual(
      undefined,
    );
    expect(callHandler.handle).toBeCalledTimes(1);
  });
});
