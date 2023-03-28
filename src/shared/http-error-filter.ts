import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  error: string;
  method: string;
  path: string;
  statusCode: number;
  timestamp: string;
  message?: string | object | any | '';
}
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestId = response.getHeader('requestId');

    // handle HttpException | Error, default status code=400
    let statusCode = 400;
    let errorResponse: ErrorResponse = {
      error: 'Bad Request',
      statusCode: statusCode,
      method: request.method,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: exception.message
    };

    // handle HttpException
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      if (typeof exception.getResponse() === 'string') {
        errorResponse.message = exception.getResponse() as string;
      } else {
        errorResponse = Object.assign(
          {},
          errorResponse,
          exception.getResponse()
        );
      }
    }
    errorResponse.statusCode = statusCode;

    if (statusCode >= 500 || process.env.DEBUG_MODE === 'true') {
      Logger.error(
        `${requestId}`,
        exception.stack,
        'InternalServerErrorException'
      );
    }

    if (statusCode >= 500) {
      errorResponse.message = 'Internal Server Error';
    }

    response.status(statusCode).json(errorResponse);
  }
}
