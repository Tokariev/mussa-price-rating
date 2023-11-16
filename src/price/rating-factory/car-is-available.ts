import axios from 'axios';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PriceRatingDto } from '../dto/price-rating-dto';
import { Inject, Injectable } from '@nestjs/common';
import { VeryGoodPriceCarProducerService } from '../jobs/very-good-price-car-producer.service';
import { CarType } from './interfaces/car.type';
import { EVENTS } from '../events/events.constants';
import { EventPayload } from '../events/event';

@Injectable()
export class CarIsAvailable implements ICar {
  constructor(
    private readonly eventEmitter: EventEmitter2, // @Inject(VeryGoodPriceCarProducerService)
    // private readonly veryGoodPriceCarProducerService: VeryGoodPriceCarProducerService,
  ) {}

  async process(car: any): Promise<void> {
    console.log(`..Try to parse ${car.source} from CarDeluxe`);
    let response: any;

    try {
      response = await axios.post(
        'http://central-api:3000/api/parser/parse-not-emit',
        {
          url: car.source,
        },
      );

      const parsedCar: CarType = response.data;

      // If parsed car is empty, then return
      if (!parsedCar) {
        console.log(`*Parser return empty result ❌`);
        return;
      }

      const data = {
        id: car.id,
        price_rating: parsedCar.price_rating,
      };

      this.eventEmitter.emit(
        'fragment',
        new EventPayload(EVENTS.PRICE_RATING.PROCESSED, data),
      );

      const reason = response.data.price_rating.rating_reason;

      if (this.containsDescriptionDamage(reason)) {
        const carHasAccident = {
          id: car.id,
          has_car_accident: true,
        };

        this.eventEmitter.emit(
          'fragment',
          new EventPayload(EVENTS.FRAGMENT.CAR_IS_DAMAGED, carHasAccident),
        );
      }

      // if (this.hasVeryGoodPrice(car)) {
      //   const documentId = await this.fetchDocumentId(car);
      //   this.veryGoodPriceCarProducerService.chekEvery1HourIsOnline(documentId);

      //   this.eventEmitter.emit(
      //     'carWithVeryGoodPrice',
      //     new EventPayload(EVENTS.CAR_WITH_VERY_GOOD_PRICE.FOUND, car),
      //   );
      // }
    } catch (error) {
      console.log(`*Error while parsing url: ${car.source} ❌`);
      console.log(error);

      console.log('Response"', response);
    }
  }

  // async fetchDocumentId(car: any): Promise<any> {
  //   try {
  //     const response = await axios.post(
  //       'http://logger:3005/car/find-last-by-url',
  //       {
  //         source: car.source,
  //       },
  //     );
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

  containsDescriptionDamage(ratingReason: string): boolean {
    if (!ratingReason) return false;

    if (ratingReason.toLowerCase().includes('unfall')) {
      return true;
    }

    return false;
  }
}
