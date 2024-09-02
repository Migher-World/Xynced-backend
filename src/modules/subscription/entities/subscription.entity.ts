import { Column, Entity, ManyToOne } from 'typeorm';
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
    name: 'Basic',
    description: 'Basic Plan',
    amount: 0,
    duration: 7,
    status: PlanStatusEnum.ACTIVE,
    features: [PlanFeatureEnum.UNLIMITED_MESSAGES],
  },
  {
    name: 'Standard',
    description: 'Standard Plan',
    amount: 10,
    duration: 30,
    status: PlanStatusEnum.ACTIVE,
    features: [PlanFeatureEnum.UNLIMITED_MESSAGES, PlanFeatureEnum.PERSONALIZED_MATCH, PlanFeatureEnum.AI_MATCHING],
  },
  {
    name: 'Premium',
    description: 'Premium Plan',
    amount: 30,
    duration: 30,
    status: PlanStatusEnum.ACTIVE,
    features: [
      PlanFeatureEnum.UNLIMITED_MESSAGES,
      PlanFeatureEnum.PERSONALIZED_MATCH,
      PlanFeatureEnum.ADVANCED_FILTERS,
      PlanFeatureEnum.AI_MATCHING,
    ],
  },
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

  // @Column({ default: false })
  // autoRenew: boolean;

  // @Column({ default: false })
  // isTrial: boolean;

  @Column({ default: false })
  isCancelled: boolean;

  @Column()
  stripeSubscriptionId: string;

  // @Column()
  // cancelledAt: Date;

  // @Column()
  // cancelledBy: string;

  // @Column()
  // cancelledReason: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
