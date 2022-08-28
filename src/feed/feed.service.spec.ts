import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { Feed } from '../entities/feed.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

const mockFeedRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('FeedService', () => {
  let service: FeedService;
  let feedRepository: MockRepository<Feed>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: getRepositoryToken(Feed),
          useValue: mockFeedRepository,
          useFactory: mockFeedRepository,
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    feedRepository = module.get<MockRepository<Feed>>(getRepositoryToken(Feed));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
