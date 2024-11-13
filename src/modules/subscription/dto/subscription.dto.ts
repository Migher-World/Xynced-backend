import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUrl } from "class-validator";
import { SubscriptionStatusEnum } from "../entities/subscription.entity";

export class CreateSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    plan: string;

    @IsNotEmpty()
    @IsUrl()
    successUrl: string;

    @IsNotEmpty()
    @IsUrl()
    cancelUrl: string;
}