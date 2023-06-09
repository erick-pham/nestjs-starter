import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CollectedAttributes } from './dto/collected-attributes';
import * as Errors from 'src/constants/errors';
import {
  SessionData,
  SessionDataDocument,
  Sessions,
  SessionDocument
} from './entities/analytics.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Sessions.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(SessionData.name)
    private sessionDataModel: Model<SessionDataDocument>
  ) {}

  async collect(
    collectedAttributes: CollectedAttributes,
    { browser, os, device, clientIPs }: any
  ): Promise<any> {
    const createdCat = new this.sessionDataModel({
      collection_ref: collectedAttributes.cid,
      user_ref: collectedAttributes.uid,
      device: device,
      browser: browser || null,
      os: os || null,
      client_ip: clientIPs[0] ? clientIPs[0] : null,
      client_ips: clientIPs.join(',') || null,
      type: collectedAttributes.t,
      host: collectedAttributes.dl || null,
      page_path: collectedAttributes.dp || null,
      page_title: collectedAttributes.dt || null,
      screen_size: collectedAttributes.sr || null,
      event_category: collectedAttributes.ec || null,
      event_action: collectedAttributes.ea || null,
      event_label: collectedAttributes.el || null
    });
    await createdCat.save();
    return;
  }
}
