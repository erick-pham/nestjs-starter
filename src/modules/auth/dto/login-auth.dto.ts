import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

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
