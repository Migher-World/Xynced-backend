import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BasicService } from '../../shared/services/basic-service.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { EmploymentStatusEnum, FaithEnum, GenderEnum, RelationshipStatusEnum, ResidenceStatusEnum } from "./enum/profile.enum";
import { Helper } from '../../shared/helpers';

@Injectable()
export class ProfileService extends BasicService<Profile> {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {
    super(profileRepository, 'Profile');
  }

  // create or update profile
  async createOrUpdateProfile(userId: string, createProfileDto: CreateProfileDto) {
    const profile = await this.findOne(userId, 'userId', null, false);
    if (profile) {
      return this.update(profile.id, createProfileDto);
    }
    return this.create({ ...createProfileDto, userId });
  }

  async getProfile(userId: string) {
    return this.findOne(userId, 'userId');
  }

  async getMetadata() {
    return {
      employmentStatus: Object.values(EmploymentStatusEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      faith: Object.values(FaithEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      gender: Object.values(GenderEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      relationshipStatus: Object.values(RelationshipStatusEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      residenceStatus: Object.values(ResidenceStatusEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
    }
  }
}
