import { Column, JoinColumn, OneToOne } from "typeorm";
import { EmploymentStatusEnum, FaithEnum, GenderEnum, RelationshipStatusEnum, ResidenceStatusEnum } from "../enum/profile.enum";
import { User } from "../../users/entities/user.entity";
import { AbstractEntity } from "../../../shared/entities/abstract-entity";

export class Profile extends AbstractEntity {
    @Column()
    userId: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    preferredName: string;

    @Column({ nullable: true })
    dateOfBirth: Date;

    @Column({ nullable: true, enum: GenderEnum })
    gender: GenderEnum;

    @Column({ nullable: true, enum: FaithEnum })
    faith: FaithEnum;

    @Column({ nullable: true, enum: RelationshipStatusEnum })
    relationshipStatus: RelationshipStatusEnum;

    @Column({ nullable: true, enum: EmploymentStatusEnum })
    employmentStatus: EmploymentStatusEnum;

    @Column({ nullable: true })
    profession: string;
    
    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true, enum: ResidenceStatusEnum })
    residenceStatus: ResidenceStatusEnum;

    @Column({ nullable: true })
    countryCode: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    profilePicture: string;

    @Column({ nullable: true })
    pictures: string[];

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    interests: string[];

    @Column({ nullable: true })
    doesFaithMatter: boolean;

    @Column({ nullable: true })
    languages: string[];

    @Column({ nullable: true })
    relationshipGoals: string[];

    @Column({ nullable: true })
    lifeGoals: string;

    @Column({ nullable: true })
    educationalBackground: string;

    @Column({ nullable: true })
    whatWouldYouLikeYourMatchToKnow: string;

    @Column({ nullable: true })
    agePreference: string;

    @Column({ nullable: true })
    locationPreference: string;

    @Column({ nullable: true })
    matchPreferences: string[];

    @Column({ nullable: true })
    matchCulturalValues: string[];

    @Column({ nullable: true })
    faithBasePreferences: string[];

    @Column({ nullable: true })
    financialStabilityView: string;

    @Column({ nullable: true })
    personalityTraitInMatch: string;

    @Column({ nullable: true })
    familyAndSocialRelationshipPreferences: string;

    @Column({ nullable: true })
    healthAndLifestyleChoices: string;

    @Column({ nullable: true })
    pastExperiences: string;

    @Column({ nullable: true })
    dealBreaker: string;
}
