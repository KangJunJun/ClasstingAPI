import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateFeedDto } from './create-feed.dto';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}
