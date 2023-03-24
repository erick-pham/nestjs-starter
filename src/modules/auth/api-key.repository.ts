import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../model.repository';
import ApiKeyEntity from './entities/api-key.entity';

@Injectable()
export class ApiKeyRepository extends BaseRepository<ApiKeyEntity> {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apikeyRepository: Repository<ApiKeyEntity>
  ) {
    super(apikeyRepository);
  }
}
