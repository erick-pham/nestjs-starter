import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const referer = request.get('referer') || '';

    this.logger.log(`${method} ${originalUrl} - ${referer} ${userAgent} ${ip}`);
    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${referer} ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
