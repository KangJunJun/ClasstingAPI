import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../auth/dto/login.dto';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(account: string) {
    const user = await this.userRepository.findOne({
      where: { account },
      relations: ['subscribe'],
    });
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this account does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async validateUser(loginDto: LoginDto) {
    const account = await this.getUser(loginDto.account);

    const passwordCheck = await Bcrypt.compare(
      loginDto.password,
      account.password,
    );
    if (!passwordCheck) {
      throw new HttpException('password is incorrect.', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async createUser(createUserDto: CreateUserDto) {
    // Encode User Password
    const salt = await Bcrypt.genSalt(10);
    const password = await Bcrypt.hash(createUserDto.password, salt);

    const checkUser = await this.userRepository.findOne({
      where: { account: createUserDto.account },
    });
    if (checkUser) {
      throw new HttpException('The same account exists.', HttpStatus.CONFLICT);
    }

    const user = await this.userRepository.create({
      ...createUserDto,
      password,
    });

    return await this.userRepository.save(user);
  }

  getCookieWithJwtAccessToken(account: string) {
    const payload = { account };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('USER_ACCESS_TOKEN_SECRET'),
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
