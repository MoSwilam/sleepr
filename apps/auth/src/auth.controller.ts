import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
} from '@app/common';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in' })
  @Post('/login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwtToken = await this.authService.login(user, response);
    console.log({ jwtTokenFromAuthController: jwtToken });
    response.send(jwtToken);
  }

  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() data: any) {
    // console.log({ dataFromAuthController: data });
    return {
      ...data.user,
      id: data.user._id,
    };
    //  return await this.authService.loginMicroservice(data);
  }
}
