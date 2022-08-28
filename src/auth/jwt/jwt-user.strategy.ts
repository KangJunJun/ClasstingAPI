import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.AccessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('USER_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any): Promise<any> {
    return { userAccount: payload.account };
  }
}
