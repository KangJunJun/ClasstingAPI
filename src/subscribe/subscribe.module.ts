import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from '../entities/subscribe.entity';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { SchoolModule } from '../school/school.module';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscribe]), SchoolModule],
  controllers: [SubscribeController],
  providers: [SubscribeService],
  exports: [SubscribeService],
})
export class SubscribeModule {}
