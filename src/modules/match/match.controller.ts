import { Controller, Get, Param, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { resolveResponse } from '../../shared/resolvers';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('match')
@ApiTags('Match')
@ApiBearerAuth()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  getMatches(@CurrentUser() user: User) {
    return resolveResponse(this.matchService.getPotentialMatches(user));
  }

  @Post('accept/:matchId')
  acceptMatch(@CurrentUser() user: User, @Param('matchId') matchId: string) {
    return resolveResponse(this.matchService.acceptMatch(user, matchId));
  }

  @Post('reject/:matchId')
  declineMatch(@CurrentUser() user: User, @Param('matchId') matchId: string) {
    return resolveResponse(this.matchService.declineMatch(user, matchId));
  }
}
