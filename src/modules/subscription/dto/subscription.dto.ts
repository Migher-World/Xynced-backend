import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from "class-validator";
import { SubscriptionStatusEnum } from "../entities/subscription.entity";

export class CreateSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    plan: string;

    @IsNotEmpty()
    successUrl: string;

    @IsNotEmpty()
    cancelUrl: string;
}