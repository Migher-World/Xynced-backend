import { Injectable } from "@nestjs/common";
import Stripe from "stripe";


@Injectable()
export class StripeService {
    private stripe: Stripe;
    private readonly stripeSecretKey: string = 'sk_test_51PuWqmLnI1APFNbPzcxoZf45XqNvM4XMvgu6k7JW8qMwSp4mXlZexc2cllnGvskljM9S5GlGtHS8zMaFDPhyg11Y00XlETw6rq';

    constructor() {
        this.stripe = new Stripe(this.stripeSecretKey, {
            apiVersion: "2024-06-20",
        });
    }

    async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
        return this.stripe.customers.create({
            email,
            name,
        });
    }

    async getCustomers(): Promise<Stripe.ApiList<Stripe.Customer>> {
        return this.stripe.customers.list();
    }

    async createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price: priceId,
                },
            ],
        });
    }

    async getProducs(): Promise<Stripe.ApiList<Stripe.Product>> {
        return this.stripe.products.list({
            expand: ['data.default_price'],
        });
    }

    async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['customer'],
        });
    }

    async createCheckoutSession(priceId: string, customerId: string, successUrl: string, cancelUrl: string): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
    }    

}