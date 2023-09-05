import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PriceService } from './price.service';
import { CarWithoutRating } from './rating-factory/car-without-rating';
import { CarIsNotAvailableNow } from './rating-factory/car-is-not-available-now';
import { InactiveCarProducerService } from './jobs/inactive-cars-producer.service';
import { VeryGoodPriceCarProducerService } from './jobs/very-good-price-car-producer.service';
import { RatingFactoryService } from './rating-factory/rating-factory.service';
import { VeryGoodPriceCarsConsumer } from './jobs/very-good-price-car-consumer.service';
import { InactiveCarsConsumer } from './jobs/inactive-cars-consumer.service';
import { CarHasRating } from './rating-factory/car-has-rating-already';
import { CarIsAvailable } from './rating-factory/car-is-available';
import { NullCar } from './rating-factory/null-car-object';

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
    CarHasRating,
    CarIsAvailable,
    RatingFactoryService,
    CarWithoutRating,
    CarIsNotAvailableNow,

    InactiveCarProducerService,
    InactiveCarsConsumer,
    VeryGoodPriceCarProducerService,
    VeryGoodPriceCarsConsumer,
    NullCar,
  ],
  // Need for socket module
  exports: [PriceService],
})
export class PriceModule {}
