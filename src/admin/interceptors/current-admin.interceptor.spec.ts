import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AdminService } from '../admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../../entities/admin.entity';
import { CurrentAdminInterceptor } from './current-admin.interceptor';

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
  let service: AdminService;
  let interceptor: CurrentAdminInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, ConfigModule, JwtModule],
      providers: [
        AdminService,
        { provide: getRepositoryToken(Admin), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    interceptor = new CurrentAdminInterceptor(service);
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
