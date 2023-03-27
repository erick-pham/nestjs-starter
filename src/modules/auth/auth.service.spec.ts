import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/constants';
import { dataSourceOptions } from 'src/database/data-source';
import { UserRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-auth.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
describe('AuthService', () => {
  let service: AuthService;
  const mockUserRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

test('registerUser should create a new user with hashed password', async () => {
  const registrationData = {
    email: 'test@example.com',
    password: 'password123'
  };
  const hashedPassword = 'hashedPassword123';
  const createdUser = {
    id: '123',
    ...registrationData,
    password: hashedPassword
  };
  const usersService = {
    create: jest.fn().mockResolvedValue(createdUser)
  } as unknown as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  jest.spyOn(authService, 'hashPassword').mockResolvedValue(hashedPassword);

  const result = await authService.registerUser(
    registrationData as RegisterUserDto
  );

  expect(usersService.create).toHaveBeenCalledWith({
    ...registrationData,
    password: hashedPassword
  });
  expect(result).toEqual(createdUser);
});

test('registerUser should throw HttpException if user creation fails', async () => {
  const registrationData = {
    email: 'test@example.com',
    password: 'password123'
  };
  const usersService = {
    create: jest.fn().mockRejectedValue(new Error('User creation failed'))
  } as unknown as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  jest
    .spyOn(authService, 'hashPassword')
    .mockResolvedValue('hashedPassword123');

  await expect(
    authService.registerUser(registrationData as RegisterUserDto)
  ).rejects.toThrow(Error);
});

test('validateUser should return user if email and password match', async () => {
  const email = 'test@example.com';
  const plainTextPassword = 'password123';
  const hashedPassword = 'hashedPassword123';
  const user = { id: '123', email, password: hashedPassword };
  const usersService = {
    getByEmail: jest.fn().mockResolvedValue(user)
  } as unknown as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  jest.spyOn(authService, 'verifyPassword').mockResolvedValue(true);

  const result = await authService.validateUser(email, plainTextPassword);

  expect(usersService.getByEmail).toHaveBeenCalledWith(email);
  expect(authService.verifyPassword).toHaveBeenCalledWith(
    plainTextPassword,
    hashedPassword
  );
  expect(result).toEqual(user);
});

test('validateUser should return null if email and password do not match', async () => {
  const email = 'test@example.com';
  const plainTextPassword = 'password123';
  const hashedPassword = 'hashedPassword123';
  const user = { id: '123', email, password: hashedPassword };
  const usersService = {
    getByEmail: jest.fn().mockResolvedValue(user)
  } as unknown as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  jest.spyOn(authService, 'verifyPassword').mockResolvedValue(false);

  const result = await authService.validateUser(email, plainTextPassword);

  expect(usersService.getByEmail).toHaveBeenCalledWith(email);
  expect(authService.verifyPassword).toHaveBeenCalledWith(
    plainTextPassword,
    hashedPassword
  );
  expect(result).toBeNull();
});

test('validateUser should throw error if user cannot be found', async () => {
  const email = 'test@example.com';
  const plainTextPassword = 'password123';
  const usersService = {
    getByEmail: jest.fn().mockRejectedValue(new Error('User not found'))
  } as unknown as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  await expect(
    authService.validateUser(email, plainTextPassword)
  ).rejects.toThrow(Error);
});

test('hashPassword should return hashed password', async () => {
  const password = 'password123';
  const hashedPassword = 'hashedPassword123';
  // const bcryptMock = {
  //   hash: jest.fn().mockResolvedValue(hashedPassword)
  // };
  const usersService = {} as unknown as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  jest.spyOn(bcrypt, 'hash').mockReturnValue(hashedPassword);

  const result = await authService.hashPassword(password);

  expect(bcrypt.hash).toHaveBeenCalled();
  // expect(bcryptMock.hash).toHaveBeenCalledWith(password, BCRYPT_SALT_ROUND);
  expect(result).toEqual(hashedPassword);
});

test('verifyPassword should return true if passwords match', async () => {
  const plainTextPassword = 'password123';
  const hashedPassword = 'hashedPassword123';

  const usersService = {} as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  jest.spyOn(bcrypt, 'compare').mockReturnValue(true);

  const result = await authService.verifyPassword(
    plainTextPassword,
    hashedPassword
  );

  expect(bcrypt.compare).toHaveBeenCalled();
  expect(bcrypt.compare).toHaveBeenCalledWith(
    plainTextPassword,
    hashedPassword
  );
  expect(result).toBe(true);
});

test('verifyPassword should return false if passwords do not match', async () => {
  const plainTextPassword = 'password123';
  const hashedPassword = 'hashedPassword123';
  const usersService = {} as UsersService;
  const jwtService = {} as JwtService;

  const authService = new AuthService(usersService, jwtService);

  jest.spyOn(bcrypt, 'compare').mockReturnValue(false);

  const result = await authService.verifyPassword(
    plainTextPassword,
    hashedPassword
  );

  expect(bcrypt.compare).toHaveBeenCalled();
  expect(bcrypt.compare).toHaveBeenCalledWith(
    plainTextPassword,
    hashedPassword
  );
  expect(result).toBe(false);
});

test('login should return access token', async () => {
  const user = { id: '123', email: 'test@example.com' };
  const usersService = {} as UsersService;
  const jwtService = {
    sign: jest.fn().mockReturnValue('accessToken')
  } as unknown as JwtService;
  const authService = new AuthService(usersService, jwtService);

  const result = await authService.login(user);

  expect(jwtService.sign).toHaveBeenCalledWith({
    email: user.email,
    sub: user.id
  });
  expect(result).toEqual({ access_token: 'accessToken' });
});

test('getUserProfile should return user by id', async () => {
  const id = '123';
  const user = { id, email: 'test@example.com' };
  const usersService = {
    getById: jest.fn().mockResolvedValue(user)
  } as unknown as UsersService;
  const jwtService = {} as JwtService;
  const authService = new AuthService(usersService, jwtService);

  const result = await authService.getUserProfile(id);

  expect(usersService.getById).toHaveBeenCalledWith(id);
  expect(result).toEqual(user);
});

test('getCookieWithJwtToken should return cookie string', () => {
  const token = 'testToken';
  const expectedCookieString = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.signOptions.expiresIn}`;
  const usersService = {} as UsersService;
  const jwtService = {} as JwtService;
  const result = new AuthService(
    usersService,
    jwtService
  ).getCookieWithJwtToken(token);
  expect(result).toEqual(expectedCookieString);
});

test('getCookiesForLogOut should return array of cookie strings', () => {
  const usersService = {} as UsersService;
  const jwtService = {} as JwtService;
  const result = new AuthService(
    usersService,
    jwtService
  ).getCookiesForLogOut();
  expect(result).toEqual([
    'Authentication=; HttpOnly; Path=/; Max-Age=0',
    'Refresh=; HttpOnly; Path=/; Max-Age=0'
  ]);
});
