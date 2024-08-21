import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BasicService } from '../../shared/services/basic-service.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService extends BasicService<Profile> {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>
  ) {
    super(profileRepository, 'Profile');
  }

  // create or update profile
  async createOrUpdateProfile(
    userId: string,
    createProfileDto: CreateProfileDto
  ) {
    const profile = await this.findOne(userId, 'userId');
    if (profile) {
      return this.update(profile.id, createProfileDto);
    }
    return this.create(createProfileDto);
  }
}
