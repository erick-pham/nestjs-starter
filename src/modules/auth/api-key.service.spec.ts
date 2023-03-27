import { CACHE_MANAGER, HttpException, HttpStatus } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiKeyService } from './api-key.service';
import * as Errors from 'src/constants/errors';
import { ApiKeyRepository } from './api-key.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/database/data-source';

describe('ApiKeyService', () => {
  let service: ApiKeyService;
  const mockApiKeyRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  });

  const mockCache = () => {
    find: jest.fn();
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
      providers: [
        ApiKeyService,

        {
          provide: CACHE_MANAGER,
          useFactory: mockCache
        },
        {
          provide: ApiKeyRepository,
          useFactory: mockApiKeyRepository
        }
      ]
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

test('verifyApiKey should throw HttpException with APIKEY_EXPIRED error if apiKey is expired', async () => {
  const cacheManagerMock = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(null)
  } as unknown as Cache;
  const apikeyRepositoryMock = {
    findOneBy: jest.fn().mockResolvedValue({
      apiSecret: 'hashedSecret.403a16e695f455da',
      expiredAt: new Date('2022-01-01')
    })
  } as unknown as ApiKeyRepository;
  const apiKeyService = new ApiKeyService(
    apikeyRepositoryMock,
    cacheManagerMock
  );
  const apiKey = 'validApiKey';
  const currentDate = new Date('2023-01-01');
  jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);

  await expect(apiKeyService.verifyApiKey(apiKey)).rejects.toThrow(
    new HttpException(Errors.APIKEY_EXPIRED, HttpStatus.UNAUTHORIZED)
  );

  expect(apikeyRepositoryMock.findOneBy).toHaveBeenCalledWith({
    apiKey: apiKey,
    isRevoked: false
  });
  expect(cacheManagerMock.get).toHaveBeenCalledWith(apiKey);
});

test('verifyApiKey should throw HttpException with APIKEY_INVALID error if apiKey is invalid', async () => {
  const cacheManagerMock = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(null)
  } as unknown as Cache;
  const apikeyRepositoryMock = {
    findOneBy: jest.fn().mockResolvedValue({
      apiSecret:
        '122dadecbcc134480a4d44acfab412429aa89122eec5e0dce51b4ae84ceb495345594cd4b5a69ee4b26356bec936218af76d6d6e60964457e026f465a53d0c43.403a16e695f455da',
      expiredAt: new Date('2023-01-02')
    })
  } as unknown as ApiKeyRepository;
  const apiKeyService = new ApiKeyService(
    apikeyRepositoryMock,
    cacheManagerMock
  );
  const apiKey = '84f843f0cf4473dc9cbe5f28ec1d14a7';
  const currentDate = new Date('2023-01-01');
  jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);

  await expect(apiKeyService.verifyApiKey(apiKey)).rejects.toThrow(
    new HttpException(Errors.APIKEY_INVALID, HttpStatus.UNAUTHORIZED)
  );

  expect(apikeyRepositoryMock.findOneBy).toHaveBeenCalledWith({
    apiKey: apiKey,
    isRevoked: false
  });
  expect(cacheManagerMock.get).toHaveBeenCalledWith(apiKey);
});

test('verifyApiKey should return apikey data', async () => {
  const cacheManagerMock = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(null)
  } as unknown as Cache;

  const mockData = {
    apiSecret:
      '022dadecbcc134480a4d44acfab412429aa89122eec5e0dce51b4ae84ceb495345594cd4b5a69ee4b26356bec936218af76d6d6e60964457e026f465a53d0c43.403a16e695f455da',
    expiredAt: new Date('2023-01-02')
  };
  const apikeyRepositoryMock = {
    findOneBy: jest.fn().mockResolvedValue(mockData)
  } as unknown as ApiKeyRepository;
  const apiKeyService = new ApiKeyService(
    apikeyRepositoryMock,
    cacheManagerMock
  );
  const apiKey = '84f843f0cf4473dc9cbe5f28ec1d14a7';
  const currentDate = new Date('2023-01-01');
  jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);

  const rs = await apiKeyService.verifyApiKey(apiKey);
  expect(rs).toEqual(mockData);
});

test('generateKeyAndSecret should save and return the newly created api key', async () => {
  const apikeyRepositoryMock = {
    save: jest.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      apiKey: 'newApiKey',
      apiSecret: 'hashedSecret',
      apiName: 'Test API',
      scopes: ['read', 'write'],
      expiredAt: new Date('2023-01-01')
    }),
    findOneById: jest.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      apiKey: 'newApiKey',
      apiSecret: 'hashedSecret',
      apiName: 'Test API',
      scopes: ['read', 'write'],
      expiredAt: new Date('2023-01-01')
    })
  } as unknown as ApiKeyRepository;
  const apiKeyService = new ApiKeyService(apikeyRepositoryMock, {} as any);
  const userId = 1;
  const registrationData = {
    apiName: 'Test API',
    scopes: ['read', 'write'],
    expiredAt: new Date('2023-01-01')
  };

  const result = await apiKeyService.generateKeyAndSecret(
    userId,
    registrationData
  );

  expect(apikeyRepositoryMock.save).toHaveBeenCalledWith({
    userId,
    apiKey: expect.any(String),
    apiSecret: expect.any(String),
    apiName: 'Test API',
    scopes: ['read', 'write'],
    expiredAt: new Date('2023-01-01')
  });
  expect(apikeyRepositoryMock.findOneById).toHaveBeenCalledWith(1);
  expect(result).toEqual({
    id: 1,
    userId: 1,
    apiKey: 'newApiKey',
    apiSecret: 'hashedSecret',
    apiName: 'Test API',
    scopes: ['read', 'write'],
    expiredAt: new Date('2023-01-01')
  });
});

test('revoke should update isRevoked to true for the given apiKey', async () => {
  const apikeyRepositoryMock = {
    update: jest.fn().mockResolvedValue(undefined)
  } as unknown as ApiKeyRepository;
  const apiKeyService = new ApiKeyService(apikeyRepositoryMock, {} as any);
  const apiKey = 'validApiKey';

  const result = await apiKeyService.revoke(apiKey);

  expect(apikeyRepositoryMock.update).toHaveBeenCalledWith(
    { apiKey },
    { isRevoked: true }
  );
  expect(result).toEqual(undefined);
});
