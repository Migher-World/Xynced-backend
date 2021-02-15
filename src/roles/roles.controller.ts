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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AddPermissionsToRoleDto, UpdateRoleDto } from './dto/update-role.dto';
import { AbstractPaginationDto } from '../shared/dto/abstract-pagination.dto';
import {
  sendListReponse,
  sendObjectResponse,
  sendPaginatedListReponse,
} from '../shared/response.transformer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const response = await this.rolesService.create(createRoleDto);
    return sendObjectResponse(response, 'Role Created');
  }

  @Put('update-permissions')
  async addPermissionToRole(
    @Body() addPermissionToRoleDto: AddPermissionsToRoleDto,
  ) {
    const response = await this.rolesService.addPermissionsToRole(
      addPermissionToRoleDto,
    );
    return sendObjectResponse(response, 'Role Permissions Updated');
  }

  @Get()
  async findAll(@Query() pagination: AbstractPaginationDto) {
    const response = await this.rolesService.findAll(pagination);
    return sendPaginatedListReponse(response, 'Success');
  }

  @Get('/list/get')
  async list() {
    const response = await this.rolesService.list();
    return sendListReponse(response, 'Success');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.rolesService.findOne(id);
    return sendObjectResponse(response, 'Success');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const response = await this.rolesService.update(id, updateRoleDto);
    return sendObjectResponse(response, 'Role Updated');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.rolesService.remove(id);
    return sendObjectResponse(response, 'Role Deleted');
  }
}
