import { Test, TestingModule } from '@nestjs/testing';
import { FeedModule } from 'src/feed/feed.module';
import { SchoolModule } from 'src/school/school.module';
import { SubscribeController } from './subscribe.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscribe } from 'src/entities/subscribe.entity';
import { SubscribeService } from './subscribe.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('SubscribeController', () => {
  let controller: SubscribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchoolModule, FeedModule],
      controllers: [SubscribeController],
      providers: [
        SubscribeService,
        { provide: getRepositoryToken(Subscribe), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<SubscribeController>(SubscribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
