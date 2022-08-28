import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Admin } from '../entities/admin.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('get school into admin', async () => {
  //   const result = await service.getSchool(1);
  //   expect(result.name).toEqual('명덕');
  // });

  // it('find admin', async () => {
  //   const result = await adminRepository.findOne(1);
  //   expect(result.id).toEqual(1);
  // });
});
