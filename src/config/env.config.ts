import * as dotenv from 'dotenv';
import * as envVar from 'env-var';

dotenv.config();

const env = {
  jwtSecret: envVar.get('JWT_SECRET').required().asString(),
  expiresIn: envVar.get('JWT_DURATION').asString() ?? '1 year',
  dbUrl: envVar.get('TYPEORM_URL').required().asString(),
  typeormDriverExtra: envVar.get('TYPEORM_DRIVER_EXTRA').asJson(),
  port: envVar.get('PORT').asInt() ?? 3000,
  synchronize: envVar.get('TYPEORM_SYNCHRONIZE').required().asBool(),
  dbLogging: envVar.get('DATABASE_LOGGING').asBool(),
  emailHost: envVar.get('EMAIL_HOST').required().asString(),
  emailUser: envVar.get('EMAIL_USERNAME').required().asString(),
  emailPassword: envVar.get('EMAIL_PASSWORD').required().asString(),
  emailRefreshToken: envVar.get('EMAIL_REFRESH_TOKEN').required().asString(),
  docsPassword: envVar.get('DOCS_PASSWORD').required().asString(),
  redisUrl: envVar.get('REDIS_URL').required().asString(),
  mailgunApiKey: envVar.get('MAILGUN_API_KEY').asString(),
  mailgunDomain: envVar.get('MAILGUN_DOMAIN').asString(),
  appName: envVar.get('APP_NAME').required().asString(),
  environment: envVar.get('NODE_ENV').required().asString(),
  cloudinary: {
    cloudName: envVar.get('CLOUDINARY_CLOUD_NAME').asString(),
    apiKey: envVar.get('CLOUDINARY_API_KEY').asString(),
    apiSecret: envVar.get('CLOUDINARY_API_SECRET').asString(),
  },
  awsAccessKey: envVar.get('AWS_ACCESS_KEY').asString(),
  awsSecretKey: envVar.get('AWS_SECRET_KEY').asString(),
  s3BucketName: envVar.get('S3_BUCKET_NAME').asString(),
  awsRegion: envVar.get('AWS_REGION').asString(),
  googleapis: {
    clientId: envVar.get('GOOGLE_CLIENT_ID').asString(),
    clientSecret: envVar.get('GOOGLE_CLIENT_SECRET').asString()
  },
  prembly: {
    apiKey: envVar.get('PREMBLY_API_KEY').asString(),
    sdkKey: envVar.get('PREMBLY_SDK_KEY').asString(),
    appId: envVar.get('PREMBLY_APP_ID').asString(),
    baseUrl: envVar.get('PREMBLY_BASE_URL').asString(),
  }
};

export default env;
