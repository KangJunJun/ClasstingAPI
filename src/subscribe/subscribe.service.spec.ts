import { Test, TestingModule } from '@nestjs/testing';
import { SubscribeService } from './subscribe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscribe } from '../entities/subscribe.entity';
import { FeedModule } from '../feed/feed.module';
import { SchoolModule } from '../school/school.module';
import { SchoolService } from '../school/school.service';
import { FeedService } from '../feed/feed.service';
import { School } from '../entities/school.entity';
import { Feed } from '../entities/feed.entity';
import { SubscribeController } from './subscribe.controller';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('SubscribeService', () => {
  let subscribeService: SubscribeService;
  let schoolService: SchoolService;
  let subscribeRepository: MockRepository<Subscribe>;
  let schoolRepository: MockRepository<School>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscribeService,
        SchoolService,
        { provide: getRepositoryToken(Subscribe), useValue: mockRepository() },
        { provide: getRepositoryToken(School), useValue: mockRepository() },

        {
          provide: SchoolService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    subscribeService = module.get<SubscribeService>(SubscribeService);
    schoolService = module.get<SchoolService>(SchoolService);

    subscribeRepository = module.get(getRepositoryToken(Subscribe));
    schoolRepository = module.get(getRepositoryToken(School));
  });

  const schoolArg = {
    name: 'Test',
    region: 'Test',
    adminId: 1,
  };

  const schoolArr = [
    {
      id: 5,
      name: '명덕2',
      region: '발산동',
      adminId: 1,
    },
    {
      id: 9,
      name: '공항중',
      region: '공항',
      adminId: 5,
    },
    {
      id: 13,
      name: '공항중1',
      region: '공항1',
      adminId: 6,
    },
  ];

  it('should be defined', () => {
    expect(subscribeService).toBeDefined();
  });

  describe('구독중인 학교목록 가져오기', () => {
    it('가져오기 성공', async () => {
      subscribeRepository.find.mockReturnValue(schoolArr);
      await subscribeService.findSubscribeSchool(1);
    });
  });

  describe('구독중인 학교목록 가져오기', () => {
    it('가져오기 성공', async () => {
      subscribeRepository.findOne.mockReturnValue(schoolArr);
      await subscribeService.findFeedsBySchool(1, 1);
    });
  });
});
