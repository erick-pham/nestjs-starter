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

@Module({
  imports: [
    CacheModule.register(),
    UsersModule,
    PassportModule,
    JwtModule.register(jwtConstants),
    TypeOrmModule.forFeature([ApiKeyEntity])
  ],
  controllers: [AuthController, ApiKeyController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ApiKeyStrategy,
    ApiKeyService,
    ApiKeyRepository
  ]
})
export class AuthModule {}
