import { Test, TestingModule } from '@nestjs/testing';
import { SchoolModule } from 'src/school/school.module';
import { SubscribeController } from './subscribe.controller';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Subscribe } from 'src/entities/subscribe.entity';
import { SubscribeService } from './subscribe.service';
import { Repository } from 'typeorm';
import { School } from 'src/entities/school.entity';
import { SchoolService } from 'src/school/school.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('SubscribeController', () => {
  let controller: SubscribeController;
  let service: SubscribeService;
  let subscribeRepository: MockRepository<Subscribe>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscribeController],
      providers: [
        SubscribeService,
        SchoolService,
        { provide: getRepositoryToken(Subscribe), useValue: mockRepository() },
        { provide: getRepositoryToken(School), useValue: mockRepository() },
      ],
    }).compile();

    controller = module.get<SubscribeController>(SubscribeController);
    service = module.get(getRepositoryToken(Subscribe));
    subscribeRepository = module.get(getRepositoryToken(Subscribe));
  });

  const userArgs = {
    account: 'accountId',
    name: '테스터',
    password: 'pass',
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
