import { IsNotEmpty } from "class-validator";

export class ReportDto {
    @IsNotEmpty() reportingUserId: string;

    @IsNotEmpty() reportedUserId: string;

    @IsNotEmpty() reason: string;
}