import axios from 'axios';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PriceRatingDto } from '../dto/price-rating-dto';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class CarIsAvailable implements ICar {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async process(car: any): Promise<void> {
    console.log(`.Car ${car.brand} from CarDeluxe is already available`);
    console.log(`..Try to parse ${car.source} from CarDeluxe`);

    try {
      const response = await axios.post(
        'http://central-api:3000/api/parser/parse-not-emit',
        {
          url: car.source,
        },
      );

      console.log(`...Parsed ✅`);

      const priceRating: PriceRatingDto = {
        id: car.id,
        price_rating_object: response.data.price_rating_object,
      };

      this.eventEmitter.emit('onRatingProcessed', priceRating);

      const rating_reason = response.data.price_rating_object.rating_reason;

      // TODO: Uncomment this after onFragment test
      // if (this.hasDescriptionDamamage(rating_reason)) {
      const carAccident = {
        id: car.id,
        has_car_accident: true,
      };

      this.eventEmitter.emit('onFragment', carAccident);
      // }
    } catch (error) {
      console.log(`*Error while parsing url: ${car.source}`);

      if (error.response.data.traceback) {
        console.log('Parse not emmit error:', error.response.data.traceback);
      }
    }
  }

  hasDescriptionDamamage(ratingReason: string): boolean {
    if (ratingReason.toLowerCase().includes('unfall')) {
      return true;
    }
  }
}
