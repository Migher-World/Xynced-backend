import { BadRequestException, Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { getPlans, plans, Subscription, SubscriptionStatusEnum } from './entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { StripeService } from '../../shared/plugins/stripe/stripe.service';
import { User } from '../users/entities/user.entity';
import Stripe from 'stripe';
import { AppDataSource } from '../../config/db.config';
import { PaypalService } from '../../shared/plugins/paypal/paypal.service';

// TODO: webhook to cancel subscription when expired
@Injectable()
export class SubscriptionService extends BasicService<Subscription> {
  constructor(
    @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,
    private readonly stripeService: StripeService,
    private readonly paypalService: PaypalService,
  ) {
    super(subscriptionRepository, 'Subscription');
  }

  async getPlans(lang) {
    return getPlans(lang);
  }

  async getUserSubscription(user: User) {
    const sub = await this.subscriptionRepository.findOne({
      where: { userId: user.id, status: SubscriptionStatusEnum.ACTIVE },
    });
    if (!sub) {
      throw new BadRequestException('User has no active subscription');
    }
    return sub;
  }

  async createSubscription(subscription: CreateSubscriptionDto, user: User) {
    // check if user has active subscription
    const activeSubscription = await this.subscriptionRepository.findOne({
      where: { userId: user.id, status: SubscriptionStatusEnum.ACTIVE },
    });
    if (activeSubscription) {
      return activeSubscription;
    }

    // const customer = await this.stripeService.createCustomer(user.email, user.profile.fullName);
    // const products = await this.stripeService.getProducts();
    // const product = products.data.find(
    //   (product) => product.name.toLowerCase() === subscription.plan.toLocaleLowerCase(),
    // );
    // const price = product.default_price as Stripe.Price;
    // const session = await this.stripeService.createCheckoutSession(
    //   price.id,
    //   customer.id,
    //   subscription.successUrl,
    //   subscription.cancelUrl,
    // );
    // return session.url;

    // const plans = await this.paypalService.getPlans();
    // console.log({ plans });
    const plan = plans.find((p) => p.id === subscription.plan);
    if (!plan) {
      throw new BadRequestException('Invalid plan');
    }
    if (plan.amount == 0) {
      const subscription = this.subscriptionRepository.create({
        userId: user.id,
        plan: plans.find((plan) => plan.amount === 0),
        status: SubscriptionStatusEnum.ACTIVE,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      });
      return this.subscriptionRepository.save(subscription);
    }
    const subscriptionPlan: any = await this.paypalService.createSubscription(
      plan.id,
      subscription.successUrl,
      subscription.cancelUrl,
    );
    console.log({ subscriptionPlan });
    // const subscriptionData = {
    //   userId: user.id,
    //   plan: plan,
    //   amount: plan.amount,
    //   paypalSubscriptionId: subscriptionPlan.id,
    //   status: SubscriptionStatusEnum.ACTIVE,
    //   startDate: new Date(),
    //   endDate: new Date(new Date().setDate(new Date().getDate() + plan.duration)),
    // };
    return {
      checkoutUrl: subscriptionPlan.links[0].href,
    };
  }

  async verifySubscription(sub_id: string, user: User) {
    const sub = await this.paypalService.getSubscription(sub_id);
    console.log({ sub });

    const subscription = this.subscriptionRepository.create({
      userId: user.id,
      plan: plans.find((p) => p.id === sub.plan_id),
      amount: parseFloat(sub.billing_info.last_payment.amount.value),
      paypalSubscriptionId: sub.id,
      status: SubscriptionStatusEnum.ACTIVE,
      startDate: new Date(sub.start_time),
      endDate: new Date(sub.billing_info.next_billing_time),
    });

    return this.subscriptionRepository.save(subscription);
  }

  async handleWebhook(payload: Stripe.Event) {
    const event = payload;
    console.log({ event: JSON.stringify(event) });
    switch (event.type) {
      case 'checkout.session.completed':
      // return this.handleCheckoutSessionCompletedWebhook(event);
      //   case 'payment_intent.succeeded':
      //     return this.handlePaymentIntentWebhook(event);
      case 'subscription_schedule.updated':
        return this.handleSubscriptionUpdateWebhook(event);
      default:
        return null;
    }
  }

  // async handleCheckoutSessionCompletedWebhook(event: Stripe.Event) {
  //   const session = event.data.object as Stripe.Checkout.Session;
  //   // const subscription = await this.subscriptionRepository.findOne({
  //   // where: { stripeSubscriptionId: session.subscription as string },
  //   // });
  //   // subscription.status = SubscriptionStatusEnum.ACTIVE;
  //   const sub = await this.stripeService.getSubscription(session.subscription as string);
  //   const subscribedCustomer = sub.customer as Stripe.Customer;
  //   const user = await AppDataSource.getRepository(User).findOne({ where: { email: subscribedCustomer.email } });
  //   const subscription = this.subscriptionRepository.create({
  //     userId: user.id,
  //     plan: plans.find((plan) => plan.amount === session.amount_total / 100),
  //     amount: session.amount_total / 100,
  //     stripeSubscriptionId: session.subscription as string,
  //     status: SubscriptionStatusEnum.ACTIVE,
  //     startDate: new Date(sub.current_period_start * 1000),
  //     endDate: new Date(sub.current_period_end * 1000),
  //   });
  //   const result = await this.subscriptionRepository.save(subscription);
  //   console.log({ result });
  //   return result;
  // }

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

  // analytics
  async getSubscriptionsAnalytics() {
    const subscriptions = await this.subscriptionRepository.find();
    const activeSubscriptions = subscriptions.filter((sub) => sub.status === SubscriptionStatusEnum.ACTIVE);
    // total revenue
    const totalRevenue = activeSubscriptions.reduce((acc, sub) => acc + sub.amount, 0);
    //  (calculate the last 6 months revenue and compare the first 3 months to the last 3 months in percentage)
    const lastSixMonthsSubscriptions = activeSubscriptions.filter(
      (sub) => sub.startDate > new Date(new Date().setMonth(new Date().getMonth() - 6)),
    );
    const first3Months = lastSixMonthsSubscriptions.filter(
      (sub) => sub.startDate < new Date(new Date().setMonth(new Date().getMonth() - 3)),
    );
    const last3Months = lastSixMonthsSubscriptions.filter(
      (sub) => sub.startDate > new Date(new Date().setMonth(new Date().getMonth() - 3)),
    );
    const lastQuarterRevenue = last3Months.reduce((acc, sub) => acc + sub.amount, 0);
    const firstQuarterRevenue = first3Months.reduce((acc, sub) => acc + sub.amount, 0);
    const revenueGrowth = ((lastQuarterRevenue - firstQuarterRevenue) / totalRevenue) * 100;

    // revenue by plan
    const revenueByPlan = activeSubscriptions.reduce((acc, sub) => {
      if (acc[sub.plan.name]) {
        acc[sub.plan.name] += sub.amount;
      } else {
        acc[sub.plan.name] = sub.amount;
      }
      return acc;
    }, {});
    const highestPerformer = Object.keys(revenueByPlan).reduce((a, b) => (revenueByPlan[a] > revenueByPlan[b] ? a : b));
    const lowestPerformer = Object.keys(revenueByPlan).reduce((a, b) => (revenueByPlan[a] < revenueByPlan[b] ? a : b));
    const monthlyRecurringRevenue = activeSubscriptions.reduce((acc, sub) => acc + sub.amount, 0);
    const annualRecurringRevenue = monthlyRecurringRevenue * 12;

    // calculate revenue trends, the graph should show the revenue trend for the previous 12 months
    //  it shoud return the month name and the revenue for that month
    const revenueTrends = activeSubscriptions.reduce(
      (acc, sub) => {
        const month = sub.startDate.toLocaleString('default', { month: 'long' });
        if (acc[month]) {
          acc[month] += sub.amount;
        } else {
          acc[month] = sub.amount;
        }
        return acc;
      },
      {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      },
    );

    // calculate churn rate
    // churn rate is the percentage of customers who have canceled their subscription in a given period
    // calculate the churn rate for the last 6 months in percentage
    const lastSixMonthsChurn = subscriptions.filter(
      (sub) => sub.startDate > new Date(new Date().setMonth(new Date().getMonth() - 6)),
    );
    const lastSixMonthsChurnRate = ((subscriptions.length - lastSixMonthsChurn.length) / subscriptions.length) * 100;

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      totalRevenue,
      revenueGrowth,
      revenueByPlan,
      highestPerformer,
      lowestPerformer,
      monthlyRecurringRevenue,
      annualRecurringRevenue,
      revenueTrends,
      churnRate: lastSixMonthsChurnRate,
    };
  }
}
