// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Set to true if you want to ignore token expiration
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { _id: payload.sub, email: payload.email };
  }
}
