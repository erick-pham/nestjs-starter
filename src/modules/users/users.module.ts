import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { UserRepository } from './users.repository';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
