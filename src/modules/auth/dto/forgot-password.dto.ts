import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class ForgotPasswordPayloadDto {
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
}

export class ResetPasswordPayloadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  @MinLength(10)
  @ApiProperty({
    type: String,
    format: 'password',
    description: 'Your new password'
  })
  password: string;

  @IsString()
  @MaxLength(36)
  @IsOptional()
  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'The one time token to reset password',
    minLength: 36
  })
  token: string;
}
