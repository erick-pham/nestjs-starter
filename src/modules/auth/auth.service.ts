import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import { RegisterUserDto } from 'src/modules/auth/dto/register-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BCRYPT_SALT_ROUND, jwtConstants } from 'src/constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  public async registerUser(registrationData: RegisterUserDto) {
    const hashedPassword = await this.hashPassword(registrationData.password);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword
      });

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  public async validateUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      const isPasswordMatching = await this.verifyPassword(
        plainTextPassword,
        user.password + ''
      );

      if (isPasswordMatching) {
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUND);
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async getUserProfile(id: string) {
    return this.usersService.getById(id);
  }

  public getCookieWithJwtToken(token: string) {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.signOptions.expiresIn}`;
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }
}
