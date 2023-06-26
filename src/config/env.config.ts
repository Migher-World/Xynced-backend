import * as dotenv from 'dotenv';
import * as envVar from 'env-var';

dotenv.config();

const env = {
  jwtSecret: envVar.get('JWT_SECRET').required().asString(),
  expiresIn: envVar.get('JWT_DURATION').asString() ?? '1 year',
  typeormUrl: envVar.get('TYPEORM_URL').required().asString(),
  typeormDriverExtra: envVar.get('TYPEORM_DRIVER_EXTRA').asJson(),
  port: envVar.get('PORT').asInt() ?? 3000,
  synchronize: envVar.get('TYPEORM_SYNCHRONIZE').required().asBool(),
  dbLogging: envVar.get('DATABASE_LOGGING').asBool(),
  docsPassword: envVar.get('DOCS_PASSWORD').required().asString(),
  redisUrl: envVar.get('REDIS_URL').required().asString(),
  mailgunApiKey: envVar.get('MAILGUN_API_KEY').required().asString(),
  mailgunDomain: envVar.get('MAILGUN_DOMAIN').required().asString(),
  appName: envVar.get('APP_NAME').required().asString(),
  enviroment: envVar.get('NODE_ENV').required().asString(),
};

export default env;
