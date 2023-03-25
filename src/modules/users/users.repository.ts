import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../model.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    super(userRepository);
  }

  // customFindByEmail(email: string) {
  //   return this.userRepository
  //     .createQueryBuilder(UserEntity.name)
  //     .where('email = :email', { email })
  //     .getMany();
  // }
}
