import { Test, TestingModule } from '@nestjs/testing';
import { SchoolService } from './school.service';
import { School } from '../entities/school.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('SchoolService', () => {
  let service: SchoolService;
  let schoolRepository: MockRepository<School>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolService,
        { provide: getRepositoryToken(School), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<SchoolService>(SchoolService);
    schoolRepository = module.get(getRepositoryToken(School));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a school', () => {
      //const beforeCreate = schoolRepository.getAll().length;
      schoolRepository.create({
        name: 'Test',
        region: 'Test',
        adminId: 1,
      });
      //expect(afterCreate).toBeGreaterThan(beforeCreate);
    });

    it('should fail if user exists', () => {
      //.. 중략
    });
  });
});
