import slugify from 'slugify';
import env from '../../config/env.config';
const url = require('url');
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import * as tokenGen from 'otp-generator';
import { CloudStorage } from '../plugins/cloud-storage';
import { Cloudinary } from '../plugins/cloud-storage/cloudinary';

class SlugifyOptions {
  lower: boolean;
  replacement: string;
}

export class Helper {
  static faker = faker;

  static async hash(string: string) {
    return bcrypt.hash(string, 10);
  }

  static slugify(name: string, options?: SlugifyOptions) {
    if (options) {
      return slugify(name, options);
    }
    return slugify(name, { lower: true, replacement: '_' });
  }

  static randPassword(letters: number, numbers: number, either: number) {
    const chars = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', // letters
      '0123456789', // numbers
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // either
    ];

    return [letters, numbers, either]
      .map(function (len, i) {
        return Array(len)
          .fill(chars[i])
          .map(function (x) {
            return x[Math.floor(Math.random() * x.length)];
          })
          .join('');
      })
      .concat()
      .join('')
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
  }

  static getScheme() {
    const dbUrl = url.parse(env.dbUrl);
    const scheme = dbUrl.protocol.substr(0, dbUrl.protocol.length - 1);
    return scheme;
  }

  static generateToken(length: number = 6, options: Record<string, any> = {}) {
    return tokenGen.generate(length, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
      digits: true,
      ...options,
    });
  }

  static numberWithCommas(x: number | string): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static cleanQuery(value: string) {
    if (!value) return null;
    if (value == '') return null;
    return value;
  }

  static async cloudinaryUpload(file: Express.Multer.File, options?: Record<string, unknown>) {
    const storage = new CloudStorage(new Cloudinary());
    const { path } = file;
    const fileUrl = await storage.uploadFile(path, undefined, options);
    return fileUrl;
  }

  static toSentenceCase(str: string) {
    // change to sentence case (first letter uppercase) and remove underscores or dashes
    return str
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }
}
