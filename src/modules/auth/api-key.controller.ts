import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { RegisterApiKeyDto } from './dto/register-api-key.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { ApiKeyService } from './api-key.service';

@ApiTags('Authentication-ApiKey')
@ApiBearerAuth()
@Controller('api-key')
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
    console.log(req.user);
    return this.apikeyService.generateKeyAndSecret(
      req.user.id,
      registrationData
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/revoke')
  async revoke() {
    return this.apikeyService.revoke(1, 'a');
  }
}
