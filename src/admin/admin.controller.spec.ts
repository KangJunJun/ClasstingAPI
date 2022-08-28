import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      imports: [PassportModule, ConfigModule, JwtModule],
      providers: [
        AdminService,
        JwtService,
        { provide: getRepositoryToken(Admin), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
