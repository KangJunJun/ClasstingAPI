import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { Feed } from '../entities/feed.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Any, DataSource, Repository } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { School } from '../entities/school.entity';
import { Subscribe } from '../entities/subscribe.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('FeedService', () => {
  let service: FeedService;
  let feedRepository: MockRepository<Feed>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: getRepositoryToken(Feed),
          useValue: mockRepository(),
        },
        {
          provide: getDataSourceToken(),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    feedRepository = module.get<MockRepository<Feed>>(getRepositoryToken(Feed));
    dataSource = module.get<DataSource>(getDataSourceToken());
  });

  const admin = new Admin();
  admin.account = 'accountId';
  admin.id = 1;
  admin.school = new School();
  admin.school.id = 1;
  admin.school.name = '학교명';
  admin.school.region = '지역명';

  const sampleFeed = {
    id: 1,
    title: '제목',
    content: '내용',
    schoolId: 1,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('학교 소식 CRUD', () => {
    it('추가', async () => {
      feedRepository.save.mockResolvedValue(sampleFeed);
      await service.create(sampleFeed, admin);
    });

    it('수정', async () => {
      feedRepository.save.mockResolvedValue(sampleFeed);
      feedRepository.findOne.mockReturnValue(sampleFeed);
      await service.update(sampleFeed.id, sampleFeed, admin);
    });

    it('수정실패', async () => {
      try {
        await service.update(sampleFeed.id, sampleFeed, admin);
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });

    it('삭제', async () => {
      jest.spyOn(service, 'remove').mockImplementation();
      await service.remove(sampleFeed.id, admin);
    });
    it('삭제실패', async () => {
      try {
        await service.remove(sampleFeed.id, admin);
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });
});
