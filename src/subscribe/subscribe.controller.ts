import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { JwtUserGuard } from '../auth/jwt/jwt-user.guard';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @UseGuards(JwtUserGuard)
  @Post()
  subscribe(@Body() subscribeDto: SubscribeDto, @CurrentUser() user: User) {
    return this.subscribeService.subscribeToggle(subscribeDto, user);
  }

  @UseGuards(JwtUserGuard)
  @Get('/schools')
  findSchools(@CurrentUser() user: User) {
    return this.subscribeService.findSubscribeSchool(user.id);
  }

  @UseGuards(JwtUserGuard)
  @Get('/schools/:id')
  findFeedsBySchool(@Param('id') id: number, @CurrentUser() user: User) {
    return this.subscribeService.findFeedsBySchool(id, user.id);
  }
}
