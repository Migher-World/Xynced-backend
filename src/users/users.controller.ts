import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sendObjectResponse } from '../shared/response.transformer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../shared/decorators/permission.decorator';
import { PermissionGuard } from '../shared/guards/permissions.guard';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('Users')
@ApiBearerAuth()
// @UseGuards(AuthGuard, PermissionGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions('user.create')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const response = await this.usersService.create(createUserDto);
    return sendObjectResponse(response, 'Account Created');
  }

  @Post('assign-role')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    const response = await this.usersService.assignRole(assignRoleDto);
    return sendObjectResponse(response, 'Role Assigned');
  }

  // @Permissions('user.getAll')
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Permissions('user.findOne')
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Permissions('user.update')
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Permissions('user.remove')
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
