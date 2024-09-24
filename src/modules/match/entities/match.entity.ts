import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';

@Entity('matches')
export class Match extends AbstractEntity {
  @Column()
  userId: string;

  @Column()
  matchedUserId: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  matchedUser: User;

  @Column({ default: 0 })
  percentage: number;

  @Column({ default: false })
  userAccepted: boolean;

  @Column({ default: false })
  matchAccepted: boolean;

  @Column({ default: false })
  isRejected: boolean;
}
