import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @Post('register')
  async registerUser(@Body() registrationData: RegisterUserDto) {
    return this.authService.registerUser(registrationData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(
    @Req() req: RequestWithUser,
    @Body() loginPayload: LoginPayloadDto,
  ) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
