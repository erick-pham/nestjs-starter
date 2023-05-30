import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../model.repository';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountRepository extends BaseRepository<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>
  ) {
    super(accountRepository);
  }
}
