import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode
} from '@nestjs/common';
import { ApiHeader, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { RegisterApiKeyDto } from './dto/register-api-key.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import RequestWithUser from '../../shared/interfaces/request-with-user.interface';
import { ApiKeyService } from './api-key.service';
import { ApiKeyAuthGuard } from './guards/api-key.guard';

@ApiTags('Authentication-ApiKey')
@Controller('apikey')
export class ApiKeyController {
  constructor(private readonly apikeyService: ApiKeyService) {}

  @ApiCreatedResponse({
    description: 'Generate Api key and secret based on current user logged'
  })
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generateApiKeyAndSecret(
    @Req() req: RequestWithUser,
    @Body() registrationData: RegisterApiKeyDto
  ) {
    return this.apikeyService.generateKeyAndSecret(
      req.user.id,
      registrationData
    );
  }

  @UseGuards(ApiKeyAuthGuard)
  @HttpCode(204)
  @ApiHeader({ name: 'x-api-key', required: true })
  @Post('/revoke')
  async revoke(@Req() req: RequestWithUser) {
    return this.apikeyService.revoke(req.user.apiKey);
  }
}
