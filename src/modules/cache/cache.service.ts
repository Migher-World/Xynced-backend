import { OnModuleInit } from '@nestjs/common';
import env from '../../config/env.config';
import { logger } from '../../shared/logger';
import { ICache } from '../../shared/plugins/caching/ICache';
import { ILogger } from '../../shared/plugins/caching/ILogger';
import { MemoryCache } from '../../shared/plugins/caching/memoryCache';
import { RedisClient } from '../../shared/plugins/caching/redisClient';

export class CacheService implements OnModuleInit {
  private memoryCache: ICache;
  private remoteCache: ICache;
  private logger: ILogger;

  ttl: number = 6000;

  constructor() {
    this.logger = logger;
  }

  async get<T>(key: string): Promise<any> {
    let value: string = await this.memoryCache.get(key);
    if (!value) value = await this.remoteCache.get(key);
    if (!value) return null;
    await this.memoryCache.set(key, value, this.ttl);
    const result = typeof value == 'string' ? value : JSON.parse(value);
    return result as T;
  }

  async set<T>(key: string, value: T, ttl: number = this.ttl): Promise<void> {
    const toCache = typeof value == 'string' ? value : JSON.stringify(value);
    await this.memoryCache.set(key, toCache, ttl);
    await this.remoteCache.set(key, toCache, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.memoryCache.del(key);
    await this.remoteCache.del(key);
  }

  async clear(): Promise<void> {
    await this.memoryCache.clear();
    await this.remoteCache.clear();
  }

  async connect(): Promise<void> {
    await this.memoryCache.connect();
    await this.remoteCache.connect();
  }

  async onModuleInit() {
    this.memoryCache = new MemoryCache(`${env.appName}-memory-cache`);
    this.remoteCache = new RedisClient(
      `${env.appName}-remote-cache`,
      [{ url: env.redisUrl }],
      this.logger,
    );
    await this.connect();
  }
}
