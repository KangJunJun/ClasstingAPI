import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentAdminInterceptor } from './interceptors/current-admin.interceptor';
import { JwtAdminStrategy } from '../auth/jwt/jwt-admin.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    PassportModule,
    ConfigModule,
    JwtModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtAdminStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentAdminInterceptor,
    },
  ],
  exports: [AdminService, JwtAdminStrategy],
})
export class AdminModule {}
