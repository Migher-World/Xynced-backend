import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';
import { User } from '../../users/entities/user.entity';
import { Match } from '../../match/entities/match.entity';

@Entity('conversations')
export class Conversation extends AbstractEntity {
  @ManyToOne(() => Match)
  @JoinColumn()
  match: Match;

  @Column()
  matchId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  toDto(authUser: User, match?: Match) {
    const payload = {
      id: this.id,
      receiverId: this.match.matchedUserId,
      receiver: this.match.matchedUser,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      match: match ?? this.match,
      lastMessage: {},
      unread: 0,
    };

    if (payload.receiverId === authUser.id) {
      payload.receiver = this.user;
      payload.receiverId = this.userId;
    }

    return payload;
  }
}
