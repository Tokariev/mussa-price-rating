import axios from 'axios';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PriceRatingDto } from '../dto/price-rating-dto';
import { Inject, Injectable } from '@nestjs/common';
import { VeryGoodPriceCarProducerService } from '../jobs/very-good-price-car-producer.service';
@Injectable()
export class CarIsAvailable implements ICar {
  constructor(
    private readonly eventEmitter: EventEmitter2,

    @Inject(VeryGoodPriceCarProducerService)
    private readonly veryGoodPriceCarProducerService: VeryGoodPriceCarProducerService,
  ) {}

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

      this.eventEmitter.emit('price_rating.processed', priceRating);

      const rating_reason = response.data.price_rating_object.rating_reason;

      if (this.containsDescriptionDamage(rating_reason)) {
        const carHasAccident = {
          id: car.id,
          has_car_accident: true,
        };

        this.eventEmitter.emit('fragment.new', carHasAccident);
      }

      if (this.hasVeryGoodPrice(car)) {
        console.log(`...Car ${car.brand} has very good price`);

        this.eventEmitter.emit('very_good_price.found', car);

        const documentId = await this.fetchDocumentId(car);

        console.log(`...Document id: ${documentId}`);

        this.veryGoodPriceCarProducerService.chekEvery1HourIsOnline(documentId);
      }
    } catch (error) {
      console.log(`*Error while parsing url: ${car.source} ❌`);
      console.log(error);
    }
  }

  async fetchDocumentId(car: any): Promise<any> {
    try {
      const response = await axios.post(
        'http://logger:3005/car/find-last-by-url',
        {
          source: car.source,
        },
      );
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

  containsDescriptionDamage(ratingReason: string): boolean {
    if (!ratingReason) return false;

    if (ratingReason.toLowerCase().includes('unfall')) {
      return true;
    }

    return false;
  }
}
