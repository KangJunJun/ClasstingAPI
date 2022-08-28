import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtUserGuard } from '../auth/jwt/jwt-user.guard';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  createUser(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const admin = await this.adminService.validateAdmin(loginDto);

    if (admin) {
      const { accessToken, ...accessOption } =
        this.adminService.getCookieWithJwtAccessToken(admin.account);

      res.cookie('AdminAccessToken', accessToken, accessOption);
      return admin;
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

    res.cookie('AdminAccessToken', '', accessOption);
  }
}
