import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from '../users/interfaces/token.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headeers?.Authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: ITokenPayload): Promise<any> {
    try {
      return await this.userService.getUser({ id: userId.toString() });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
