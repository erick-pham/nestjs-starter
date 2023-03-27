import { Test } from '@nestjs/testing';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { RegisterApiKeyDto } from './dto/register-api-key.dto';
import RequestWithUser from '../../shared/interfaces/request-with-user.interface';
import { HttpException } from '@nestjs/common';
import ApiKeyEntity from './entities/api-key.entity';

describe('ApiKeyController', () => {
  let apiKeyController: ApiKeyController;
  let apiKeyService: ApiKeyService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [
        {
          provide: ApiKeyService,
          useValue: {
            generateKeyAndSecret: jest.fn(),
            revoke: jest.fn()
          }
        }
      ]
    }).compile();

    apiKeyService = moduleRef.get<ApiKeyService>(ApiKeyService);
    apiKeyController = moduleRef.get<ApiKeyController>(ApiKeyController);
  });

  describe('generateApiKeyAndSecret', () => {
    const user = { id: 1 };
    const apiKeyDto: RegisterApiKeyDto = {
      apiName: 'Test API',
      scopes: ['read', 'write'],
      expiredAt: new Date()
    };

    it('should call generateKeyAndSecret with correct arguments', async () => {
      const generateKeyAndSecretSpy = jest.spyOn(
        apiKeyService,
        'generateKeyAndSecret'
      );
      const expectedResult = {} as ApiKeyEntity;
      generateKeyAndSecretSpy.mockResolvedValue(expectedResult);

      const requestWithUser: RequestWithUser = { user } as RequestWithUser;

      const result = await apiKeyController.generateApiKeyAndSecret(
        requestWithUser,
        apiKeyDto
      );

      expect(result).toEqual(expectedResult);
      expect(generateKeyAndSecretSpy).toHaveBeenCalledWith(user.id, apiKeyDto);
    });

    it('should throw HttpException if generateKeyAndSecret throws an error', async () => {
      const generateKeyAndSecretSpy = jest.spyOn(
        apiKeyService,
        'generateKeyAndSecret'
      );
      const errorMessage = 'Unable to generate API key and secret';
      generateKeyAndSecretSpy.mockRejectedValue(new Error(errorMessage));

      const requestWithUser: RequestWithUser = { user } as RequestWithUser;

      await expect(
        apiKeyController.generateApiKeyAndSecret(requestWithUser, apiKeyDto)
      ).rejects.toThrow(new HttpException(errorMessage, 500));
    });
  });

  describe('revoke', () => {
    const user = { apiKey: '1234' };
    const requestWithUser: RequestWithUser = { user } as RequestWithUser;

    it('should call revoke with correct arguments', async () => {
      const revokeSpy = jest.spyOn(apiKeyService, 'revoke');
      revokeSpy.mockResolvedValue();

      const result = await apiKeyController.revoke(requestWithUser);

      expect(result).toEqual(undefined);
      expect(revokeSpy).toHaveBeenCalledWith(user.apiKey);
    });

    it('should throw HttpException if revoke throws an error', async () => {
      const revokeSpy = jest.spyOn(apiKeyService, 'revoke');
      const errorMessage = 'Unable to revoke API key';
      revokeSpy.mockRejectedValue(new Error(errorMessage));

      await expect(apiKeyController.revoke(requestWithUser)).rejects.toThrow(
        new HttpException(errorMessage, 500)
      );
    });
  });
});
