import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { resolveResponse } from '../../shared/resolvers';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() payload: CreateMessageDto, @CurrentUser() user: User) {
    return resolveResponse(this.messagesService.createMessage(payload, user));
  }

  @Post('mark-as-read/:conversationId')
  async markAsRead(@Param('conversationId') conversationId: string, @CurrentUser() user: User) {
    return resolveResponse(this.messagesService.markAsRead(conversationId, user.id));
  }

  @Get(':conversationId')
  async getMessages(@Param('conversationId') conversationId: string, @CurrentUser() user: User) {
    return resolveResponse(this.messagesService.getConversationMessages(conversationId, user));
  }
}
