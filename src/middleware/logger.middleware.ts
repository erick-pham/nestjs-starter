import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const referer = request.get('referer') || '';
    const requestId = uuidV4();

    request.headers['Request-Id'] = requestId;
    response.setHeader('Request-Id', requestId);

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${requestId} - ${method} ${originalUrl} ${statusCode} ${contentLength} - ${referer} ${userAgent} ${ip}`
      );
    });

    next();
  }
}
