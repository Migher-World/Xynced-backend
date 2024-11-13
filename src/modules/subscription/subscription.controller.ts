import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { resolveResponse } from '../../shared/resolvers';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { RoleGuard } from '../../shared/guards/roles.guard';
import { UseRoles } from '../../shared/decorators/role.decorator';

@Controller('subscription')
@ApiTags('Subscription')
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getUserSubscription(@CurrentUser() user: User) {
    return resolveResponse(this.subscriptionService.getUserSubscription(user));
  }

  @Post()
  async createSubscription(@Body() payload: CreateSubscriptionDto, @CurrentUser() user: User) {
    return resolveResponse(this.subscriptionService.createSubscription(
      payload,
      user,
    ));
  }

  // @Post('/webhook')
  // @Public()
  // async handleWebhook(@Body() payload: any) {
  //   return resolveResponse(this.subscriptionService.handleWebhook(payload));
  // }

  @Get('/plans')
  @Public()
  async getPlans(@Query('lang') lang: string) {
    return resolveResponse(this.subscriptionService.getPlans(lang));
  }

  @Get('admin/analytics')
  @UseRoles('admin')
  @UseGuards(RoleGuard)
  async getAnalytics() {
    return resolveResponse(this.subscriptionService.getSubscriptionsAnalytics());
  }
}
