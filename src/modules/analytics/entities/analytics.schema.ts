import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class SessionData {
  @Prop()
  collection_ref: string;

  @Prop()
  user_ref: string;

  @Prop()
  device: string;

  @Prop()
  browser: string;

  @Prop()
  os: string;

  @Prop()
  client_ip: string;

  @Prop()
  client_ips: string;

  @Prop()
  type: string;

  @Prop()
  host: string;

  @Prop()
  page_path: string;

  @Prop()
  page_title: string;

  @Prop()
  screen_size: string;

  @Prop()
  event_category: string;

  @Prop()
  event_action: string;

  @Prop()
  event_label: string;
}

@Schema()
export class Sessions {
  @Prop()
  id: string;

  @Prop()
  client_ip: string;

  @Prop()
  client_ips: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  language: string;

  @Prop()
  browser: string;

  @Prop()
  device: string;
}

export type SessionDataDocument = HydratedDocument<SessionData>;
export type SessionDocument = HydratedDocument<Sessions>;
export const SessionsSchema = SchemaFactory.createForClass(Sessions);
export const SessionDataSchema = SchemaFactory.createForClass(SessionData);
