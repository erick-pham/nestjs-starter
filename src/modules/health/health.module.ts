import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { EnvsHealthIndicator } from './envHealthIndicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [EnvsHealthIndicator],
})
export class HealthModule {}
