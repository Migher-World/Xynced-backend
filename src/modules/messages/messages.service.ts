import { BadRequestException, Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { BasicService } from '../../shared/services/basic-service.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationService } from '../conversation/conversation.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
import { AppEvents } from '../../constants';

@Injectable()
export class MessagesService extends BasicService<Message> {
  constructor(
    @InjectRepository(Message) private readonly messagesRepo: Repository<Message>,
    private readonly conversationsService: ConversationService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(messagesRepo, 'Message');
  }

  async createMessage(payload: CreateMessageDto, user: User) {
    const { conversationId } = payload;
    const conversation = await this.conversationsService.findOne(conversationId, 'id', ['match']);
    if (![conversation.userId, conversation.match.matchedUserId].includes(user.id)) {
      throw new BadRequestException('You are not allowed to send message to this conversation');
    }
    const receiver = await this.getReceiver(conversationId, user.id);

    console.log('receiver', receiver);

    const message = await super.create({ ...payload, userId: user.id, receiverId: receiver.id });

    const response = { ...message, receiver };

    this.eventEmitter.emit(AppEvents.MESSAGE_CREATED, response);
    this.conversationsService.update(conversationId, { updatedAt: new Date() });
    return response;
  }

  private async getReceiver(conversationId: string, userId: string) {
    const conversation = await this.conversationsService.findOne(conversationId, 'id', ['match', 'match.matchedUser']);
    if (conversation.userId === userId) {
      return conversation.match.matchedUser;
    }
    return conversation.user;
  }

  async getConversationMessages(conversationId: string, user: User) {
    const conversation = await this.conversationsService.findOne(conversationId, 'id', ['match']);
    if (![conversation.userId, conversation.match.matchedUserId].includes(user.id)) {
      throw new BadRequestException('You are not allowed to view this conversation');
    }
    const messages = await this.messagesRepo.find({ where: { conversationId }, order: { createdAt: 'DESC' } });

    return messages;
  }

  async markAsRead(conversationId: string, receiverId: string) {
    const conversation = await this.conversationsService.findOne(conversationId, 'id', ['match']);
    if (![conversation.userId, conversation.match.matchedUserId].includes(receiverId)) {
      throw new BadRequestException('You are not allowed to mark this conversation as read');
    }
    await this.messagesRepo.update({ conversationId, receiverId }, { read: true });
    return true;
  }
}
