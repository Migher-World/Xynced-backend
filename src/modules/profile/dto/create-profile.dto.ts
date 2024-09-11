import { IsOptional, IsString, IsEnum, IsArray, IsBoolean, IsDate, IsDateString, IsNumber } from 'class-validator';
import { ChildrenEnum, CulturalValuesEnum, EmploymentStatusEnum, FaithBasedMatchEnum, FaithEnum, GenderEnum, InterestEnum, LanguagesEnum, LifestyleEnum, PersonalityTraitEnum, RelationshipGoalsEnum, RelationshipStatusEnum, ResidenceStatusEnum } from "../enum/profile.enum";

export class CreateProfileDto {
    @IsString()
    @IsOptional()
    fullName: string;

    @IsString()
    @IsOptional()
    preferredName: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth: string;

    @IsEnum(GenderEnum)
    @IsOptional()
    gender: GenderEnum;

    @IsEnum(FaithEnum)
    @IsOptional()
    faith: FaithEnum;

    @IsEnum(RelationshipStatusEnum)
    @IsOptional()
    relationshipStatus: RelationshipStatusEnum;

    @IsEnum(EmploymentStatusEnum)
    @IsOptional()
    employmentStatus: EmploymentStatusEnum;

    @IsString()
    @IsOptional()
    profession: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsEnum(ResidenceStatusEnum)
    @IsOptional()
    residenceStatus: ResidenceStatusEnum;

    @IsString()
    @IsOptional()
    countryCode: string;

    @IsString()
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    profilePicture: string;

    @IsArray()
    @IsOptional()
    pictures: string[];

    @IsString()
    @IsOptional()
    bio: string;

    @IsArray()
    @IsOptional()
    @IsEnum(InterestEnum, { each: true })
    interests: InterestEnum[];

    @IsArray()
    @IsOptional()
    values: string[];

    @IsOptional()
    @IsEnum(FaithBasedMatchEnum)
    doesFaithMatter: FaithBasedMatchEnum;

    @IsArray()
    @IsOptional()
    @IsEnum(LanguagesEnum, { each: true })
    languages: LanguagesEnum[];

    @IsArray()
    @IsOptional()
    @IsEnum(RelationshipGoalsEnum, { each: true })
    relationshipGoals: RelationshipGoalsEnum[];

    @IsOptional()
    @IsEnum(ChildrenEnum)
    children: ChildrenEnum;

    @IsString()
    @IsOptional()
    lifeGoals: string;

    @IsString()
    @IsOptional()
    educationalBackground: string;

    @IsString()
    @IsOptional()
    whatWouldYouLikeYourMatchToKnow: string;

    @IsArray()
    @IsOptional()
    agePreference: string[];

    @IsArray()
    @IsOptional()
    locationPreference: string[];

    @IsArray()
    @IsOptional()
    matchPreferences: string[];

    @IsArray()
    @IsOptional()
    @IsEnum(CulturalValuesEnum, { each: true })
    matchCulturalValues: CulturalValuesEnum[];

    @IsArray()
    @IsOptional()
    @IsEnum(FaithEnum, { each: true })
    faithBasePreferences: FaithEnum[];

    @IsString()
    @IsOptional()
    financialStabilityView: string;

    @IsArray()
    @IsOptional()
    @IsEnum(PersonalityTraitEnum, { each: true })
    personalityTraitInMatch: PersonalityTraitEnum[];

    @IsString()
    @IsOptional()
    familyAndSocialRelationshipPreferences: string;

    @IsArray()
    @IsOptional()
    @IsEnum(LifestyleEnum, { each: true })
    healthAndLifestyleChoices: LifestyleEnum[];

    @IsString()
    @IsOptional()
    pastExperiences: string;

    @IsString()
    @IsOptional()
    dealBreaker: string;

    @IsBoolean()
    @IsOptional()
    awareXyncedForLTR: boolean;

    @IsBoolean()
    @IsOptional()
    readyForLTR: boolean;

    @IsBoolean()
    @IsOptional()
    doYouHaveChildren: boolean;

    @IsNumber()
    @IsOptional()
    howManyChildren: number;

    @IsBoolean()
    @IsOptional()
    willYouBeOpenWithYourMatch: boolean;

    @IsBoolean()
    @IsOptional()
    theseWillBeMadeVisible: boolean;
}
