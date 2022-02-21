import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export default class EnvironmentVariables {
  static jwtSecret = env.get('JWT_SECRET').asString();
  static expiresIn = env.get('JWT_DURATION').asString() ?? '1 year';
  static typeormUrl = env.get('TYPEORM_URL').asString();
  static port = env.get('PORT').asInt() ?? 3000;
  static synchronize = env.get('TYPEORM_SYNCHRONIZE').asBool();
  static dbLogging = env.get('DATABASE_LOGGING').asBool();
  static docsPassword = env.get('DOCS_PASSWORD').asString();
  static redisUrl = env.get('REDIS_URL').asString();
  static mailgunApiKey = env.get('MAILGUN_API_KEY').asString();
  static mailgunDomain = env.get('MAILGUN_DOMAIN').asString();
}
