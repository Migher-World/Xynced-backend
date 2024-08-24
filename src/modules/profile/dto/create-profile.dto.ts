import { IsOptional, IsString, IsEnum, IsArray, IsBoolean, IsDate, IsDateString } from 'class-validator';
import { EmploymentStatusEnum, FaithEnum, GenderEnum, RelationshipStatusEnum, ResidenceStatusEnum } from "../enum/profile.enum";

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
    interests: string[];

    @IsString()
    @IsOptional()
    values: string;

    @IsBoolean()
    @IsOptional()
    doesFaithMatter: boolean;

    @IsArray()
    @IsOptional()
    languages: string[];

    @IsArray()
    @IsOptional()
    relationshipGoals: string[];

    @IsString()
    @IsOptional()
    lifeGoals: string;

    @IsString()
    @IsOptional()
    educationalBackground: string;

    @IsString()
    @IsOptional()
    whatWouldYouLikeYourMatchToKnow: string;

    @IsString()
    @IsOptional()
    agePreference: string;

    @IsString()
    @IsOptional()
    locationPreference: string;

    @IsArray()
    @IsOptional()
    matchPreferences: string[];

    @IsArray()
    @IsOptional()
    matchCulturalValues: string[];

    @IsArray()
    @IsOptional()
    faithBasePreferences: string[];

    @IsString()
    @IsOptional()
    financialStabilityView: string;

    @IsString()
    @IsOptional()
    personalityTraitInMatch: string;

    @IsString()
    @IsOptional()
    familyAndSocialRelationshipPreferences: string;

    @IsString()
    @IsOptional()
    healthAndLifestyleChoices: string;

    @IsString()
    @IsOptional()
    pastExperiences: string;

    @IsString()
    @IsOptional()
    dealBreaker: string;
}
