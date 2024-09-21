import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';
import { User } from '../../users/entities/user.entity';
import { Conversation } from '../../conversation/entities/conversation.entity';

@Entity('messages')
export class Message extends AbstractEntity {
  @ManyToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;

  @Column({ nullable: false })
  conversationId: string;

  @Column('text')
  body: string;

  @Column('jsonb')
  metadata: Record<string, unknown>;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: true })
  receiverId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  receiver: User;

  @Column({ default: false })
  read: boolean;
}
