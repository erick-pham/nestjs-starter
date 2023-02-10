import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
// import { plainToClass } from 'class-transformer';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersRepository.save(createUserDto);
    // return 'This action adds a new user';
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
    // return `This action returns all users`;
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
    // return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // transform(model: UserEntity, transformOptions = {}): ModelEntity {
  //   return plainToClass(ModelEntity, model, transformOptions) as ModelEntity;
  // }

  // transformMany(model: UserEntity[], transformOptions = {}): ModelEntity[] {
  //   return model.map((model) => this.transform(model, transformOptions));
  // }
}
