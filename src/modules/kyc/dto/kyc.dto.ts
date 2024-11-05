import { IsNotEmpty, IsOptional } from "class-validator";
import { DocumentTypeEnum, KycStatus } from "../entities/kyc.entity";
import { Transform } from "class-transformer";

export class CreateKycDto {
    @IsNotEmpty()
    documentType: DocumentTypeEnum;

    @IsNotEmpty()
    documentUrl: string;

    @IsOptional()
    @Transform(({ value }) => value === null ? 'CAD' : value)
    country: string

    status?: KycStatus;
}