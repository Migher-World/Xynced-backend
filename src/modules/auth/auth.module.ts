import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

import * as dotenv from 'dotenv';
import EnvironmentVariables from '../../config/env.config';
import { UsersModule } from '../users/users.module';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: EnvironmentVariables.jwtSecret,
      signOptions: {
        expiresIn: EnvironmentVariables.expiresIn,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy, JwtModule],
})
export class AuthModule {}
