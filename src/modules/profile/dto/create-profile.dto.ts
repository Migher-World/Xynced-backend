import { IsOptional, IsString, IsEnum, IsArray, IsBoolean, IsDate, IsDateString, IsNumber } from 'class-validator';
import { ChildrenEnum, EmploymentStatusEnum, FaithBasedMatchEnum, FaithEnum, GenderEnum, InterestEnum, RelationshipStatusEnum, ResidenceStatusEnum } from "../enum/profile.enum";

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
    languages: string[];

    @IsArray()
    @IsOptional()
    relationshipGoals: string[];

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
    matchCulturalValues: string[];

    @IsArray()
    @IsOptional()
    faithBasePreferences: string[];

    @IsString()
    @IsOptional()
    financialStabilityView: string;

    @IsArray()
    @IsOptional()
    personalityTraitInMatch: string[];

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
