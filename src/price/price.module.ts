import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PriceService } from './price.service';
import { CarWithoutRating } from './rating-factory/car-without-rating';

import { CarWitVeryGoodPrice } from './rating-factory/car-with-very-good-price';
import { CarIsNotAvailableNow } from './rating-factory/car-is-not-available-now';
import { CarHasNotVeryGoodPrice } from './rating-factory/car-has-not-very-good-price';
import { InactiveCarProducerService } from './jobs/inactive-cars-producer.service';
import { VeryGoodPriceCarProducerService } from './jobs/very-good-price-car-producer.service';
import { RatingFactoryService } from './rating-factory/rating-factory.service';
import { VeryGoodPriceCarsConsumer } from './jobs/very-good-price-car-consumer.service';
import { InactiveCarsConsumer } from './jobs/inactive-cars-consumer.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'inactive-cars',
    }),
    BullModule.registerQueue({
      name: 'very-good-price-cars',
    }),
  ],
  providers: [
    PriceService,
    RatingFactoryService,
    CarWithoutRating,
    CarIsNotAvailableNow,
    CarWitVeryGoodPrice,
    CarHasNotVeryGoodPrice,
    InactiveCarProducerService,
    InactiveCarsConsumer,
    VeryGoodPriceCarProducerService,
    VeryGoodPriceCarsConsumer,
  ],

  exports: [PriceService],
})
export class PriceModule {}
