import { Module } from '@nestjs/common';
import { CarManagerService } from './car-manager.service';
import { JobsModule } from '../jobs/jobs.module';
import { RatingModule } from '../rating/rating.module';
import { CarAccidentModule } from '../car-accident/car-accident.module';
import { ParserModule } from '../parser/parser.module';
import { PriceHistoryModule } from '../price-history/price-history.module';

@Module({
  imports: [
    JobsModule,
    RatingModule,
    CarAccidentModule,
    ParserModule,
    PriceHistoryModule,
  ],
  providers: [CarManagerService],
  exports: [CarManagerService],
})
export class CarManagerModule {}
