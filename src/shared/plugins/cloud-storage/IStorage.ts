import { Express } from 'express';

export interface IStorage {
  getFileUrl(filename: string): Promise<string>;
  uploadFile(
    filenameOrPath: string,
    body?: Buffer | Express.Multer.File,
    options?: Record<string, unknown>,
  ): Promise<string>;
  downloadFile(filename: string): Promise<Buffer>;
}
