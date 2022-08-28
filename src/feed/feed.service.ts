import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';
import { Admin } from '../entities/admin.entity';
import { Subscribe } from '../entities/subscribe.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

interface QueryBuilderPostsData {
  feed_id: number;
  feed_title: string;
  feed_content: string;
  feed_createdAt: Date;
  feed_updatedAt: Date;
  feed_schoolId: number;
}

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed) private feedRepository: Repository<Feed>,
    private dataSource: DataSource,
  ) {}

  async create(createFeedDto: CreateFeedDto, admin: Admin) {
    const school = admin.school;

    if (!school) {
      throw new HttpException(
        'This admin has not created a school',
        HttpStatus.NOT_FOUND,
      );
    }
    const feed = await this.feedRepository.create({
      ...createFeedDto,
      school,
    });

    await this.feedRepository.save(feed);
    return feed;
  }

  async findFeedsBySubscribe(userId: number) {
    const totalSubscribe = await this.dataSource
      .getRepository(Subscribe)
      .createQueryBuilder('subscribe')
      .innerJoin('subscribe.user', 'user')
      .innerJoin('subscribe.school', 'school')
      .where(`user.id = ${userId}`)
      .withDeleted();

    const result = await this.dataSource
      .getRepository(Feed)
      .createQueryBuilder('feed')
      .leftJoin(
        '(' + totalSubscribe.getQuery() + ')',
        'total_subs',
        'total_subs.subscribe_schoolId = feed.schoolId',
      )
      .where(
        '(subscribe_deletedAt is null and feed.updatedAt > subscribe_createdAt) or (subscribe_deletedAt is not null and feed.updatedAt < subscribe_deletedAt)',
      )
      .orderBy('feed.createdAt', 'DESC')
      .execute();

    const feeds = this.formatFeedData(result);

    return feeds;
  }

  async findFeedById(id: number) {
    const feed = await this.feedRepository.findOne({
      where: { id },
      relations: ['school'],
    });

    return feed;
  }

  async findFeedsBySchool(schoolId: number) {
    const feeds = await this.feedRepository.find({
      where: { school: { id: schoolId } },
      order: { id: 'DESC' },
    });

    return feeds;
  }

  async update(id: number, updateFeedDto: UpdateFeedDto, admin: Admin) {
    const feed = await this.feedRepository.findOne({ where: { id } });
    if (!feed) {
      throw new NotFoundException(`Feed with ID ${id} not found.`);
    }

    if (feed.schoolId !== admin?.school?.id) {
      throw new UnauthorizedException();
    }

    Object.assign(feed, updateFeedDto);

    const updatedFeed = await this.feedRepository.save(feed);

    return {
      message: `The feed(id: ${id}) was successfully updated.`,
      data: updatedFeed,
    };
  }

  async remove(id: number, admin: Admin) {
    const feed = await this.feedRepository.findOne({ where: { id } });
    if (!feed) {
      throw new NotFoundException(`Feed with ID ${id} not found.`);
    }

    if (feed.schoolId !== admin?.school?.id) {
      throw new UnauthorizedException();
    }

    const deletedFeed = await this.feedRepository.remove(feed);
    Object.assign(deletedFeed, {
      id,
    });
    return {
      message: `The feed(id: ${id}) was successfully deleted.`,
      data: deletedFeed,
    };
  }

  private formatFeedData(feedsData: QueryBuilderPostsData[]) {
    const feeds = feedsData.map((data) => {
      const feed = {
        id: data.feed_id,
        title: data.feed_title,
        content: data.feed_content,
        createdAt: data.feed_createdAt,
        updatedAt: data.feed_updatedAt,
        schoolId: data.feed_schoolId,
      };
      return feed;
    });

    return feeds;
  }
}
