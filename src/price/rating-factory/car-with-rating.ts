import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CarType } from './interfaces/car.type';
import { PriceRatingDto } from '../dto/price-rating-dto';
import { VeryGoodPriceCarProducerService } from '../jobs/very-good-price-car-producer.service';
import { EVENTS } from '../events/events.constants';
import { EventPayload } from '../events/event';

const LOGGER = 'http://logger:3005';

@Injectable()
export class CarWithRating implements ICar {
  constructor(
    private eventEmitter: EventEmitter2,

    @Inject(VeryGoodPriceCarProducerService)
    private readonly veryGoodPriceCarProducerService: VeryGoodPriceCarProducerService,
  ) {}

  async process(car: CarType): Promise<void> {
    const data = {
      id: car.id,
      price_rating: car.price_rating,
    };

    this.eventEmitter.emit(
      'fragment',
      new EventPayload(EVENTS.PRICE_RATING.PROCESSED, data),
    );

    // if (this.hasVeryGoodPrice(car)) {
    //   console.log(`...Car ${car.brand} has very good price ⭐️⭐️⭐️⭐️⭐️`);

    //   this.eventEmitter.emit(
    //     'carWithVeryGoodPrice',
    //     new EventPayload(EVENTS.CAR_WITH_VERY_GOOD_PRICE.FOUND, car),
    //   );

    //   const documentId = await this.fetchDocumentId(car);

    //   this.veryGoodPriceCarProducerService.chekEvery1HourIsOnline(documentId);
    // }
  }

  // Duplicate logic. The same is in car-is-available.ts
  // async fetchDocumentId(car: any): Promise<any> {
  //   console.log(`...Try to fetch document id from logger`);

  //   try {
  //     const response = await axios.post(`${LOGGER}/car/find-last-by-url`, {
  //       source: car.source,
  //     });

  //     console.log(`...Fetched document id ✅ ${response.data._id}`);

  //     return response.data._id;
  //   } catch (error) {
  //     console.log('Error while fetching document id');
  //   }
  // }

  // hasVeryGoodPrice(car: any) {
  //   const rating = car.price_rating.rating;

  //   if (rating === 'VERY_GOOD_PRICE') {
  //     return true;
  //   }

  //   return false;
  // }
}
