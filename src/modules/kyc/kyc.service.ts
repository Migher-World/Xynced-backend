import { Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { Kyc } from './entities/kyc.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KycService extends BasicService<Kyc> {
    constructor(
        @InjectRepository(Kyc)
        private kycRepository: Repository<Kyc>,
    ) {
        super(kycRepository, 'Kyc');
    }

    async createOrUpdateKyc(userId: string, createKycDto: any) {
        const kyc = await this.findOne(userId, 'userId', null, false);
        if (kyc) {
            return this.update(kyc.id, createKycDto);
        }
        return this.create({ ...createKycDto, userId });
    }
}
