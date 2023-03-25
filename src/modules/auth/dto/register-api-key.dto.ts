import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsISO8601
} from 'class-validator';

export class RegisterApiKeyDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    type: Array,
    format: 'string',
    default: [],
    examples: ['bs.AB', 'bs.AC'],
    required: false
  })
  scopes?: string[];

  @IsString()
  @MinLength(6)
  @MaxLength(256)
  @ApiProperty({
    type: String,
    default: 'Api key name',
    description: 'Name',
    minLength: 6,
    maxLength: 255
  })
  apiName: string;

  @IsISO8601({ strict: true })
  @ApiProperty({
    type: Date,
    default: '2023-03-25T02:13:11.119Z',
    description: 'Api key expired date'
  })
  expiredAt: Date;
}
