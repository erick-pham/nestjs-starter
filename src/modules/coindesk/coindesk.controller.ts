import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoindeskService } from './coindesk.service';

@ApiTags('Coindesk')
@Controller('coindesk')
export class CoindeskController {
  constructor(private apiService: CoindeskService) {}

  @Get('price/bitcoin')
  getBitcoinPrice() {
    return this.apiService.getBitcoinPriceUSD();
  }
}
