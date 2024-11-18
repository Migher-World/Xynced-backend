import { IsOptional, IsString, IsEnum, IsArray, IsBoolean, IsDate, IsDateString, IsNumber } from 'class-validator';

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

    @IsOptional()
    gender: string;

    // @IsOptional()
    // preferredGender: string;

    @IsOptional()
    faith: string;

    @IsOptional()
    relationshipStatus: string;

    @IsOptional()
    employmentStatus: string;

    @IsString()
    @IsOptional()
    profession: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsOptional()
    residenceStatus: string;

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

    @IsArray()
    @IsOptional()
    values: string[];

    @IsOptional()
    doesFaithMatter: string;

    @IsArray()
    @IsOptional()
    languages: string[];

    @IsArray()
    @IsOptional()
    relationshipGoals: string[];

    @IsArray()
    @IsOptional()
    children: string[];

    // @IsString()
    // @IsOptional()
    // lifeGoals: string;

    @IsString()
    @IsOptional()
    educationalBackground: string;

    // @IsString()
    // @IsOptional()
    // whatWouldYouLikeYourMatchToKnow: string;

    @IsArray()
    @IsOptional()
    agePreference: string[];

    // @IsArray()
    // @IsOptional()
    // locationPreference: string[];

    @IsArray()
    @IsOptional()
    matchPreferences: string[];

    // @IsArray()
    // @IsOptional()
    // matchCulturalValues: string[];

    // @IsArray()
    // @IsOptional()
    // faithBasePreferences: string[];

    @IsString()
    @IsOptional()
    financialStabilityView: string;

    @IsArray()
    @IsOptional()
    personalityTraitInMatch: string[];

    // @IsString()
    // @IsOptional()
    // familyAndSocialRelationshipPreferences: string;

    @IsArray()
    @IsOptional()
    healthAndLifestyleChoices: string[];

    // @IsString()
    // @IsOptional()
    // pastExperiences: string;

    // @IsString()
    // @IsOptional()
    // dealBreaker: string;

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
