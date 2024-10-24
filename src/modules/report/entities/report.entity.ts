import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Report extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.reportsMade)
  reportingUser: User;

  @ManyToOne(() => User, (user) => user.reportsReceived)
  reportedUser: User;

  @Column()
  reportingUserId: string;

  @Column()
  reportedUserId: string;

  @Column()
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
