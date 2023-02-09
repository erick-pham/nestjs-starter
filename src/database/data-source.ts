import { DataSource, DataSourceOptions } from 'typeorm';
import UserEntity from 'src/modules/users/entities/user.entity';

import { CreateUserTable1675951537962 } from 'src/database/migrations/1675951537962-CreateUserTable';

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
  entities: [UserEntity],
  migrations: [CreateUserTable1675951537962],
  // migrations: ['./dist/database/migrations/*.js'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
