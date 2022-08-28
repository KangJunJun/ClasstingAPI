import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtUserGuard } from '../auth/jwt/jwt-user.guard';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.validateUser(loginDto);

    if (user) {
      const { accessToken, ...accessOption } =
        this.userService.getCookieWithJwtAccessToken(user.account);

      res.cookie('AccessToken', accessToken, accessOption);
      return user;
    }
  }

  @HttpCode(200)
  @UseGuards(JwtUserGuard)
  @Post('logout')
  async logOut(@Res({ passthrough: true }) res: Response) {
    const accessOption = {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 0,
    };

    res.cookie('AccessToken', '', accessOption);
  }
}
