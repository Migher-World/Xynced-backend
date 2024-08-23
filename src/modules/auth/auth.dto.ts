import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

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
