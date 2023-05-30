import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyRepository } from './api-key.repository';
import { ApiKeyEntity } from './entities/api-key.entity';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { VerificationRepository } from './verification-token.repository';
import { VerificationTokenEntity } from './entities/verification-token.entity';
import MSALServices from './msal.service';
import { HttpModule } from '@nestjs/axios';
import { AccountRepository } from './account.repository';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [
    CacheModule.register(),
    UsersModule,
    PassportModule,
    JwtModule.register(jwtConstants),
    TypeOrmModule.forFeature([
      ApiKeyEntity,
      VerificationTokenEntity,
      AccountEntity
    ]),
    HttpModule
  ],
  controllers: [AuthController, ApiKeyController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ApiKeyStrategy,
    ApiKeyService,
    ApiKeyRepository,
    VerificationRepository,
    MSALServices,
    AccountRepository
  ]
})
export class AuthModule {}
