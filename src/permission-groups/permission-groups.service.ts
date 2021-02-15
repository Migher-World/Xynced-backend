import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractPaginationDto } from '../shared/dto/abstract-pagination.dto';
import { PaginateItems } from '../shared/response.transformer';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { PermissionGroup } from './entities/permission-group.entity';

@Injectable()
export class PermissionGroupsService {
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepo: Repository<PermissionGroup>,
  ) {}

  create(createPermissionGroupDto: CreatePermissionGroupDto) {
    const permissionGroup = this.permissionGroupRepo.create(createPermissionGroupDto);
    return this.permissionGroupRepo.save(permissionGroup);
  }

  findAll(pagination: AbstractPaginationDto) {
    return PaginateItems(this.permissionGroupRepo, pagination);
  }

  list() {
    return this.permissionGroupRepo.find({ select: ['id', 'name'] });
  }

  async findOne(id: string) {
    const response = await this.permissionGroupRepo.findOne(id);

    if (!response) {
      throw new NotFoundException('Permission Group Not Found');
    }

    return response;
  }

  async update(id: string, updatePermissionGroupDto: UpdatePermissionGroupDto) {
    await this.findOne(id);
    await this.permissionGroupRepo.update(id, updatePermissionGroupDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.permissionGroupRepo.delete(id);
    return null;
  }
}
