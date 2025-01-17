import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';
import { User } from '../../users/entities/user.entity';
import { features } from 'process';

export enum SubscriptionStatusEnum {
  ACTIVE = 'active',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum PlanStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PlanFeatureEnum {
  PERSONALIZED_MATCH = 'personalized_match',
  UNLIMITED_MESSAGES = 'unlimited_messages',
  AI_MATCHING = 'ai_matching',
  ADVANCED_FILTERS = 'advanced_filters',
}

export const plans = [
  {
    id: 'free-plan',
    name: 'Xynced Starter',
    description: 'This plan allows you to take the initial steps towards finding your soulmate.',
    amount: 0,
    duration: 30,
    status: PlanStatusEnum.ACTIVE,
    features: [PlanFeatureEnum.UNLIMITED_MESSAGES],
  },
  {
    id: 'P-5DP551195H644460BM5DPRRA',
    name: 'Xynced Guided',
    description: 'This plan provides a personalized matchmaking experience.',
    amount: 150,
    duration: 90,
    status: PlanStatusEnum.ACTIVE,
    features: [PlanFeatureEnum.UNLIMITED_MESSAGES, PlanFeatureEnum.PERSONALIZED_MATCH, PlanFeatureEnum.AI_MATCHING],
  },
  {
    id: 'P-inactive-plan',
    name: 'Xynced Elite',
    description: 'This plan offers a premium matchmaking service and relationship mentorship.',
    amount: 350,
    duration: 90,
    status: PlanStatusEnum.INACTIVE,
    features: [
      PlanFeatureEnum.UNLIMITED_MESSAGES,
      PlanFeatureEnum.PERSONALIZED_MATCH,
      PlanFeatureEnum.ADVANCED_FILTERS,
      PlanFeatureEnum.AI_MATCHING,
    ],
  },
];

const frenchPlans = [
    {
      "id": 'free-plan',
      "name": "Xynced Starter",
      "description": "Ce plan vous permet de faire vos premiers pas vers la recherche de votre âme sœur.",
      "amount": 0,
      "duration": 30,
      "status": PlanStatusEnum.ACTIVE,
      "features": ["messages_illimités"]
    },
    {
      "id": 'P-5DP551195H644460BM5DPRRA',
      "name": "Xynced Guided",
      "description": "Ce plan offre une expérience de matchmaking personnalisée.",
      "amount": 150,
      "duration": 90,
      "status": PlanStatusEnum.ACTIVE,
      "features": ["messages_illimités", "correspondance_personnalisée", "correspondance_ai"]
    },
    {
      "id": 'P-inactive-plan',
      "name": "Xynced Elite",
      "description": "Ce plan propose un service de matchmaking premium et un mentorat en relations.",
      "amount": 350,
      "duration": 90,
      "status": PlanStatusEnum.INACTIVE,
      "features": ["messages_illimités", "correspondance_personnalisée", "filtres_avancés", "correspondance_ai"]
    }
  ];

@Entity('subscription')
export class Subscription extends AbstractEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'jsonb' })
  plan: {
    name: string;
    description: string;
    amount: number;
    duration: number;
    status: PlanStatusEnum;
    features: PlanFeatureEnum[];
  };

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ enum: SubscriptionStatusEnum, default: SubscriptionStatusEnum.PENDING })
  status: SubscriptionStatusEnum;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: false })
  isCancelled: boolean;

  @Column({ nullable: true })
  paypalSubscriptionId: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  getPlan(lang = 'en') {
    return lang === 'en' ? plans.find((p) => p.name === this.plan.name) : frenchPlans.find((p) => p.name === this.plan.name);
  }
}

export const getPlans = (lang = 'en') => {
    return lang === 'en' ? plans : frenchPlans;
}