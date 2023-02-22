import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import * as Joi from 'joi';

@Injectable()
export class EnvsHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const schema = Joi.object({
        NODE_ENV: Joi.string().required(),
        BCRYPT_SALT_ROUND: Joi.number().required(),
        DB_LOGGING: Joi.string().required(),
      });

      const { error, value } = schema.validate(process.env, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        return this.getStatus(key, false, {
          messages: error.details.map((i: any) => i.message),
        });
      }
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'EnvsHealthIndicator failed',
        this.getStatus(key, false),
      );
    }
  }
}
