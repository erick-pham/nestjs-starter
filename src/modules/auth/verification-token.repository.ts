import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../model.repository';
import { VerificationTokenEntity } from './entities/verification-token.entity';

@Injectable()
export class VerificationRepository extends BaseRepository<VerificationTokenEntity> {
  constructor(
    @InjectRepository(VerificationTokenEntity)
    private readonly verificationRepository: Repository<VerificationTokenEntity>
  ) {
    super(verificationRepository);
  }
}
