import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService?.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
      algorithms: ['HS256'],
      issuer: configService?.get<string>('JWT_ISSUER'),
      audience: configService?.get<string>('JWT_AUDIENCE'),
    });
  }

  async validate(payload: Auth.User) {
    return payload;
  }
}
