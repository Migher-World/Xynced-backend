import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { resolveResponse } from '../../shared/resolvers';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @CurrentUser() user: User) {
    return resolveResponse(this.profileService.createOrUpdateProfile(user.id, createProfileDto));
  }

  @Get()
  getProfile(@CurrentUser() user: User) {
    return resolveResponse(this.profileService.getProfile(user.id));
  }

  @Get('/metadata')
  getMetadata(@Query('x-lang') lang: string) {
    return resolveResponse(this.profileService.getMetadata(lang));
  }

  @Get('/stage')
  getStage(@CurrentUser() user: User) {
    return resolveResponse(this.profileService.getStage(user.id));
  }

  // @Get()
  // findAll() {
  //   return this.profileService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.profileService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(+id, updateProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(+id);
  // }
}
