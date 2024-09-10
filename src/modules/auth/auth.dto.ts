import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Helper } from '../../shared/helpers';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  password: string;
}

export class VerifyOTPDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  identifier: string;

  @IsNotEmpty()
  code: string;
}

export class GenerateOTPDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  identifier: string;
}

export interface AuthPayload {
  id: string;
}

export class RequestResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: Helper.faker.internet.email() })
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: Helper.faker.internet.email() })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  otp: string;
}
