import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import OrmConfig, { envFilePath } from './ormConfig';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { FeedModule } from './feed/feed.module';
import { SchoolModule } from './school/school.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [envFilePath],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(OrmConfig as TypeOrmModuleOptions),
    UserModule,
    AdminModule,
    SubscribeModule,
    SchoolModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log(envFilePath);
    console.log(OrmConfig);
  }
}
