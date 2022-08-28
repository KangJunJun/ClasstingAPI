import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { School } from '../entities/school.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('SchoolController', () => {
  let controller: SchoolController;
  //let schoolService: SchoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [
        SchoolService,
        { provide: getRepositoryToken(School), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
    //schoolService = module.get<SchoolService>(SchoolService);
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
      const result = await controller.createSchool(schoolDto, user);
      expect(result.name).toBe(schoolDto.name);
    });
  });
});
