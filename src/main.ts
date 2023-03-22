import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
dotenv.config();

import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

async function bootstrap() {
  const instance = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          winston.format.colorize(),
          nestWinstonModuleUtilities.format.nestLike('MyApp', {
            // options
          }),
        ),
      }),
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          nestWinstonModuleUtilities.format.nestLike('MyApp', {
            // options
          }),
        ),
        dirname: './',
        level: 'error',
        filename: 'error.log',
      }),
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          nestWinstonModuleUtilities.format.nestLike('MyApp', {
            // options
          }),
        ),
        dirname: './',
        filename: 'combined.log',
      }),
      // other transports...
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
    cors: true,
  });
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
