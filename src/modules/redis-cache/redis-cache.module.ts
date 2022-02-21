import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import EnvironmentVariables from '../../config/env.config';
import RedisStore from '../../shared/plugins/redis/redis';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        url: EnvironmentVariables.redisUrl,
        tls: RedisStore.options,
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [CacheModule, RedisCacheService],
})
export class RedisCacheModule {}
