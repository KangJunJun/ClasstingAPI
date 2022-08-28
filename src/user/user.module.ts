import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { JwtUserStrategy } from '../auth/jwt/jwt-user.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule,
    JwtModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtUserStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
  exports: [UserService, JwtUserStrategy],
})
export class UserModule {}
