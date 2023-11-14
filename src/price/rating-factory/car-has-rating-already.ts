import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CarType } from './interfaces/car.type';
import { PriceRatingDto } from '../dto/price-rating-dto';
import axios from 'axios';
import { VeryGoodPriceCarProducerService } from '../jobs/very-good-price-car-producer.service';

const LOGGER = 'http://logger:3005';

@Injectable()
export class CarHasRating implements ICar {
  constructor(
    private eventEmitter: EventEmitter2,

    @Inject(VeryGoodPriceCarProducerService)
    private readonly veryGoodPriceCarProducerService: VeryGoodPriceCarProducerService,
  ) {}

  async process(car: CarType): Promise<void> {
    const priceRating: PriceRatingDto = {
      id: car.id,
      price_rating_object: car.price_rating_object,
    };

    this.eventEmitter.emit('price_rating.processed', priceRating);

    if (this.hasVeryGoodPrice(car)) {
      console.log(`...Car ${car.brand} has very good price ⭐️⭐️⭐️⭐️⭐️`);

      this.eventEmitter.emit('very_good_price.found', car);

      const documentId = await this.fetchDocumentId(car);

      this.veryGoodPriceCarProducerService.chekEvery1HourIsOnline(documentId);
    }
  }

  // Duplicate logic. The same is in car-is-available.ts
  async fetchDocumentId(car: any): Promise<any> {
    console.log(`...Try to fetch document id from logger`);

    try {
      const response = await axios.post(`${LOGGER}/car/find-last-by-url`, {
        source: car.source,
      });

      console.log(`...Fetched document id ✅ ${response.data._id}`);

      return response.data._id;
    } catch (error) {
      console.log('Error while fetching document id');
    }
  }

  hasVeryGoodPrice(car: any) {
    const rating = car.price_rating_object.rating;

    if (rating === 'VERY_GOOD_PRICE') {
      return true;
    }

    return false;
  }
}
