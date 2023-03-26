import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/database/data-source';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthenticationController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule],
      controllers: [AuthController],
      providers: [AuthService, JwtService]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { RegisterUserDto } from './dto/register-auth.dto';
import RequestWithUser from '../../shared/interfaces/request-with-user.interface';
import { Response as ResponseExpress } from 'express';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/users.repository';
import UserEntity from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUserRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        // {
        //   provide: UsersService,
        //   useFactory: mockUsersService
        // },
        {
          provide: UserRepository,
          useFactory: mockUserRepository
        }
      ]
    }).compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call authService.registerUser with the correct argument', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'email@gmail.com',
        password: 'password',
        name: 'name'
      };
      const getUserProfileSpy = jest.spyOn(authService, 'registerUser');
      const authServiceRegisterUserSpy = jest
        .spyOn(authService, 'registerUser')
        .mockResolvedValue(registerUserDto as unknown as UserEntity);

      await controller.registerUser(registerUserDto);
      expect(authServiceRegisterUserSpy).toHaveBeenCalled();
      expect(getUserProfileSpy).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('logIn', () => {
    it('should call authService.login with the correct argument', async () => {
      // const loginPayload: LoginPayloadDto = {
      //   email: 'testUser',
      //   password: 'testPassword'
      // };

      const tokenData = { access_token: 'testToken' };
      const req = { user: { id: 'testId' } } as unknown as RequestWithUser;
      const header: Record<string, any> = {};
      let response: any = null;
      const res = {
        setHeader: (key: string, value) => {
          header[key] = value;
        },
        send: (data: any | null) => {
          response = data;
        }
      } as ResponseExpress;
      const loginSpy = jest
        .spyOn(authService, 'login')
        .mockResolvedValue(tokenData);
      const getCookieSpy = jest
        .spyOn(authService, 'getCookieWithJwtToken')
        .mockReturnValue('testCookie');
      await controller.logIn(req, res);
      expect(loginSpy).toHaveBeenCalledWith(req.user);
      expect(getCookieSpy).toHaveBeenCalledWith(tokenData.access_token);
      expect(response).toEqual(tokenData);
      // expect(setHeaderSpy).toHaveBeenCalledWith('Set-Cookie', 'testCookie');
      // expect(sendSpy).toHaveBeenCalledWith(tokenData);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getUserProfile with the correct argument', async () => {
      const req = { user: { id: 'testId' } } as unknown as RequestWithUser;

      const authServiceGetUserProfileSpy = jest
        .spyOn(authService, 'getUserProfile')
        .mockResolvedValue({ id: 'testId' } as unknown as UserEntity);

      await controller.getProfile(req);
      expect(authServiceGetUserProfileSpy).toHaveBeenCalled();
      expect(authServiceGetUserProfileSpy).toHaveBeenCalledWith(req.user.id);
    });
  });

  describe('getUserLogout', () => {
    it('should call authService.getCookiesForLogOut and set the correct headers and cookies', () => {
      const header: Record<string, any> = {};
      const res = {
        setHeader: (key: string, value: any) => {
          header[key] = value;
        },
        clearCookie: jest.fn().mockImplementation((callback) => callback),
        status: jest.fn().mockImplementation(() => {
          return {
            send: jest.fn().mockReturnValue('OK')
          };
        }),
        send: jest.fn().mockReturnValue('OK')
      } as unknown as ResponseExpress;
      const getCookiesSpy = jest
        .spyOn(authService, 'getCookiesForLogOut')
        .mockReturnValue(['testCookies']);
      const setHeaderSpy = jest.spyOn(res, 'setHeader');
      const clearCookieSpy = jest.spyOn(res, 'clearCookie');
      const statusSpy = jest.spyOn(res, 'status');
      // const sendSpy = jest.spyOn(res, 'send');
      controller.getUserLogout(res);
      expect(getCookiesSpy).toHaveBeenCalled();
      expect(setHeaderSpy).toHaveBeenCalledWith('Set-Cookie', ['testCookies']);
      expect(clearCookieSpy).toHaveBeenCalledWith('access_token');
      expect(clearCookieSpy).toHaveBeenCalledWith('token');
      expect(statusSpy).toHaveBeenCalledWith(200);
      // expect(sendSpy).toHaveBeenCalledWith('OK');
    });
  });
});
