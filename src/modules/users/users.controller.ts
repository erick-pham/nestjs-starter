import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { ApiResponse, getSchemaPath, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import * as GetUserExample from './dto/get-user-example';
import { PaginationParams } from 'src/shared/pagination-params';
import Role from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll(
    @Query()
    searchListAndPagination: PaginationParams
  ) {
    return this.usersService.searchForUsers(searchListAndPagination);
  }

  @ApiResponse({
    status: 200,
    description: 'Successful response',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(GetUserDto)
        },
        examples: {
          UserDetail1: { value: GetUserExample.example1 },
          UserDetail2: { value: GetUserExample.example2 },
          UserDetail3: { value: GetUserExample.example2 }
        }
      }
    }
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
