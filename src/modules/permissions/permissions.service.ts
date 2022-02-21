import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/services/abstract-service.service';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService extends AbstractService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {
    super(permissionRepo, 'Permissions');
  }
}
