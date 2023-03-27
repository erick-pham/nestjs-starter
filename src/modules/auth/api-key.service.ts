import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RegisterApiKeyDto } from './dto/register-api-key.dto';
import {
  generateKey,
  generateSecretHash,
  compareKeys
} from 'src/shared/crypto';
import { ApiKeyRepository } from './api-key.repository';
import * as Errors from 'src/constants/errors';
import ApiKeyEntity from './entities/api-key.entity';
@Injectable()
export class ApiKeyService {
  constructor(
    private apikeyRepository: ApiKeyRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  public async verifyApiKey(apiKey: string) {
    let dbApiKey = await this.cacheManager.get<ApiKeyEntity | null>(apiKey);

    if (!dbApiKey) {
      dbApiKey = await this.apikeyRepository.findOneBy({
        apiKey: apiKey,
        isRevoked: false
      });

      await this.cacheManager.set(apiKey, dbApiKey, 1 * 60 * 60 * 1000);
    }

    if (dbApiKey && dbApiKey.expiredAt && dbApiKey.expiredAt < new Date()) {
      throw new HttpException(Errors.APIKEY_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    if (!dbApiKey || !compareKeys(dbApiKey.apiSecret, apiKey)) {
      throw new HttpException(Errors.APIKEY_INVALID, HttpStatus.UNAUTHORIZED);
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
      scopes: registrationData.scopes,
      expiredAt: registrationData.expiredAt
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
