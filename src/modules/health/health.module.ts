import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { EnvsHealthIndicator } from './envHealthIndicator';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [EnvsHealthIndicator]
})
export class HealthModule {}
