import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
export class GetUserDto extends CreateUserDto {
  @ApiProperty({
    type: String,
    default: null,
    description: 'User id',
  })
  id: number;

  @ApiProperty({
    type: String,
    default: 'inactive',
    description: 'User status',
  })
  status: string;
}
