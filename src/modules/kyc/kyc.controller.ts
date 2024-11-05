import { Body, Controller, Get, Post } from '@nestjs/common';
import { KycService } from './kyc.service';
import { resolveResponse } from '../../shared/resolvers';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateKycDto } from './dto/kyc.dto';

@Controller('kyc')
@ApiTags('KYC')
@ApiBearerAuth()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  // @Post()
  // create(@Body() createKycDto: CreateKycDto, @CurrentUser() user: User) {
  //   return resolveResponse(this.kycService.createOrUpdateKyc(user.id, createKycDto));
  // }

  @Get('/metadata')
  getMetadata() {
    return resolveResponse(this.kycService.getMetadata());
  }

  @Post('/verify')
  verifyDocument(@Body() document: CreateKycDto, @CurrentUser() user: User) {
    return resolveResponse(this.kycService.verifyDocument(document, user));
  }
}
