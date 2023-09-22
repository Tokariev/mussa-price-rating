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

      console.log(
        `Emit CarIsAvailable ${priceRating.price_rating_object.rating}`,
      );

      this.eventEmitter.emit('onRatingProcessed', priceRating);
    } catch (error) {
      console.log(`*Error while parsing url: ${car.source}`);
      console.log(error.message);

      if (error.response.data.traceback) {
        console.log('Parse not emmit error:', error.response.data.traceback);
      }
    }
  }
}
