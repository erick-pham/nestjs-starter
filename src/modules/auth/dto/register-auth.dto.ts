import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    format: 'email',
    default: 'abc@example.com',
    description: 'Your email address',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    type: String,
    default: 'abc@123',
    description: 'your password',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    type: String,
    default: 'Join',
    description: 'Your name',
  })
  name: string;
}
