import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async getSchool(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['school'],
    });
    if (admin) {
      return admin.school;
    }

    throw new HttpException(
      'Admin with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAdmin(account: string) {
    const admin = await this.adminRepository.findOne({
      where: { account },
      relations: ['school'],
    });
    if (admin) {
      return admin;
    }

    throw new HttpException(
      'Admin with this account does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async validateAdmin(loginDto: LoginDto) {
    const account = await this.getAdmin(loginDto.account);

    const passwordCheck = await Bcrypt.compare(
      loginDto.password,
      account.password,
    );
    if (!passwordCheck) {
      throw new HttpException('password is incorrect.', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    // Encode User Password
    const salt = await Bcrypt.genSalt(10);
    const password = await Bcrypt.hash(createAdminDto.password, salt);

    const checkAdmin = await this.adminRepository.findOne({
      where: { account: createAdminDto.account },
    });
    if (checkAdmin) {
      throw new HttpException('The same account exists.', HttpStatus.CONFLICT);
    }

    const admin = await this.adminRepository.create({
      ...createAdminDto,
      password,
    });

    await this.adminRepository.save(admin);
    return admin;
  }

  getCookieWithJwtAccessToken(account: string) {
    const payload = { account };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('ADMIN_ACCESS_TOKEN_SECRET'),
      expiresIn: `360m`,
    });

    return {
      accessToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 360 * 60 * 1000,
    };
  }
}
