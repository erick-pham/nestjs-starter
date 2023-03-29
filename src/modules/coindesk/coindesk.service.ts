import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { map, catchError } from 'rxjs';

@Injectable()
export class CoindeskService {
  private readonly logger = new Logger(CoindeskService.name);
  constructor(private http: HttpService) {}
  async getBitcoinPriceUSD() {
    return this.http
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .pipe(map((res) => res.data?.bpi))
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message, error.config);
          throw new Error('API not available');
        })
      );
  }
}
