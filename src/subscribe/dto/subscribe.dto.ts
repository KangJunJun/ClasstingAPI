import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubscribeDto {
  @IsNumber()
  @IsNotEmpty()
  schoolId: number;
}
