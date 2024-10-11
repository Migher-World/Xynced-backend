import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  ChildrenEnum,
  CulturalValuesEnum,
  EmploymentStatusEnum,
  FaithBasedMatchEnum,
  FaithEnum,
  GenderEnum,
  InterestEnum,
  LanguagesEnum,
  LifestyleEnum,
  PersonalityTraitEnum,
  RelationshipGoalsEnum,
  RelationshipStatusEnum,
  ResidenceStatusEnum,
} from '../enum/profile.enum';
import { User } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';

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

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true,  })
  preferredGender: GenderEnum;

  @Column({ nullable: true })
  faith: string;

  @Column({ nullable: true })
  relationshipStatus: string;

  @Column({ nullable: true })
  employmentStatus: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  residenceStatus: string;

  @Column({ nullable: true })
  countryCode: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true, type: 'text', array: true })
  pictures: string[];

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, type: 'text', array: true })
  interests: string[];

  @Column({ nullable: true })
  doesFaithMatter: string;

  @Column({ nullable: true, type: 'text', array: true })
  values: string[];

  @Column({ nullable: true, type: 'text', array: true })
  languages: string[];

  @Column({ nullable: true, type: 'text', array: true })
  relationshipGoals: string[];

  @Column({ nullable: true })
  children: string;

  @Column({ nullable: true })
  lifeGoals: string;

  @Column({ nullable: true })
  educationalBackground: string;

  @Column({ nullable: true })
  whatWouldYouLikeYourMatchToKnow: string;

  @Column({ nullable: true, type: 'text', array: true })
  agePreference: string[];

  @Column({ nullable: true, type: 'text', array: true })
  locationPreference: string[];

  @Column({ nullable: true, type: 'text', array: true })
  matchPreferences: string[];

  @Column({ nullable: true, type: 'text', array: true })
  matchCulturalValues: string[];

  @Column({ nullable: true, type: 'text', array: true })
  faithBasePreferences: string[];

  @Column({ nullable: true })
  financialStabilityView: string;

  @Column({ nullable: true, type: 'text', array: true })
  personalityTraitInMatch: string[];

  @Column({ nullable: true })
  familyAndSocialRelationshipPreferences: string;

  @Column({ nullable: true, type: 'text', array: true })
  healthAndLifestyleChoices: string[];

  @Column({ nullable: true })
  pastExperiences: string;

  @Column({ nullable: true })
  dealBreaker: string;

  // qustions part
  @Column({ nullable: true })
  awareXyncedForLTR: boolean;

  @Column({ nullable: true })
  readyForLTR: boolean;

  @Column({ nullable: true })
  doYouHaveChildren: boolean;

  @Column({ nullable: true })
  howManyChildren: number;

  @Column({ nullable: true })
  willYouBeOpenWithYourMatch: boolean;

  @Column({ nullable: true })
  theseWillBeMadeVisible: boolean;

  @Column({ nullable: true })
  age: number;

  @BeforeInsert()
    setAge() {
        if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
        }
    }
}
