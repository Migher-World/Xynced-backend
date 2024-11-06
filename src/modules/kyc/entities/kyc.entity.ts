import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../shared/entities/abstract-entity";

export enum KycStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
  }
  
  export enum DocumentTypeEnum {
    PASSPORT = 'PP',
    GOVERNMENT_ID = 'ID',
    DRIVERS_LICENSE = 'DL',
    RESIDENCE_PERMIT = 'RP',
    UTILITY_BILL = 'UB',
  }


@Entity('kyc')
export class Kyc extends AbstractEntity {
    @Column({ enum: KycStatus, default: KycStatus.PENDING })
    status: KycStatus;
  
    @Column({ enum: DocumentTypeEnum })
    documentType: DocumentTypeEnum;

    @Column()
    documentUrl: string;

    @Column()
    userId: string;

    @Column({ nullable: true })
    approvedBy: string;

    @Column({ nullable: true })
    country: string;
}