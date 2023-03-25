import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterApiKeyDto } from './dto/register-api-key.dto';
import {
  generateKey,
  generateSecretHash,
  compareKeys
} from 'src/shared/crypto';
import { ApiKeyRepository } from './api-key.repository';
import * as Errors from 'src/constants/errors';
@Injectable()
export class ApiKeyService {
  constructor(private apikeyRepository: ApiKeyRepository) {}

  public async verifyApiKey(apiKey: string) {
    const dbApiKey = await this.apikeyRepository.findOneBy({
      apiKey: apiKey,
      isRevoked: false
    });

    if (!dbApiKey || !compareKeys(dbApiKey.apiSecret, apiKey)) {
      throw new HttpException(Errors.INVALID_APIKEY, HttpStatus.UNAUTHORIZED);
    }
    return dbApiKey;
  }

  public async generateKeyAndSecret(
    userId: number,
    registrationData: RegisterApiKeyDto
  ) {
    const apiKey: string = generateKey();
    const apiSecretHashed: string = generateSecretHash(apiKey);
    const dbCreated = await this.apikeyRepository.save({
      userId,
      apiKey: apiKey,
      apiSecret: apiSecretHashed,
      apiName: registrationData.apiName,
      scopes: registrationData.scopes
    });
    return this.apikeyRepository.findOneById(dbCreated.id);
  }

  public async revoke(apiKey: string) {
    const dbUpdatedResult = await this.apikeyRepository.update(
      { apiKey },
      { isRevoked: true }
    );
    return dbUpdatedResult;
  }
}
