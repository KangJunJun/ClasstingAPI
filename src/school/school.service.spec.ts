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

  const schoolArg = {
    name: 'Test',
    region: 'Test',
    adminId: 1,
  };
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('학교 페이지 생성', () => {
    it('should create a school', () => {
      schoolRepository.create({
        name: 'Test',
        region: 'Test',
        adminId: 1,
      });
    });
  });

  describe('학교목록 가져오기', () => {
    it('해당 학교가 없는 경우', async () => {
      try {
        await service.getSchool(1);
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });

    it('학교가 있는 경우', async () => {
      schoolRepository.save.mockResolvedValue(schoolArg);
      schoolRepository.findOne.mockReturnValue(schoolArg);
      const result = await service.getSchool(1);
      expect(result).toBe(schoolArg);
    });

    it('should fail if user exists', () => {
      //.. 중략
    });
  });
});
