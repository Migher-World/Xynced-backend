import { Injectable } from '@nestjs/common';
import { Helper } from './shared/helpers';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileUrl = await Helper.cloudinaryUpload(file, {
      public_id: file.originalname,
    });
    return fileUrl;
  }
}
