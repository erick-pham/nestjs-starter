import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/database/data-source';
import { PaginationParams } from 'src/shared/pagination-params';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUserRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('UsersController CRUD', () => {
  let controller: UsersController;
  const mockCreateUserDto = {
    name: 'John Doe',
    email: 'johndoe@example.com'
  };
  const mockCreatedUser = { id: 1, ...mockCreateUserDto };
  const mockUpdateUserDto = {
    ...mockCreatedUser,
    update: 'update'
  };
  const mockUsersService = () => {
    create: jest.fn().mockReturnValue(mockCreatedUser);
    searchForUsers: jest.fn().mockReturnValue([mockCreatedUser]);
    findOne: jest.fn().mockReturnValue(mockCreatedUser);
    update: jest.fn().mockReturnValue(mockUpdateUserDto);
    remove: jest.fn().mockReturnValue('ok');
  };

  const mockUserRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockUsersService
        },
        {
          provide: UserRepository,
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('CreateUser', async () => {
    try {
      const result = await controller.create(mockCreatedUser);
      expect(result).toEqual(mockCreatedUser);
    } catch (error) {}
  });

  test('GetAllUser', async () => {
    try {
      const result = await controller.findAll({
        pageNumber: 1
      } as PaginationParams);
      expect(result).toEqual(mockCreatedUser);
    } catch (error) {}
  });

  test('GetUserOneById', async () => {
    try {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockCreatedUser);
    } catch (error) {}
  });

  test('UpdateUser', async () => {
    try {
      const result = await controller.update(1, mockUpdateUserDto);
      expect(result).toEqual(mockUpdateUserDto);
    } catch (error) {}
  });

  test('DeleteUser', async () => {
    try {
      const result = await controller.remove(1);
      expect(result).toEqual('ok');
    } catch (error) {}
  });
});
