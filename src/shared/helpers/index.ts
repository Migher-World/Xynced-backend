import slugify from 'slugify';
import EnvironmentVariables from '../../config/env.config';
const url = require('url');
import * as faker from 'faker';

class SlugifyOptions {
  lower: boolean;
  replacement: string;
}

export class Helper {
  static faker = faker;

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
    const dbUrl = url.parse(EnvironmentVariables.typeormUrl);
    const scheme = dbUrl.protocol.substr(0, dbUrl.protocol.length - 1);
    return scheme;
  }
}
