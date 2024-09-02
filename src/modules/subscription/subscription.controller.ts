import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { resolveResponse } from '../../shared/resolvers';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('subscription')
@ApiTags('Subscription')
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(@Body() payload: CreateSubscriptionDto, @CurrentUser() user: User) {
    return resolveResponse(this.subscriptionService.createSubscription(
      payload,
      user,
    ));
  }

  @Post('/webhook')
  @Public()
  async handleWebhook(@Body() payload: any) {
    return resolveResponse(this.subscriptionService.handleWebhook(payload));
  }

  @Get('/plans')
  @Public()
  async getPlans() {
    return resolveResponse(this.subscriptionService.getPlans());
  }
}
