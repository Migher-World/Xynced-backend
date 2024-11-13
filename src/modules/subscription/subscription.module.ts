import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { StripeService } from '../../shared/plugins/stripe/stripe.service';
import { PaypalService } from '../../shared/plugins/paypal/paypal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, StripeService, PaypalService],
})
export class SubscriptionModule {}
