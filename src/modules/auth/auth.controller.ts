import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import RequestWithUser from '../../shared/interfaces/request-with-user.interface';
import { Response as ResponseExpress } from 'express';
import { JwtOrApiKeyAuthGuard } from './guards/api-key-or-jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.'
  })
  @Post('register')
  async registerUser(@Body() registrationData: RegisterUserDto) {
    return this.authService.registerUser(registrationData);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async logIn(
    @Req() req: RequestWithUser,
    @Res() response: ResponseExpress,
    @Body() loginPayload: LoginPayloadDto
  ) {
    const tokenData = await this.authService.login(req.user);
    const cookie = this.authService.getCookieWithJwtToken(
      tokenData.access_token
    );
    response.setHeader('Set-Cookie', cookie);
    response.send(tokenData);
    return;
  }

  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getUserProfile(req.user.id as unknown as string);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/logout')
  async getUserLogout(@Res() response: ResponseExpress) {
    response.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    response.clearCookie('access_token');
    response.clearCookie('token');
    response.status(200).send('OK');
    return;
  }
}
