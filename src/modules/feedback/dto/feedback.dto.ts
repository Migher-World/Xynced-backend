import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class FeedbackDto {
    @IsOptional()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    feedback: string;

    @IsNotEmpty()
    rating: number;

    @IsNotEmpty()
    @IsUUID()
    matchId: string;
}