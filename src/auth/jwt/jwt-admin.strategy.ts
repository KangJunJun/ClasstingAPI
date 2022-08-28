import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.AdminAccessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('ADMIN_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any): Promise<any> {
    return { adminAccount: payload.account };
  }
}
