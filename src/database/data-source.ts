import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions = (() => {
  const configs = {
    ssl: process.env.DB_SSL === 'true' ? true : false,
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true' ? true : false,
    migrationsTableName: 'migrations',
    entities: ['./dist/**/entities/*.js'],
    migrations: [`./dist/database/migrations/${process.env.DB_TYPE}/*.js`]
  };

  if (!process.env.DB_TYPE) {
    throw new Error('NO_DataSourceOptions');
  }
  return configs as DataSourceOptions;
})();

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
