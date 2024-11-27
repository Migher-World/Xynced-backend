import { Injectable } from "@nestjs/common";
import { RequestController } from "../../core";
import { User } from "../../../modules/users/entities/user.entity";

@Injectable()
export class PaypalService {
    auth: string;
    constructor(private requestController: RequestController) {
        this.auth = `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`;
      }

    async createSubscription(planId: string, successUrl: string, cancelUrl: string) {
        const response = await this.requestController.post('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {}, {
            plan_id: planId,
            application_context: {
                user_action: 'SUBSCRIBE_NOW',
                return_url: successUrl,
                cancel_url: cancelUrl,
            },
        }, {
            headers: {
                Authorization: this.auth,
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    async getSubscription(subscriptionId: string) {
        const response = await this.requestController.get<any>(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {}, {
            headers: {
                Authorization: this.auth,
                'Content-Type': 'application/json',
            },
        });
        return response;
    }
}