import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtStrategy]
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
  });

  it('JwtStrategy should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should return the payload', async () => {
    const payload = { sub: '1234567890', email: 'john.doe@example.com' };
    expect(await jwtStrategy.validate(payload)).toEqual({
      id: '1234567890',
      email: 'john.doe@example.com'
    });
  });
});
