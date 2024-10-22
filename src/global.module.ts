import { Global, Module } from '@nestjs/common';
import { CacheService } from './modules/cache/cache.service';
import { DatabaseModule } from './database.module';
import { RequestController } from './shared/core';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [CacheService, RequestController],
  exports: [CacheService, DatabaseModule, RequestController],
})
export class GlobalModule {}
