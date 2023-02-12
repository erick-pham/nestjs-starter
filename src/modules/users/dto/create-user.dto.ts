import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    type: String,
    default: 'Join',
    description: 'Your name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    format: 'email',
    default: 'abc@example.com',
    description: 'Your email address',
  })
  email: string;
}

export class CreateUserWithPasswordDto extends CreateUserDto {
  @IsString()
  password: string;
}
