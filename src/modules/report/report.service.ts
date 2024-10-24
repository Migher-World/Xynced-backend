import { Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { Report } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportService extends BasicService<Report> {
  constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) {
    super(reportRepository, 'Report');
  }

  async createReport(dto: ReportDto, user: User): Promise<Report> {
    const { reportedUserId, reason } = dto;
    
    const report = this.reportRepository.create({
      reportingUserId: user.id,
      reportedUserId,
      reason,
    });

    return this.reportRepository.save(report);
  }

  async getReportsAgainstUser(user: User): Promise<Report[]> {
    return this.reportRepository.find({ where: { reportedUserId: user.id } });
  }

  async getReportsByUser(user: User): Promise<Report[]> {
    return this.reportRepository.find({ where: { reportingUserId: user.id } });
  }
}
