import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import { dataSourceOptions } from 'src/database/data-source';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { AuthModule } from 'src/modules/auth/auth.module';
import { HttpErrorFilter } from './shared/http-error-filter';
import { HealthModule } from './modules/health/health.module';
import { EnvsValidationSchema } from './config/envs';
import { CoindeskModule } from './modules/coindesk/coindesk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: EnvsValidationSchema
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100
    }),
    UsersModule,
    AuthModule,
    HealthModule,
    CoindeskModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
