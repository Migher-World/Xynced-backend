import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { resolveResponse } from '../../shared/resolvers';
import { ReportDto } from './dto/report.dto';

@Controller('report')
@ApiTags('Report')
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a report' })
  async createReport(@CurrentUser() user: User, @Body() dto: ReportDto) {
    return resolveResponse(this.reportService.createReport(dto, user));
  }

  @Get('received')
  @ApiOperation({ summary: 'Get reports against a user' })
  async getReportsAgainstUser(@CurrentUser() user: User) {
    return resolveResponse(this.reportService.getReportsAgainstUser(user));
  }

  @Get('made')
  @ApiOperation({ summary: 'Get reports made by a user' })
  async getReportsByUser(@CurrentUser() user: User) {
    return resolveResponse(this.reportService.getReportsByUser(user));
  }
}
