import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { sendObjectResponse } from '../shared/response.transformer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../shared/decorators/permission.decorator';
import { AssignRoleDto } from './dto/assign-role.dto';
import { resolveResponse } from '../shared/resolvers';

@ApiTags('Users')
@ApiBearerAuth()
// @UseGuards(AuthGuard, PermissionGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions('user.create')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    resolveResponse(this.usersService.create(createUserDto), 'Account Created');
  }

  @Post('assign-role')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    resolveResponse(
      this.usersService.assignRole(assignRoleDto),
      'Role Assigned',
    );
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
