import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import { RegisterUserDto } from 'src/modules/auth/dto/register-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BCRYPT_SALT_ROUND, jwtConstants } from 'src/constants/constants';
import { LoginEmailPayloadDto } from './dto/login-auth.dto';
import { VerificationRepository } from './verification-token.repository';
import MessagePatternResponse from 'src/shared/response/message-pattern-response';
import * as Errors from 'src/constants/errors';
import { generateKey } from 'src/shared/crypto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private verificationRepository: VerificationRepository
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
      if (!user) {
        return null;
      }
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

  async loginViaEmail(loginViaEmail: LoginEmailPayloadDto): Promise<any> {
    let currentUser = await this.usersService.getByEmail(loginViaEmail.email);
    /// New one if user not exists
    if (!currentUser) {
      currentUser = await this.usersService.create({
        name: '',
        email: loginViaEmail.email
      });
    }

    if (loginViaEmail.token) {
      const verifiedRs = await this.verificationRepository.findOneBy({
        token: loginViaEmail.token,
        identifier: loginViaEmail.email
      });

      if (!verifiedRs) {
        return new MessagePatternResponse()
          .setStatus(401)
          .sendErrors([Errors.TOKEN_INVALID]);
      }

      if (verifiedRs.isExpired || verifiedRs.expires < new Date()) {
        return new MessagePatternResponse()
          .setStatus(401)
          .sendErrors([Errors.TOKEN_EXPIRED]);
      }

      // generate access token
      const payload = { email: loginViaEmail.email, sub: currentUser.id };
      const res = {
        access_token: this.jwtService.sign(payload)
      };

      await this.verificationRepository.update(
        {
          id: verifiedRs.id
        },
        {
          isExpired: true
        }
      );

      return new MessagePatternResponse().send(res);
    } else {
      // send magic link
      const oneTimeToken = generateKey();
      await this.verificationRepository.save({
        identifier: loginViaEmail.email,
        token: oneTimeToken,
        expires: new Date(new Date().getTime() + 1000 * 60 * 30) // 30min
      });

      // send email
      //
      //
      const res = {
        token: oneTimeToken,
        email: loginViaEmail.email
      };
      return new MessagePatternResponse().send(res);
    }
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
