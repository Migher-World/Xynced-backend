import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { BasicService } from '../../shared/services/basic-service.service';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import {
  ChildrenEnum,
  CulturalValuesEnum,
  EducationalBackgroundEnum,
  EmploymentStatusEnum,
  FaithBasedMatchEnum,
  FaithEnum,
  FinancialViewEnum,
  GenderEnum,
  InterestEnum,
  LanguagesEnum,
  LifestyleEnum,
  PersonalityTraitEnum,
  RelationshipGoalsEnum,
  RelationshipStatusEnum,
  ResidenceStatusEnum,
} from './enum/profile.enum';
import { Helper } from '../../shared/helpers';

@Injectable()
export class ProfileService extends BasicService<Profile> {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private readonly i18n: I18nService,
  ) {
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

  // async getMetadata() {
  //   return {
  //     employmentStatus: Object.values(EmploymentStatusEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     faith: Object.values(FaithEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     gender: Object.values(GenderEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     relationshipStatus: Object.values(RelationshipStatusEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     residenceStatus: Object.values(ResidenceStatusEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     interest: Object.values(InterestEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     faithBasedMatch: Object.values(FaithBasedMatchEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     children: Object.values(ChildrenEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     lifestyleChoices: Object.values(LifestyleEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     relationshipGoals: Object.values(RelationshipGoalsEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     personalityTraitInMatch: Object.values(PersonalityTraitEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     culturalValues: Object.values(CulturalValuesEnum).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //     languages: Object.values(LanguagesEnum ).map((value) => ({ value, label: Helper.toSentenceCase(value) })),
  //   }
  // }

  async getMetadata(lang = 'en') {
    return {
      employmentStatus: await this.getEnumValuesWithTranslations(EmploymentStatusEnum, 'employment_status', lang),
      faith: await this.getEnumValuesWithTranslations(FaithEnum, 'faith', lang),
      gender: await this.getEnumValuesWithTranslations(GenderEnum, 'gender', lang),
      relationshipStatus: await this.getEnumValuesWithTranslations(RelationshipStatusEnum, 'relationship_status', lang),
      residenceStatus: await this.getEnumValuesWithTranslations(ResidenceStatusEnum, 'residence_status', lang),
      interest: await this.getEnumValuesWithTranslations(InterestEnum, 'interest', lang),
      faithBasedMatch: await this.getEnumValuesWithTranslations(FaithBasedMatchEnum, 'faith_based_match', lang),
      children: await this.getEnumValuesWithTranslations(ChildrenEnum, 'children', lang),
      lifestyleChoices: await this.getEnumValuesWithTranslations(LifestyleEnum, 'lifestyle', lang),
      relationshipGoals: await this.getEnumValuesWithTranslations(RelationshipGoalsEnum, 'relationship_goals', lang),
      personalityTraitInMatch: await this.getEnumValuesWithTranslations(
        PersonalityTraitEnum,
        'personality_trait',
        lang,
      ),
      culturalValues: await this.getEnumValuesWithTranslations(CulturalValuesEnum, 'cultural_values', lang),
      languages: await this.getEnumValuesWithTranslations(LanguagesEnum, 'languages', lang),
      education: await this.getEnumValuesWithTranslations(EducationalBackgroundEnum, 'education', lang),
      financialViews: await this.getEnumValuesWithTranslations(FinancialViewEnum, 'financial_view', lang),
      locations: await this.getEnumValuesWithTranslations(FinancialViewEnum, 'location', lang),
    };
  }

  private async getEnumValuesWithTranslations(enumType: any, key: string, lang: string) {
    return Promise.all(
      Object.values(enumType).map(async (value: string) => ({
        value: this.i18n.t(`${lang}.${key}.${value.toLowerCase()}`, { lang }),
        label: this.i18n.t(`${lang}.${key}.${value.toLowerCase()}`, { lang }),
      })),
    );
  }

  async getStage(userId: string) {
    const profile = await this.findOne(userId, 'userId', null, false);

    // const keys = Object.keys(profile).filter((key) => key !== 'id' && key !== 'userId');

    const stages: Record<string, Array<keyof typeof profile>> = {
      stage3a: ['preferredName', 'dateOfBirth', 'gender', 'faith'],
      stage3b: ['doesFaithMatter', 'values', 'languages', 'relationshipStatus'],
      stage4a: ['relationshipGoals', 'children', 'educationalBackground', 'employmentStatus'],
      stage4b: ['profession', 'interests', 'country', 'city'],
      stage4c: ['residenceStatus', 'phoneNumber'],
      stage5a: ['profilePicture'],
      stage5b: ['pictures'],
      stage6a: ['agePreference', 'personalityTraitInMatch', 'financialStabilityView', 'healthAndLifestyleChoices'],
      final: ['locationPreference'],
    };

    const activeStage = Object.keys(stages).find((stage) => {
      return stages[stage].some((key) => !profile[key]);
    });

    return {
      activeStage,
      stages,
    };
  }
}
