import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SessionData,
  SessionDataSchema,
  Sessions,
  SessionsSchema
} from './entities/analytics.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    MongooseModule.forFeature([
      { name: Sessions.name, schema: SessionsSchema },
      { name: SessionData.name, schema: SessionDataSchema }
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
