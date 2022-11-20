import { Global, Module } from '@nestjs/common';
import { CacheService } from './modules/cache/cache.service';

@Global()
@Module({
  imports: [],
  providers: [CacheService],
  exports: [CacheService],
})
export class GlobalModule {}
