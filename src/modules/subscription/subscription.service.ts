import { Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { plans, Subscription, SubscriptionStatusEnum } from './entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { StripeService } from '../../shared/plugins/stripe/stripe.service';
import { User } from '../users/entities/user.entity';
import Stripe from 'stripe';
import { AppDataSource } from '../../config/db.config';

@Injectable()
export class SubscriptionService extends BasicService<Subscription> {
  constructor(
    @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,
    private readonly stripeService: StripeService,
  ) {
    super(subscriptionRepository, 'Subscription');
  }

  async getPlans() {
    return plans;
  }

  async createSubscription(subscription: CreateSubscriptionDto, user: User) {
    const customer = await this.stripeService.createCustomer(user.email, user.profile.fullName);
    const products = await this.stripeService.getProducs();
    const product = products.data.find(
      (product) => product.name.toLowerCase() === subscription.plan.toLocaleLowerCase(),
    );
    const price = product.default_price as Stripe.Price;
    const session = await this.stripeService.createCheckoutSession(
      price.id,
      customer.id,
      subscription.successUrl,
      subscription.cancelUrl,
    );
    return session;
    // const newSubscription = this.subscriptionRepository.create({
    //   userId: user.id,
    //   plan: plans.find((plan) => plan.name === subscription.plan),
    //   amount: price.unit_amount,
    //   stripeSubscriptionId: session.id,
    // });
    // return this.subscriptionRepository.save(newSubscription);
  }

  async handleWebhook(payload: Stripe.Event) {
    const event = payload;
    console.log({ event: JSON.stringify(event) });
    switch (event.type) {
      case 'checkout.session.completed':
        return this.handleCheckoutSessionCompletedWebhook(event);
      //   case 'payment_intent.succeeded':
      //     return this.handlePaymentIntentWebhook(event);
      case 'subscription_schedule.updated':
        return this.handleSubscriptionUpdateWebhook(event);
      default:
        return null;
    }
  }

  async handleCheckoutSessionCompletedWebhook(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    // const subscription = await this.subscriptionRepository.findOne({
    // where: { stripeSubscriptionId: session.subscription as string },
    // });
    // subscription.status = SubscriptionStatusEnum.ACTIVE;
    const sub = await this.stripeService.getSubscription(session.subscription as string);
    const subscribedCustomer = sub.customer as Stripe.Customer;
    const user = await AppDataSource.getRepository(User).findOne({ where: { email: subscribedCustomer.email } });
    const subscription = this.subscriptionRepository.create({
      userId: user.id,
      plan: plans.find((plan) => plan.amount === session.amount_total / 100),
      stripeSubscriptionId: session.subscription as string,
      status: SubscriptionStatusEnum.ACTIVE,
      startDate: new Date(sub.current_period_start * 1000),
      endDate: new Date(sub.current_period_end * 1000),
    });
    const result = await this.subscriptionRepository.save(subscription);
    console.log({ result });
    return result;
  }

  //   async handlePaymentIntentWebhook(event: Stripe.Event) {
  //     const paymentIntent = event.data.object as Stripe.PaymentIntent;

  //     const subscription = await this.subscriptionRepository.findOne({
  //         where: { stripeSubscriptionId: paymentIntent. },
  //     });
  //   }

  async handleSubscriptionUpdateWebhook(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;
    // Handle subscription update, update your database accordingly
  }
}