import { Body, Controller, Post } from '@nestjs/common';
import { KycService } from './kyc.service';
import { resolveResponse } from '../../shared/resolvers';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('kyc')
@ApiTags('KYC')
@ApiBearerAuth()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  create(@Body() createKycDto: any, @CurrentUser() user: User) {
    return resolveResponse(this.kycService.createOrUpdateKyc(user.id, createKycDto));
  }
}
