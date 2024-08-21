import { DataSource, DataSourceOptions } from 'typeorm';
import { Helper } from '../shared/helpers';
import env from './env.config';

const scheme = Helper.getScheme();

export const typeOrmConfig: DataSourceOptions = {
  type: scheme,
  url: env.dbUrl,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: env.synchronize,
  logging: env.dbLogging,
  dropSchema: false,
  extra: env.typeormDriverExtra,
};

export const AppDataSource = new DataSource(typeOrmConfig);
