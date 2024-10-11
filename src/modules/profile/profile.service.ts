import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BasicService } from '../../shared/services/basic-service.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ChildrenEnum, CulturalValuesEnum, EmploymentStatusEnum, FaithBasedMatchEnum, FaithEnum, GenderEnum, InterestEnum, LanguagesEnum, LifestyleEnum, PersonalityTraitEnum, RelationshipGoalsEnum, RelationshipStatusEnum, ResidenceStatusEnum } from "./enum/profile.enum";
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
      interest: Object.values(InterestEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      faithBasedMatch: Object.values(FaithBasedMatchEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      children: Object.values(ChildrenEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      lifestyleChoices: Object.values(LifestyleEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      relationshipGoals: Object.values(RelationshipGoalsEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      personalityTraitInMatch: Object.values(PersonalityTraitEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      culturalValues: Object.values(CulturalValuesEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
      languages: Object.values(LanguagesEnum ).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
    }
  }

  async getStage(userId: string) {
    const profile = await this.findOne(userId, 'userId', null, false);

    // const keys = Object.keys(profile).filter((key) => key !== 'id' && key !== 'userId');

    const stages: Record<string, Array<keyof typeof profile>> = {
      stage3a: ['dateOfBirth', 'gender', 'faith', 'relationshipStatus', 'employmentStatus'],
      stage3b: ['profession', 'country', 'city', 'residenceStatus', 'countryCode', 'phoneNumber'],
      stage4a: ['profilePicture'],
      stage4b: ['pictures'],
      stage4c: ['bio', 'interests'],
      stage5a: ['values', 'doesFaithMatter', 'languages', 'relationshipGoals'],
      stage5b: ['children', 'lifeGoals', 'educationalBackground', 'whatWouldYouLikeYourMatchToKnow'],
      stage6a: ['agePreference', 'locationPreference', 'matchPreferences', 'preferredGender'],
      stage6b: ['matchCulturalValues', 'faithBasePreferences', 'financialStabilityView', 'personalityTraitInMatch'],
      stage6c: ['familyAndSocialRelationshipPreferences', 'healthAndLifestyleChoices', 'pastExperiences', 'dealBreaker'],
      final: ['awareXyncedForLTR', 'readyForLTR', 'doYouHaveChildren', 'howManyChildren', 'willYouBeOpenWithYourMatch', 'theseWillBeMadeVisible'],
    }

    const activeStage = Object.keys(stages).find((stage) => {
      return stages[stage].some((key) => !profile[key]);
    });

    return {
      activeStage,
      stages,
    } 
  }
}
