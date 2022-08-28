import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
