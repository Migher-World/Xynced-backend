import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  // url: process.env.TYPEORM_CONNECTION_STRING,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // entities: ['dist/**/*.entity.js'],
  synchronize: true,
  logging: false,
  dropSchema: false,
};
