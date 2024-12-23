import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from '.prisma/client';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in' })
  @Post('/login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwtToken = await this.authService.login(user, response);
    console.log({ jwtTokenFromAuthController: jwtToken });
    response.send(jwtToken);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    // console.log({ dataFromAuthController: data });
    return data.user;
    //  return await this.authService.loginMicroservice(data);
  }
}
