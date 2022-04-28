import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Helper } from '../shared/helpers';
import EnvironmentVariables from './env.config';

dotenv.config();

const scheme = Helper.getScheme();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: scheme,
  url: EnvironmentVariables.typeormUrl,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: EnvironmentVariables.synchronize,
  logging: EnvironmentVariables.dbLogging,
  dropSchema: false,
  extra: EnvironmentVariables.typeormDriverExtra,
};
