import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// import { plainToClass } from 'class-transformer';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import * as Errors from 'src/constants/errors';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UserRepository,
    private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.log('Create new user');
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.withRepository(this.usersRepository);
      const checkUser = await userRepository.findOneBy({
        email: createUserDto.email,
      });
      if (checkUser) {
        throw new HttpException(
          Errors.EMAIL_USED,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
        // throw new UnprocessableEntityException(Errors.EMAIL_USED);
      }
      return userRepository.save(createUserDto);
    });

    return this.usersRepository.save(createUserDto);
    // return 'This action adds a new user';
  }

  findAll(): Promise<UserEntity[]> {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.withRepository(this.usersRepository);
      return userRepository.find();
    });
    // return this.usersRepository.find();
    // return `This action returns all users`;
  }

  async findOne(id: number): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException(Errors.ENTITY_NOT_FOUND, HttpStatus.BAD_REQUEST);
      // throw new NotFoundException('Model not found');
    }
    return user;
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
