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
import {
  LoginEmailPayloadDto,
  LoginPayloadDto,
  LoginWithProviderPayloadDto
} from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import RequestWithUser from '../../shared/interfaces/request-with-user.interface';
import { Response as ResponseExpress } from 'express';
import { JwtOrApiKeyAuthGuard } from './guards/api-key-or-jwt.guard';
import {
  ForgotPasswordPayloadDto,
  ResetPasswordPayloadDto
} from './dto/forgot-password.dto';

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
  @Post('sign-in/credentials')
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

  @HttpCode(200)
  @Post('sign-in/email')
  async logInViaMagicLink(
    @Res() response: ResponseExpress,
    @Body() loginPayload: LoginEmailPayloadDto
  ) {
    const tokenData = await this.authService.loginViaEmail(loginPayload);
    response.status(tokenData.status).send(tokenData);
    return;
  }

  @HttpCode(200)
  @Post('sign-in/provider')
  async logInWithProvider(
    @Res() response: ResponseExpress,
    @Body() loginPayload: LoginWithProviderPayloadDto
  ) {
    const tokenData = await this.authService.loginWithProvider(loginPayload);
    response.status(tokenData.status).send(tokenData);
    return;
  }

  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(
    @Res() response: ResponseExpress,
    @Body() forgotPasswordPayload: ForgotPasswordPayloadDto
  ) {
    const tokenData = await this.authService.forgotPassword(
      forgotPasswordPayload
    );
    response.status(tokenData.status).send(tokenData);
    return;
  }

  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @Res() response: ResponseExpress,
    @Body() resetPasswordPayload: ResetPasswordPayloadDto
  ) {
    const tokenData = await this.authService.resetPassword(
      resetPasswordPayload
    );
    response.status(tokenData.status).send(tokenData);
    return;
  }

  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
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
