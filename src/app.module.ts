import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import { dataSourceOptions } from 'src/database/data-source';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { AuthModule } from 'src/modules/auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
