import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
