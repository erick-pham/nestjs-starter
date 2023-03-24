import { DataSource, DataSourceOptions } from 'typeorm';
import UserEntity from 'src/modules/users/entities/user.entity';
import ApiKeyEntity from 'src/modules/auth/entities/api-key.entity';
import { CreateUserTable1675951537962 } from 'src/database/migrations/1675951537962-CreateUserTable';
import { UpdateUserTable1676120407102 } from 'src/database/migrations/1676120407102-UpdateUserTable';
import { CreateApiKeyTable1679632259183 } from './migrations/1679632259183-CreateApiKeyTable';
// export const dataSourceOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: 'localhost',
//   username: 'root',
//   password: 'root',
//   database: 'test',
//   synchronize: false,
//   logging: true,
//   migrationsTableName: 'migrations',
//   entities: [UserEntity],
//   migrations: [],
//   // migrations: ['./dist/database/migrations/*.js'],
// };

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations',
  entities: [UserEntity, ApiKeyEntity],
  migrations: [
    CreateUserTable1675951537962,
    UpdateUserTable1676120407102,
    CreateApiKeyTable1679632259183
  ]
  // migrations: ['./dist/database/migrations/*.js'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
