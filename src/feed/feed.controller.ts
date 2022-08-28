import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CurrentAdmin } from '../auth/decorators/current-admin.decorator';
import { Admin } from '../entities/admin.entity';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
import { JwtUserGuard } from '../auth/jwt/jwt-user.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAdminGuard)
  @Post()
  async createPost(
    @Body() createFeedDto: CreateFeedDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return this.feedService.create(createFeedDto, admin);
  }

  @Get(':id')
  findOneFeed(@Param('id') id: number) {
    return this.feedService.findFeedById(id);
  }

  @UseGuards(JwtUserGuard)
  @Get()
  findSubsribeFeed(@CurrentUser() user: User) {
    return this.feedService.findFeedsBySubscribe(user.id);
  }

  @UseGuards(JwtAdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateFeedDto: UpdateFeedDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return this.feedService.update(id, updateFeedDto, admin);
  }

  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @CurrentAdmin() admin: Admin) {
    return this.feedService.remove(id, admin);
  }
}
