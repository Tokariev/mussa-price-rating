import { Module } from '@nestjs/common';
import { PriceHistoryService } from './price-history.service';

@Module({
  controllers: [],
  providers: [PriceHistoryService],
  exports: [PriceHistoryService],
})
export class PriceHistoryModule {}
