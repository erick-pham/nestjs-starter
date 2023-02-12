import { Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
