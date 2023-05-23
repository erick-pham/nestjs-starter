import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  error: true;
  errorCode: string;
  method: string;
  // path: string;
  statusCode: number;
  // timestamp: string;
  message?: string | object | any | '';
}
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestId = response.getHeader('request-id');

    // handle HttpException | Error, default status code=400
    let statusCode = 400;
    let errorResponse: ErrorResponse = {
      error: true,
      errorCode: 'BAD_REQUEST',
      statusCode: statusCode,
      method: request.method,
      // path: request.url,
      // timestamp: new Date().toISOString(),
      message: exception.message
    };

    // handle HttpException
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorResponse.errorCode = exception.name;
      if (typeof exception.getResponse() === 'string') {
        errorResponse.message = exception.getResponse() as string;
      } else {
        errorResponse = Object.assign(
          {},
          errorResponse,
          exception.getResponse()
        );
      }
    } else {
      statusCode = 500;
    }
    errorResponse.statusCode = statusCode;

    if (statusCode >= 500 || process.env.DEBUG_MODE === 'true') {
      Logger.error(
        errorResponse.errorCode,
        exception.stack,
        `HTTP#${requestId}`
      );
    }

    Logger.error(
      errorResponse.errorCode,
      errorResponse.message,
      `HTTP#${requestId}`
    );

    if (statusCode >= 500) {
      response
        .status(statusCode)
        .send(
          statusCode === 500 ? 'Internal Server Error' : errorResponse.message
        );
    } else {
      response.status(statusCode).json({
        error: true,
        errorCode: errorResponse.errorCode,
        errorMessage: errorResponse.message
      });
    }
  }
}
