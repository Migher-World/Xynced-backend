import slugify from 'slugify';

class SlugifyOptions {
  lower: boolean;
  replacement: string;
}

export class Helper {
  static slugify(name: string, options?: SlugifyOptions) {
    if (options) {
      return slugify(name, options);
    }
    return slugify(name, { lower: true, replacement: '_' });
  }
}
