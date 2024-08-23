import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;
}

export enum PreferredCommunication {
  WHATSAPP = 'WhatsApp',
  SMS = 'SMS',
  EMAIL = 'Email',
}
