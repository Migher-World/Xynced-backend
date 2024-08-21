import { IsNotEmpty } from "class-validator";
import { DocumentTypeEnum } from "../entities/kyc.entity";

export class CreateKycDto {
    @IsNotEmpty()
    documentType: DocumentTypeEnum;

    @IsNotEmpty()
    documentUrl: string;

    @IsNotEmpty()
    photoUrl: string;
}