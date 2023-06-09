import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Types {
  Pageview = 'pageview',
  Event = 'event'
}

export class CollectedAttributes {
  @ApiProperty({
    type: String,
    default: 'abc2.afa',
    required: true,
    description: 'Session id'
  })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    type: String,
    default: 'A-AB-124RGH#',
    required: true,
    description: 'Collection Ref ID'
  })
  @IsString()
  @IsNotEmpty()
  cid: string;

  @ApiProperty({
    type: String,
    default: 'pageview',
    required: true,
    description: 'Collection type. pageview/event'
  })
  @IsEnum(Types)
  @IsNotEmpty()
  @IsString()
  t: Types;

  @ApiProperty({
    type: String,
    default: 'http://localhost:3000',
    description: 'Desc location'
  })
  dl: string;

  @ApiProperty({
    type: String,
    default: '/about',
    description: 'Page path'
  })
  dp: string;

  @ApiProperty({
    type: String,
    default: 'home',
    description: 'Page title'
  })
  dt: string;

  @ApiProperty({
    type: String,
    default: '1920x1080',
    required: false,
    description: 'screen size'
  })
  sr: string;

  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'Event cat'
  })
  ec: string;

  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'Event action'
  })
  ea: string;

  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'Event label'
  })
  el: string;

  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'Language'
  })
  user_lang: string;

  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'Geo lat'
  })
  g_lat: string;

  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'Geo lon'
  })
  g_lon: string;

  @ApiProperty({
    type: String,
    default: null,
    required: false,
    description: 'Geo accuracy'
  })
  g_acc: string;
}
