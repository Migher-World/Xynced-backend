import { Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { Feedback } from './entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService extends BasicService<Feedback> {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {
    super(feedbackRepository, 'Feedback');
  }
}
