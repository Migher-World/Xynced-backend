import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { resolveConfig } from 'prettier';
import { getRepository, Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { AbstractPaginationDto } from '../shared/dto/abstract-pagination.dto';
import { PaginateItems } from '../shared/response.transformer';
import { CreateRoleDto } from './dto/create-role.dto';
import { AddPermissionsToRoleDto, UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepo.create(createRoleDto);
    return this.roleRepo.save(role);
  }

  findAll(pagination: AbstractPaginationDto) {
    return PaginateItems(this.roleRepo, pagination);
  }

  list() {
    return this.roleRepo.find({ select: ['id', 'name'] });
  }

  async findOne(id: string) {
    const response = await this.roleRepo.findOne(id);

    if (!response) {
      throw new NotFoundException('Role Not Found');
    }

    return response;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);
    await this.roleRepo.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.roleRepo.delete(id);
    return null;
  }

  async addPermissionsToRole(addPermissionsToRoleDto: AddPermissionsToRoleDto) {
    const { roleId, permissionsId } = addPermissionsToRoleDto;
    const role = await this.findOne(roleId);

    const permissions = [];
    for (const permissionId of permissionsId) {
      const permission = await getRepository(Permission).findOne(permissionId);
      if (!permission) {
        continue;
      }
      permissions.push(permission);
    }
    role.permissions = permissions;
    return this.roleRepo.save(role);
  }
}
