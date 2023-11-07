import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { ITokenPayload } from "../users/interfaces/token.payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(
    configService: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.cookies?.Authentication || request?.Authentication
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: ITokenPayload): Promise<any> {
    try {
      return await this.userService.getUser({ _id: userId });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}