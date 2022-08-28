import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/user/user.module';
import { AdminModule } from '../src/admin/admin.module';
import { SubscribeModule } from '../src/subscribe/subscribe.module';
import { SchoolModule } from '../src/school/school.module';
import { FeedModule } from '../src/feed/feed.module';
import cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UserModule,
        AdminModule,
        SubscribeModule,
        SchoolModule,
        FeedModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request
      .default(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Admin Login Test', () => {
    it('없는 계정 로그인', () => {
      return request
        .default(app.getHttpServer())
        .post('/admin/login')
        .send({
          account: 'tester5',
          password: '123123',
        })
        .expect(404);
    });

    it('계정 생성', () => {
      return request
        .default(app.getHttpServer())
        .post('/admin')
        .send({
          account: 'tester5',
          name: '테스터',
          password: '123123',
        })
        .expect(201);
    });
    it('로그인', () => {
      return request
        .default(app.getHttpServer())
        .post('/admin/login')
        .send({
          account: 'tester5',
          password: '123123',
        })
        .expect(200);
    });
  });
});
