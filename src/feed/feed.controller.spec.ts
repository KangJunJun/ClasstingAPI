import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feed } from 'src/entities/feed.entity';
import { DataSource } from 'typeorm';
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('FeedController', () => {
  let controller: FeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        { provide: getRepositoryToken(Feed), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<FeedController>(FeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
