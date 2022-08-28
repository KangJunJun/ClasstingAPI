import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscribe } from '../entities/subscribe.entity';
import { SubscribeDto } from './dto/subscribe.dto';
import { User } from '../entities/user.entity';
import { SchoolService } from '../school/school.service';
import { FeedService } from '../feed/feed.service';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
    private readonly schoolService: SchoolService,
    private readonly feedService: FeedService,
  ) {}
  public async subscribeToggle(subscribeDto: SubscribeDto, user: User) {
    const checkSchool = await this.schoolService.getSchool(
      subscribeDto.schoolId,
    );

    if (!checkSchool) return;

    const existSubscribe = await this.subscribeRepository.findOne({
      where: {
        userId: user.id,
        schoolId: subscribeDto.schoolId,
      },
    });

    if (!existSubscribe) {
      const subscribe = await this.subscribeRepository.create({
        ...subscribeDto,
        user,
      });
      subscribe.deletedAt = null;
      this.subscribeRepository.save(subscribe);
      delete subscribe.user;
      return subscribe;
    } else return await this.subscribeRepository.softRemove(existSubscribe);
  }

  public async findSubscribeSchool(userId) {
    const sub = await this.subscribeRepository.find({
      where: { userId, deletedAt: null },
      relations: ['school'],
    });

    return await sub.map((x) => x.school);
  }

  public async findFeedsBySchool(schoolId, userId) {
    const checkSubscribe = await this.subscribeRepository.findOne({
      where: {
        userId,
        schoolId,
        deletedAt: null,
      },
    });

    if (!checkSubscribe)
      throw new UnauthorizedException(`This is an unsubscribed school.`);

    return await this.feedService.findFeedsBySchool(schoolId);
  }
}
