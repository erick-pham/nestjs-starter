import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class LoginPayloadDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'email',
    default: 'abc@example.com',
    description: 'Your email address'
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    type: String,
    default: 'abc@123',
    description: 'your password',
    minLength: 6
  })
  password: string;
}

export class LoginEmailPayloadDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'email',
    default: 'abc@example.com',
    description: 'Your email address'
  })
  email: string;

  @IsString()
  @MaxLength(36)
  @IsOptional()
  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description:
      'The one time token to login with magic link. Consumer send this token and email back to Auth service to retrieve access token',
    minLength: 36
  })
  token: string;
}
