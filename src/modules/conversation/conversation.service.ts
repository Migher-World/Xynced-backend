import { BadRequestException, Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { BasicService } from '../../shared/services/basic-service.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchService } from '../match/match.service';
import { User } from '../users/entities/user.entity';
import { AppEvents } from '../../constants';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ConversationService extends BasicService<Conversation> {
  constructor(
    @InjectRepository(Conversation) private readonly conversationsRepo: Repository<Conversation>,
    private readonly matchService: MatchService,
  ) {
    super(conversationsRepo, 'Conversation');
  }

  @OnEvent(AppEvents.MATCH_ACCEPTED)
  async matchAcceptedTrigger(payload: { matchId: string; user: User }) {
    const { matchId, user } = payload;
    await this.createConversation(matchId, user);
  }

  async createConversation(matchId: string, user: User) {
    const match = await this.matchService.findOne(matchId);
    if (!match || match.isAccepted === false || ![match.userId, match.matchedUserId].includes(user.id)) {
      throw new BadRequestException('You are not allowed to create conversation for this match');
    }
    const conversation = await this.conversationsRepo.findOne({
      where: {
        matchId: match.id,
        userId: match.matchedUserId,
      },
      relations: {
        match: {
          matchedUser: true,
        },
        user: true,
      },
    });
    if (conversation) {
      return conversation.toDto(user);
    }
    const data = await this.conversationsRepo.save({
      matchId: match.id,
      userId: match.userId,
    });
    return this.findConversation(data.id, user);
  }

  async findConversation(id: string, user: User) {
    const query = this.conversationsRepo
      .createQueryBuilder('conversation')
      .where('conversation.id = :id', { id })
      .leftJoinAndSelect('conversation.match', 'match')
      .leftJoinAndSelect('conversation.user', 'user')
      .leftJoinAndSelect('match.matchedUser', 'matchedUser')
      .andWhere('match.isAccepted = true')
      .andWhere('(conversation.userId = :userId OR match.matchedUserId = :userId)', { userId: user.id });

    const conversation = await query.getOne();

    return conversation.toDto(user);
  }

  async findConversations(user: User) {
    const query = this.conversationsRepo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.match', 'match')
      .leftJoinAndSelect('conversation.user', 'user')
      .leftJoinAndSelect('match.matchedUser', 'matchedUser')
      .andWhere('(conversation.userId = :userId OR match.matchedUserId = :userId)', { userId: user.id })
      .orderBy('conversation.updatedAt', 'DESC');

    const conversations = await query.getMany();

    const result = conversations.map((conversation) => {
      const processed = conversation.toDto(user);
      //
    });
  }
}
