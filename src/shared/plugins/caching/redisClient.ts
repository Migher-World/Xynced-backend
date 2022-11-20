import { createClient } from 'redis';
import { commandOptions, RedisClientType } from '@redis/client';
import { RedisClusterClientOptions } from '@redis/client/dist/lib/cluster';
import {
  ICache,
  ICacheSetCommand,
  IIncrByCommand,
  ISetTtlCommand,
} from './ICache';
import { ILogger } from './ILogger';
export class RedisClient implements ICache {
  protected client: RedisClientType;

  private shuttingDown = false;

  constructor(
    protected name: string,
    rootNodes: RedisClusterClientOptions[],
    protected logger: ILogger,
  ) {
    const first = rootNodes[0];
    this.client = createClient({
      password: first.password,
      url: first.url,
      username: first.username,
      readonly: first.readonly,
    });
    this.initEvents();
  }

  get isConnected(): boolean {
    return this.client.isReady;
  }

  private initEvents() {
    this.client.on('error', (err) => {
      this.logger.error(`Cache error on cache: ${this.name}`, err);
    });

    this.client.on('end', () => {
      this.logger.info(`${this.name} Cache connection end`);
    });

    this.client.on('connect', () => {
      this.logger.info(`${this.name} Cache connected`);
    });

    this.client.on('ready', () => {
      this.logger.info(`${this.name} Cache ready`);
    });
  }

  async set<T>(key: string | Buffer, value: T, ttl?: number): Promise<void> {
    if (this.shuttingDown || !key) return;
    try {
      await this.client.set(
        key,
        value as string,
        ttl !== null ? { EX: ttl } : null,
      );
    } catch (error) {
      this.logger.error(`Error setting key: ${key}`, error);
    }
  }
  reset(): Promise<void> {
    return this.clear();
  }
  async clear(): Promise<void> {
    try {
      await this.client.FLUSHDB();
    } catch (error) {
      this.logger.error(`Error clearing cache: ${this.name}`, error);
    }
  }
  async gracefulShutdown(): Promise<void> {
    if (this.shuttingDown) return;
    try {
      this.shuttingDown = true;
      await this.client.disconnect();
    } catch (error) {
      this.logger.error(`Error shutting down cache: ${this.name}`, error);
    }
  }

  async connect(): Promise<void> {
    if (this.shuttingDown) return;
    return await this.client.connect();
  }

  onConnected(listener: (...args: any[]) => void) {
    return this.client.on('connect', listener);
  }

  get isShuttingDown(): boolean {
    return this.shuttingDown;
  }

  async hset<T>(key: string | Buffer, field: string, value: T): Promise<void> {
    if (this.shuttingDown || !key || !field) return null;
    try {
      await this.client.hSet(key, field, value as string);
    } catch (error) {
      this.logger.error(`Error hset for key: ${key}, field: ${field}`, error);
    }
    return null;
  }
  async hget<T>(key: string | Buffer, field: string): Promise<T> {
    if (this.shuttingDown || !key || !field) return null;
    try {
      const getAsBuffer = Buffer.isBuffer(key);
      const result = await this.client.hGet(
        commandOptions({ returnBuffers: getAsBuffer }),
        key,
        field,
      );
      return result as T;
    } catch (error) {
      this.logger.error(`Error hget for key: ${key}, field: ${field}`, error);
    }
    return null;
  }
  async hdel<T>(key: string | Buffer, field: string): Promise<T> {
    if (this.shuttingDown || !key || !field) return null;
    try {
      await this.client.hDel(key, field);
    } catch (error) {
      this.logger.error(`Error hset for key: ${key}, field: ${field}`, error);
    }
    return null;
  }
  async hkeys(key: string | Buffer): Promise<string[]> {
    if (this.shuttingDown || !key) return null;
    try {
      return await this.client.hKeys(key);
    } catch (error) {
      this.logger.error(`Error hkeys for key: ${key}`, error);
    }
    return null;
  }

  async getTtl(key: string | Buffer): Promise<number> {
    if (this.shuttingDown || !key) return null;
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting ttl for key: ${key}`, error);
    }
    return null;
  }

  async mgetTtl(keys: string[] | Buffer[]): Promise<number[]> {
    if (this.shuttingDown) {
      return keys?.map(() => null) || [];
    }
    return await Promise.all(
      keys.map((key: string | Buffer) => this.getTtl(key)),
    );
  }
  async del(key: string | Buffer): Promise<void> {
    if (this.shuttingDown || !key) return null;
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error invalidating key: ${key}`, error);
    }
    return null;
  }
  async mdel(keys: string[] | Buffer[]): Promise<void> {
    if (this.shuttingDown) return null;
    await Promise.all(keys.map((key: string | Buffer) => this.del(key)));
  }

  async mset(commands: ICacheSetCommand[]): Promise<void> {
    if (this.shuttingDown || !commands) return;
    try {
      await Promise.all(
        commands.map((command: ICacheSetCommand) =>
          this.client.set(
            command.key,
            command.value,
            command.ttl !== null ? { EX: command.ttl } : null,
          ),
        ),
      );
    } catch (error) {
      this.logger.error(
        `Error setting keys: ${commands.map((command) => command.key)}`,
        error,
      );
    }
  }

  async setTtl(key: string | Buffer, ttl: number): Promise<void> {
    if (this.shuttingDown || !key) return;
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      this.logger.error(`Error setting ttl for key: ${key}`, error);
    }
    return null;
  }
  async msetTtl(commands: ISetTtlCommand[]): Promise<void> {
    if (this.shuttingDown || !commands) return;
    try {
      await Promise.all(
        commands.map((command: ISetTtlCommand) =>
          this.client.expire(command.key, command.value),
        ),
      );
    } catch (error) {
      this.logger.error(
        `Error setting ttl for keys: ${commands.map((command) => command.key)}`,
        error,
      );
    }
    return null;
  }

  async get<T>(key: string | Buffer): Promise<T> {
    if (this.shuttingDown || !key) return null;
    try {
      const getAsBuffer = Buffer.isBuffer(key);
      const cached = await this.client.get(
        commandOptions({ returnBuffers: getAsBuffer }),
        key,
      );

      return cached as T;
    } catch (error) {
      this.logger.error(`Error getting key: ${key}`, error);
    }

    return null;
  }

  async mget<T>(keys: string[] | Buffer[]): Promise<T[]> {
    if (this.shuttingDown || !keys || keys?.length === 0)
      return keys?.map(() => null);
    try {
      const getAsBuffer = Buffer.isBuffer(keys[0]);
      const cached = await this.client.mGet(
        commandOptions({ returnBuffers: getAsBuffer }),
        keys,
      );
      return cached as T[];
    } catch (error) {
      this.logger.error(`Error getting keys: ${keys}`, error);
    }

    return keys?.map(() => null);
  }

  async incrby(key: string | Buffer, increment: number): Promise<number> {
    if (this.shuttingDown || !key) return null;
    try {
      return await this.client.incrBy(key, increment);
    } catch (error) {
      this.logger.error(`Error incrementing key: ${key}`, error);
    }

    return null;
  }

  async mincrby(commands: IIncrByCommand[]): Promise<number[]> {
    if (this.shuttingDown || !commands) return null;
    try {
      return await Promise.all(
        commands.map((command: IIncrByCommand) => {
          if (!command.key) return null;
          return this.client.incrBy(command.key, command.value);
        }),
      );
    } catch (error) {
      this.logger.error(
        `Error incrementing keys: ${commands.map((command) => command.key)}`,
        error,
      );
    }

    return commands.map(() => null);
  }
}
