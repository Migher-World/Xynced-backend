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
  @IsOptional()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}

export interface AuthPayload {
  id: string;
}
