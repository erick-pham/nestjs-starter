import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import UserEntity from './entities/user.entity';
import {
  CreateUserDto,
  CreateUserWithPasswordDto
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import * as Errors from 'src/constants/errors';
import { PaginationParams } from 'src/shared/pagination-params';
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UserRepository,
    private dataSource: DataSource
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async create(
    createUserDto: CreateUserDto | CreateUserWithPasswordDto
  ): Promise<UserEntity> {
    this.logger.log('Create new user');
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.withRepository(
        this.usersRepository.getInstance()
      );
      const checkUser = await userRepository.findOneBy({
        email: createUserDto.email
      });
      if (checkUser) {
        throw new HttpException(
          Errors.EMAIL_USED,
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
      return userRepository.save(createUserDto);
    });
  }

  async getById(id: string) {
    const user = await this.usersRepository.findOneById(id);
    if (user) {
      return user;
    }
    throw new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  findAll(): Promise<UserEntity[]> {
    // return this.dataSource.transaction(async (manager) => {
    //   const userRepository = manager.withRepository(this.usersRepository);
    //   return userRepository.find();
    // });
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { id }
    });
    if (!user) {
      throw new HttpException(Errors.ENTITY_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  searchForUsers(searchListAndPagination: PaginationParams) {
    return this.usersRepository.search(searchListAndPagination);
  }
}
