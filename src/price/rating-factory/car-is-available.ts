import axios from 'axios';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { CarType } from './interfaces/car.type';
import { EVENTS } from '../events/events.constants';
import { EventPayload } from '../events/event';

@Injectable()
export class CarIsAvailable implements ICar {
  constructor(private readonly eventEmitter: EventEmitter2) {}

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

      // If parsed car is empty, then return
      if (!response.data) {
        console.log(`*Parser return empty result ❌`);
        return;
      }
    } catch (error) {
      console.log(`*Error while parsing url: ${car.source} ❌`);
      console.log(error);

      console.log('Response"', response);
    }

    const parsedCar: CarType = response.data;

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
        new EventPayload(EVENTS.FRAGMENT.CAR_ACCIDENT, carHasAccident),
      );
    }
  }

  containsDescriptionDamage(ratingReason: string): boolean {
    if (!ratingReason) return false;

    if (ratingReason.toLowerCase().includes('unfall')) {
      return true;
    }

    return false;
  }
}
