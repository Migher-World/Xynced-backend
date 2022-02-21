import { CachingConfig } from 'cache-manager';
import { createClient } from 'redis';
import * as fs from 'fs';
import EnvironmentVariables from '../../../config/env.config';

export default class RedisStore {
  static client: any;
  static options: any = {
    ca: fs.readFileSync(__dirname + '/ca.pem'),
    key: fs.readFileSync(__dirname + '/user_private.key'),
    cert: fs.readFileSync(__dirname + '/user.crt'),
    rejectUnauthorized: false,
  };

  static async connect() {
    const client = createClient({
      socket: {
        tls: true,
        ...RedisStore.options,
      },
      url: EnvironmentVariables.redisUrl,
    });

    await client.connect();

    this.client = client;
  }

  static async get(key: string) {
    const data = await this.client.get(key);
    if (!data) return { status: false };
    return { status: true, data };
  }

  static set(key: string, value: any, options?: CachingConfig) {
    return this.client.set(key, value, options);
  }

  static remove(key: string) {
    return this.client.del(key);
  }
}
