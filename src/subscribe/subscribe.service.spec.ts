import { Test, TestingModule } from '@nestjs/testing';
import { SubscribeService } from './subscribe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscribe } from 'src/entities/subscribe.entity';
import { FeedModule } from 'src/feed/feed.module';
import { SchoolModule } from 'src/school/school.module';
import { SchoolService } from 'src/school/school.service';
import { FeedService } from 'src/feed/feed.service';
import { School } from 'src/entities/school.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('SubscribeService', () => {
  let service: SubscribeService;
  let subscribeRepository: MockRepository<Subscribe>;
  let schoolRepository: MockRepository<School>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FeedModule, SchoolModule],
      providers: [
        SubscribeService,
        { provide: getRepositoryToken(Subscribe), useValue: mockRepository() },
        { provide: getRepositoryToken(School), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<SubscribeService>(SubscribeService);

    subscribeRepository = module.get(getRepositoryToken(Subscribe));
    schoolRepository = module.get(getRepositoryToken(School));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
