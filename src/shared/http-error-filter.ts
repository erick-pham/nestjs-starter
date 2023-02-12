import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      method: request.method,
      path: request.url,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: exception.message,
    };

    Logger.warn(
      `${request.url}`,
      JSON.stringify({ ...errorResponse, stack: exception.stack }),
      'Exception',
    );
    response.status(httpStatus).json(errorResponse);
  }
}
