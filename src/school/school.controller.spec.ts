import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { School } from '../entities/school.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SchoolController', () => {
  let controller: SchoolController;
  let schoolService: SchoolService;
  let schoolRepository: MockRepository<School>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [
        SchoolService,
        { provide: getRepositoryToken(School), useValue: mockRepository() },
      ],
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
    schoolService = module.get<SchoolService>(SchoolService);
    schoolRepository = module.get<MockRepository<School>>(
      getRepositoryToken(School),
    );
  });
  const schoolDto = { name: '한국고', region: '서울' };
  const user: Admin = {
    id: 1,
    account: 'tester',
    name: '테스터',
    password: '123123',
    school: null,
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('school test', () => {
    it('학교 등록', async () => {
      const schoolDto = { name: '한국고', region: '서울' };
      const user: Admin = {
        id: 1,
        account: 'tester',
        name: '테스터',
        password: '123123',
        school: null,
      };
      await controller.createSchool(schoolDto, user);
      expect(200);
    });

    it('학교 중복 등록', async () => {
      try {
        schoolRepository.findOne.mockReturnValue(schoolDto);
        await controller.createSchool(schoolDto, user);
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });
  });
});
