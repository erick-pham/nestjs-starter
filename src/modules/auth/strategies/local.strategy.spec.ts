import { HttpException, HttpStatus } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import * as Errors from 'src/constants/errors';
test('LocalStrategy - validate - should throw HttpException if user is not found', async () => {
  const authService = {
    validateUser: jest.fn().mockReturnValue(null)
  };
  const localStrategy = new LocalStrategy(authService as any);

  await expect(
    localStrategy.validate('test@test.com', 'password')
  ).rejects.toThrowError(
    new HttpException(Errors.USERNAME_OR_PASSWORD_WRONG, HttpStatus.BAD_REQUEST)
  );
});

test('LocalStrategy - validate - should return user if found', async () => {
  const user = { id: 1, email: 'test@test.com', password: 'password' };
  const authService = {
    validateUser: jest.fn().mockReturnValue(user)
  };
  const localStrategy = new LocalStrategy(authService as any);

  await expect(
    localStrategy.validate('test@test.com', 'password')
  ).resolves.toEqual(user);
});
