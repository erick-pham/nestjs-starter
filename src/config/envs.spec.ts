import * as Joi from 'joi';
import { EnvironmentVariables, EnvsValidationSchema } from './envs';

describe('EnvsValidationSchema', () => {
  it('should validate valid environment variables', () => {
    const envs: EnvironmentVariables = {
      PORT: 8080,
      TIMEOUT: '30s'
    };
    const { error } = EnvsValidationSchema.validate(envs);
    expect(error).toBeUndefined();
  });

  it('should throw an error if invalid environment variables are provided', () => {
    const envs = {
      PORT: 'invalid',
      TIMEOUT: '30s'
    };
    const { error } = EnvsValidationSchema.validate(envs);
    expect(error).toBeDefined();
    expect(error).toHaveProperty('name', 'ValidationError');
  });

  it('should provide defaults for missing environment variables', () => {
    const envs: Partial<EnvironmentVariables> = {
      TIMEOUT: '30s'
    };
    const { value } = EnvsValidationSchema.validate(envs);
    expect(value).toHaveProperty('PORT', 3000);
  });
});
