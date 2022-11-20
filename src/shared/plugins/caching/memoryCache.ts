import cache, { CacheClass } from 'memory-cache';
import {
  ICache,
  ICacheSetCommand,
  IIncrByCommand,
  ISetTtlCommand,
} from './ICache';

const DEFAULT_CACHE_TTL = 15 * 1000;

export class MemoryCache implements ICache {
  protected cache: CacheClass<string, unknown>;
  protected hashCache: Map<string, Map<string, any>> = new Map<
    string,
    Map<string, any>
  >();
  protected hashKeys: Record<string, boolean> = {};

  ttl: number;

  constructor(protected name: string, ttl = DEFAULT_CACHE_TTL) {
    this.ttl = ttl;
    this.cache = new cache.Cache();
  }

  ttls: Record<string, number> = {};

  async connect(): Promise<void> {
    //
  }

  async hset<T>(key: string | Buffer, field: string, value: T): Promise<void> {
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    if (!this.hashCache.has(keyToUse)) {
      this.hashCache.set(keyToUse, new Map<string, any>());
    }
    this.hashCache.get(keyToUse).set(field, value);
  }
  async hget<T>(key: string | Buffer, field: string): Promise<T> {
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    if (!this.hashCache.has(keyToUse)) return null;
    return this.hashCache.get(keyToUse).get(field) as T;
  }
  async hdel(key: string | Buffer, field: string): Promise<void> {
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    if (!this.hashCache.has(keyToUse)) return null;
    this.hashCache.get(keyToUse).delete(field);
  }
  async hkeys(key: string | Buffer): Promise<string[]> {
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    if (!this.hashCache.has(keyToUse)) return null;
    return Array.from(this.hashCache.get(keyToUse).keys());
  }
  async get<T>(key: string | Buffer): Promise<T> {
    if (this.isShuttingDown) return null;
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    const result = this.cache.get(keyToUse);
    if (result === null) delete this.ttls[keyToUse];
    return result as T;
  }

  async mget<T>(keys: string[] | Buffer[]): Promise<T[]> {
    if (this.isShuttingDown) return keys.map(() => null);
    const values = (await Promise.all(
      keys.map((key: string | Buffer) => this.get(key)),
    )) as string[];
    for (let i = 0; i < values.length; i++) {
      if (values[i] === null) delete this.ttls[keys[i] as string];
    }
    return values as T[];
  }
  async del(key: string | Buffer): Promise<void> {
    if (this.isShuttingDown) return null;
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    delete this.ttls[keyToUse];
    return this.cache.del(keyToUse);
  }
  async mdel(keys: string[] | Buffer[]): Promise<void> {
    if (this.isShuttingDown) return null;
    await Promise.all(keys.map((key: string | Buffer) => this.del(key)));
  }
  async set<T>(key: string | Buffer, value: T, ttl?: number): Promise<void> {
    if (this.isShuttingDown) return null;
    if (ttl < 0 || isNaN(ttl) || ttl == null) {
      ttl = this.ttl;
    }
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    this.cache.put(keyToUse, value, ttl * 1000);
    this.ttls[keyToUse] = Date.now() + ttl * 1000 || 1;
  }
  async mset(commands: ICacheSetCommand[]): Promise<void> {
    if (this.isShuttingDown) return null;
    await Promise.all(
      commands.map((command: ICacheSetCommand) =>
        this.set(command.key, command.value, command.ttl),
      ),
    );
  }
  async setTtl(key: string | Buffer, ttl: number): Promise<void> {
    if (this.isShuttingDown) return null;
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    const value = this.cache.get(keyToUse);
    if (!value) return;
    this.cache.put(keyToUse, value, ttl * 1000);
    this.ttls[keyToUse] = Date.now() + ttl || 0;
  }
  async msetTtl(commands: ISetTtlCommand[]): Promise<void> {
    await Promise.all(
      commands.map((command: ISetTtlCommand) =>
        this.setTtl(command.key, command.value),
      ),
    );
  }
  async getTtl(key: string | Buffer): Promise<number> {
    if (this.isShuttingDown) return null;
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    const ttl = this.ttls[keyToUse];
    if (!ttl) return null;
    const delta = ttl - Date.now();
    if (delta >= 0) {
      return Math.ceil(delta / 1000);
    }
    delete this.ttls[keyToUse];
    return null;
  }
  async mgetTtl(keys: string[] | Buffer[]): Promise<number[]> {
    if (this.isShuttingDown) return keys.map(() => null);
    return Promise.all(keys.map((key: string | Buffer) => this.getTtl(key)));
  }
  async incrby(key: string | Buffer, increment: number): Promise<number> {
    if (this.isShuttingDown) return null;
    const keyToUse = Buffer.isBuffer(key) ? key.toString() : key;
    let value = Number(this.cache.get(keyToUse) || 0);
    if (!value) value = 0;
    value += increment;
    this.cache.put(keyToUse, value);
    return value;
  }
  async mincrby(commands: IIncrByCommand[]): Promise<number[]> {
    if (this.isShuttingDown) return commands.map(() => null);
    return Promise.all(
      commands.map((command: IIncrByCommand) =>
        this.incrby(command.key, command.value),
      ),
    );
  }

  async gracefulShutdown(): Promise<void> {
    await this.clear();
    this.cache = new cache.Cache();
    this.isShuttingDown = true;
  }

  isShuttingDown: boolean;

  async clear(): Promise<void> {
    this.cache.clear();
  }

  reset(): Promise<void> {
    return this.clear();
  }
}
