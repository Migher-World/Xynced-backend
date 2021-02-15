import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermissionGroupsService } from './permission-groups.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import {
  sendListReponse,
  sendObjectResponse,
  sendPaginatedListReponse,
} from '../shared/response.transformer';
import { AbstractPaginationDto } from '../shared/dto/abstract-pagination.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission Groups')
@Controller('permission-groups')
export class PermissionGroupsController {
  constructor(
    private readonly permissionGroupsService: PermissionGroupsService,
  ) {}

  @Post()
  async create(@Body() createPermissionGroupDto: CreatePermissionGroupDto) {
    const response = await this.permissionGroupsService.create(
      createPermissionGroupDto,
    );
    return sendObjectResponse(response, 'Permission Group Created');
  }

  @Get()
  async findAll(@Query() pagination: AbstractPaginationDto) {
    const response = await this.permissionGroupsService.findAll(pagination);
    return sendPaginatedListReponse(response, 'Success');
  }

  @Get('/list/get')
  async list() {
    const response = await this.permissionGroupsService.list();
    return sendListReponse(response, 'Success');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.permissionGroupsService.findOne(id);
    return sendObjectResponse(response, 'Success');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {
    const response = await this.permissionGroupsService.update(
      id,
      updatePermissionGroupDto,
    );
    return sendObjectResponse(response, 'Permission Group Updated');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.permissionGroupsService.remove(id);
    return sendObjectResponse(response, 'Permission Group Deleted');
  }
}
