import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignRoleDto } from './dto/assign-role.dto';
import { resolveResponse } from '../../shared/resolvers';
import { AbstractPaginationDto } from '../../shared/dto/abstract-pagination.dto';

@ApiTags('Users')
@ApiBearerAuth()
// @UseGuards(AuthGuard, PermissionGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Permissions('user.create')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return resolveResponse(
      this.usersService.create(createUserDto),
      'Account Created',
    );
  }

  @Get()
  findAll(@Query() pagination: AbstractPaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Query('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @Post('assign-role')
  // async assignRole(@Body() assignRoleDto: AssignRoleDto) {
  //   return resolveResponse(
  //     this.usersService.assignRole(assignRoleDto),
  //     'Role Assigned',
  //   );
  // }
}
