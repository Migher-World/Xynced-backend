import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../shared/entities/abstract-entity";

export enum KycStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
  }
  
  export enum DocumentTypeEnum {
    PASSPORT = 'passport',
    NIN = 'nin',
    DRIVERS_LICENSE = 'drivers_license',
    VOTERS_CARD = 'voters_card',
    BVN = 'bvn',
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

    @Column()
    photoUrl: string;
}