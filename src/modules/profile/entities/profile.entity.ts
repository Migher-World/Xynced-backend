import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { EmploymentStatusEnum, FaithEnum, GenderEnum, InterestEnum, RelationshipStatusEnum, ResidenceStatusEnum } from "../enum/profile.enum";
import { User } from "../../users/entities/user.entity";
import { AbstractEntity } from "../../../shared/entities/abstract-entity";

@Entity('profile')
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
    dateOfBirth: string;

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

    @Column({ nullable: true, type: 'simple-array' })
    pictures: string[];

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true, type: 'simple-array', enum: InterestEnum })
    interests: InterestEnum[];

    @Column({ nullable: true })
    doesFaithMatter: boolean;

    @Column({ nullable: true })
    values: string;

    @Column({ nullable: true, type: 'simple-array' })
    languages: string[];

    @Column({ nullable: true, type: 'simple-array' })
    relationshipGoals: string[];

    @Column({ nullable: true })
    lifeGoals: string;

    @Column({ nullable: true })
    educationalBackground: string;

    @Column({ nullable: true })
    whatWouldYouLikeYourMatchToKnow: string;

    @Column({ nullable: true })
    agePreference: string;

    @Column({ nullable: true, type: 'simple-array' })
    locationPreference: string[];

    @Column({ nullable: true, type: 'simple-array' })
    matchPreferences: string[];

    @Column({ nullable: true, type: 'simple-array' })
    matchCulturalValues: string[];

    @Column({ nullable: true, type: 'simple-array' })
    faithBasePreferences: string[];

    @Column({ nullable: true })
    financialStabilityView: string;

    @Column({ nullable: true, type: 'simple-array' })
    personalityTraitInMatch: string[];

    @Column({ nullable: true })
    familyAndSocialRelationshipPreferences: string;

    @Column({ nullable: true })
    healthAndLifestyleChoices: string;

    @Column({ nullable: true })
    pastExperiences: string;

    @Column({ nullable: true })
    dealBreaker: string;
}
