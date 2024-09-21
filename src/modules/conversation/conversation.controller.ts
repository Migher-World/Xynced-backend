import { Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { resolveResponse } from '../../shared/resolvers';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('conversations')
@ApiTags('Conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post(':matchId')
  async createConversation(@Param('matchId') rentalId: string, @CurrentUser() user: User) {
    return resolveResponse(this.conversationService.createConversation(rentalId, user));
  }

  @Get()
  async findConversations(@CurrentUser() user: User) {
    return resolveResponse(this.conversationService.findConversations(user));
  }
}
