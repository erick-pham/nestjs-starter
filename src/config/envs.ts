import * as Joi from 'joi';

export interface EnvironmentVariables {
  PORT: number;
  TIMEOUT: string;
}

export const EnvsValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(
    'development',
    'production',
    'test',
    'provision'
  ),
  TIMEOUT: Joi.string().optional(),
  PORT: Joi.number().default(3000)
});
