import { Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { Kyc } from './entities/kyc.entity';

@Injectable()
export class KycService extends BasicService<Kyc> {
    
}
