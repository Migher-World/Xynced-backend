import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BasicUpdateDto } from '../../shared/dto/basic-update.dto';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends BasicUpdateDto {}
