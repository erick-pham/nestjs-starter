import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  customFindByName(firstName: string, lastName: string) {
    return this.createQueryBuilder(UserEntity.name)
      .where('users.firstName = :firstName', { firstName })
      .andWhere('users.lastName = :lastName', { lastName })
      .getMany();
  }
}
