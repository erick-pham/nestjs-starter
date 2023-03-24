import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  MinLength,
  MaxLength,
  IsOptional
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
}
