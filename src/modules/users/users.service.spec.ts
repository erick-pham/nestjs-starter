import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/database/data-source';
import { PaginationParams } from 'src/shared/pagination-params';
import * as Errors from 'src/constants/errors';
import { DataSource } from 'typeorm';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// test('create method should create a new user', async () => {
//   const mockUserRepository = {
//     getInstance: jest.fn().mockReturnValue({}),
//     findOneBy: jest.fn().mockReturnValue(null),
//     save: jest.fn().mockReturnValue({ id: 1, name: 'John Doe' })
//   };
//   const mockDataSource = {
//     transaction: jest
//       .fn()
//       .mockImplementation((callback) => callback(mockUserRepository))
//   };
//   const usersService = new UsersService(
//     mockUserRepository as unknown as UserRepository,
//     mockDataSource as unknown as DataSource
//   );
//   const createUserDto = { name: 'John Doe', email: 'johndoe@example.com' };
//   const result = await usersService.create(createUserDto);
//   expect(mockDataSource.transaction).toHaveBeenCalled();
//   expect(mockUserRepository.getInstance).toHaveBeenCalled();
//   expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
//     email: createUserDto.email
//   });
//   expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
//   expect(result).toEqual({ id: 1, name: 'John Doe' });
// });

// test('create method should throw an error if email is already used', async () => {
//   const mockUserRepository = {
//     getInstance: jest.fn().mockReturnValue({}),
//     findOneBy: jest.fn().mockReturnValue({
//       id: 1,
//       name: 'John Doe',
//       email: 'johndoe@example.com'
//     })
//   };
//   const mockDataSource = {
//     transaction: jest
//       .fn()
//       .mockImplementation((callback) => callback(mockUserRepository))
//   };
//   const usersService = new UsersService(
//     mockUserRepository as unknown as UserRepository,
//     mockDataSource as unknown as DataSource
//   );
//   const createUserDto = { name: 'John Doe', email: 'johndoe@example.com' };
//   await expect(usersService.create(createUserDto)).rejects.toThrowError(
//     new HttpException(Errors.EMAIL_USED, HttpStatus.UNPROCESSABLE_ENTITY)
//   );
// });

test('getById method should return a user by id', async () => {
  const mockUserRepository = {
    findOneById: jest.fn().mockReturnValue({ id: 1, name: 'John Doe' })
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  const result = await usersService.getById('1');
  expect(mockUserRepository.findOneById).toHaveBeenCalledWith('1');
  expect(result).toEqual({ id: 1, name: 'John Doe' });
});

test('getById method should throw an error if user is not found', async () => {
  const mockUserRepository = {
    findOneById: jest.fn().mockReturnValue(null)
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  await expect(usersService.getById('1')).rejects.toThrowError(
    new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
  );
});

test('getByEmail method should return a user by email', async () => {
  const mockUserRepository = {
    findOne: jest.fn().mockReturnValue({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com'
    })
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  const result = await usersService.getByEmail('johndoe@example.com');
  expect(mockUserRepository.findOne).toHaveBeenCalledWith({
    where: { email: 'johndoe@example.com' }
  });
  expect(result).toEqual({
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com'
  });
});

test('getByEmail method should throw an error if user is not found', async () => {
  const mockUserRepository = {
    findOne: jest.fn().mockReturnValue(null)
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  await expect(
    usersService.getByEmail('johndoe@example.com')
  ).rejects.toThrowError(
    new HttpException(Errors.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND)
  );
});

test('findAll method should return a list of users', async () => {
  const mockUserRepository = {
    find: jest.fn().mockReturnValue([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  const result = await usersService.findAll();
  expect(mockUserRepository.find).toHaveBeenCalled();
  expect(result).toEqual([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ]);
});

test('findOne method should return a user by id', async () => {
  const mockUserRepository = {
    findOne: jest.fn().mockReturnValue({ id: 1, name: 'John Doe' })
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  const result = await usersService.findOne(1);
  expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  expect(result).toEqual({ id: 1, name: 'John Doe' });
});

test('findOne method should throw an error if user is not found', async () => {
  const mockUserRepository = {
    findOne: jest.fn().mockReturnValue(null)
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  await expect(usersService.findOne(1)).rejects.toThrowError(
    new HttpException(Errors.ENTITY_NOT_FOUND, HttpStatus.BAD_REQUEST)
  );
});

test('update method should return a message', async () => {
  const mockUserRepository = {};
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  const result = await usersService.update(1, { name: 'John Doe' });
  expect(result).toEqual('This action updates a #1 user');
});

test('remove method should return a message', async () => {
  const mockUserRepository = {};
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  const result = await usersService.remove(1);
  expect(result).toEqual('This action removes a #1 user');
});

test('searchForUsers method should return a list of users', async () => {
  const mockUserRepository = {
    search: jest.fn().mockReturnValue([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(mockUserRepository))
  };
  const usersService = new UsersService(
    mockUserRepository as unknown as UserRepository,
    mockDataSource as unknown as DataSource
  );
  const searchListAndPagination: PaginationParams = {
    searchTerm: 'John',
    pageSize: 10,
    pageNumber: 0
  };
  const result = await usersService.searchForUsers(searchListAndPagination);
  expect(mockUserRepository.search).toHaveBeenCalledWith(
    searchListAndPagination
  );
  expect(result).toEqual([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ]);
});
