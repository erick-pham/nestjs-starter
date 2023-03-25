import {
  IsNumber,
  Min,
  IsOptional,
  IsString,
  Max,
  IsObject
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as qs from 'qs';

export class PaginationParams {
  @IsOptional()
  @IsString()
  @Type(() => String)
  searchTerm?: string;

  @ApiProperty({
    type: Number,
    default: 1,
    minimum: 1,
    required: false,
    description: 'The page of records'
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNumber = 1;

  @ApiProperty({
    type: Number,
    default: 10,
    minimum: 10,
    maximum: 100,
    required: false,
    description: 'The number of record each page'
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(100)
  pageSize = 10;

  @ApiProperty({
    type: String,
    default: '',
    required: false,
    description:
      'The list of attributes, separated by comma will be retrieved. It NOT given or empty, all attributes present in response. Example: id,createdAt'
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  attributes? = '';

  @ApiProperty({
    type: String,
    default: '',
    required: false,
    description:
      'The order of attributes. Use prefix "-" to sort DESC, no "-" to sort ASC. Example: -updatedAt,name'
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  order? = '';

  @ApiProperty({
    type: String,
    default: '',
    required: false,
    description:
      'Filter attribute with operator. Operators supported: eq,neq,in,gte,lte,startsWith,endsWith,substring. Example: filter[email][eq]=abc@gmail.com'
  })
  @IsOptional()
  @Type(() => Object)
  @IsObject()
  @Transform((value) => {
    return qs.parse(value.value);
  })
  filters?: Record<string, Record<string, string>>;
}
