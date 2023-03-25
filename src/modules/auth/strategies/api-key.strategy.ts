import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-strategy';
import { ApiKeyService } from '../api-key.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'apikey') {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super();
  }

  authenticate(req: Request, options?: any): void {
    let apiKey: string =
      (req.headers['x-api-key'] as string) ?? (req.query.api_key as string);

    if (!apiKey) {
      apiKey = req.headers['authorization'] as string;
      if (apiKey && apiKey.split(' ')[0] === 'Apikey' && apiKey.split(' ')[1]) {
        apiKey = apiKey.split(' ')[1];
      } else {
        apiKey = '';
      }
    }

    if (!apiKey) {
      return this.fail(new UnauthorizedException(), 401);
    }

    this.apiKeyService
      .verifyApiKey(apiKey)
      .then((apikeyData) => {
        if (!apikeyData) {
          this.fail(new UnauthorizedException(), 401);
        } else {
          const user = {
            id: apikeyData.userId,
            apiKey: apikeyData.apiKey
          };
          req.user = user;
          this.success(user, null);
        }
      })
      .catch((error) => this.error(error));
  }
}
