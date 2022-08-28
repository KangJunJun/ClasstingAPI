import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';

@Module({
  controllers: [FeedController],
  providers: [FeedService],
  imports: [TypeOrmModule.forFeature([Feed])],
  exports: [FeedService],
})
export class FeedModule {}
