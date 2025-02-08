import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { CarType } from './types/car.type';
import { EventPayload } from '../events/event';
import { EVENTS } from '../events/events.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RatingService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async processRating(parsedData: CarType): Promise<void> {
    const data = {
      externalCarId: parsedData.externalCarId,
      price_rating: parsedData.price_rating,
    };

    this.eventEmitter.emit(
      'fragment',
      new EventPayload(EVENTS.PRICE_RATING.PROCESSED, data),
    );
  }
}
