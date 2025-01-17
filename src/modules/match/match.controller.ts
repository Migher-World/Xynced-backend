import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { resolveResponse } from '../../shared/resolvers';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FeedbackDto } from '../feedback/dto/feedback.dto';
import { UseRoles } from '../../shared/decorators/role.decorator';
import { RoleGuard } from '../../shared/guards/roles.guard';

@Controller('match')
@ApiTags('Match')
@ApiBearerAuth()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  getMatches(@CurrentUser() user: User) {
    return resolveResponse(this.matchService.getPotentialMatches(user));
  }

  @Get('can-reshuffle')
  canReshuffle(@CurrentUser() user: User) {
    return resolveResponse(this.matchService.canReshuffle(user));
  }

  @Get(':id')
  getMatch(@CurrentUser() user: User, @Param('id') matchId: string) {
    return resolveResponse(this.matchService.getMatchById(user, matchId));
  }

  @Post('accept/:matchId')
  acceptMatch(@CurrentUser() user: User, @Param('matchId') matchId: string) {
    return resolveResponse(this.matchService.acceptMatch(user, matchId));
  }

  @Post('reject/:matchId')
  declineMatch(@CurrentUser() user: User, @Param('matchId') matchId: string) {
    return resolveResponse(this.matchService.declineMatch(user, matchId));
  }

  @Post('reshuffle')
  reshuffleMatches(@CurrentUser() user: User) {
    return resolveResponse(this.matchService.reshuffleMatches(user));
  }

  @Get('/admin/match-analysis')
  @UseRoles('admin')
  @UseGuards(RoleGuard)
  getMatchAnalysis() {
    return resolveResponse(this.matchService.getMatchAnalysis());
  }

  @Post('/unmatch-user')
  unmatchUser(@CurrentUser() user: User, @Body() payload: FeedbackDto) {
    return resolveResponse(this.matchService.unmatchUser(user, payload));
  }
}
