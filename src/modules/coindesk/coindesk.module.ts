import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoindeskController } from './coindesk.controller';
import { CoindeskService } from './coindesk.service';

@Module({
  imports: [HttpModule],
  controllers: [CoindeskController],
  providers: [CoindeskService]
})
export class CoindeskModule {}
