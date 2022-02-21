import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import EnvironmentVariables from './config/env.config';
import * as basicAuth from 'express-basic-auth';
import RedisStore from './shared/plugins/redis/redis';
import * as admin from 'firebase-admin';
import * as firebaseConfig from './integrations/firebase/firebase.config.json';

const appName = 'Example';
const port = EnvironmentVariables.port;

async function bootstrap() {
  // admin.initializeApp({
  //   credential: admin.credential.cert(firebaseConfig as any),
  // });

  // try {
  //   await RedisStore.connect();
  // } catch (error) {
  //   console.log('redis-error is ', error);
  // }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(
    '/swagger',
    basicAuth({
      challenge: true,
      users: {
        ['admin']: EnvironmentVariables.docsPassword,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle(`${appName} API`)
    .setDescription(`The ${appName} API description`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
      customSiteTitle: `${appName} API Docs`,
    },
  });

  await app.listen(port, () => {
    console.log(`${appName} running on port ${port} 🚀`);
  });
}
bootstrap();
