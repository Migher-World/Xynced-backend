import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { ValidationPipe } from '@nestjs/common';
import EnvironmentVariables from './config/env.config';
import * as basicAuth from 'express-basic-auth';

const appName = 'Example';
const port = EnvironmentVariables.port;

async function bootstrap() {
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
    },
  });

  await app.listen(port, () => {
    console.log(`${appName} running on port ${port} 🚀`);
  });
}
bootstrap();
