import { Injectable } from '@nestjs/common';
import { CarDbType } from '../rating/types/car-db.type';
import { CarType } from '../rating/types/car.type';
import axios from 'axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from '../events/event';
import { EVENTS } from '../events/events.constants';

@Injectable()
export class PriceHistoryService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async processPriceHistory(car: CarType) {
    const priceHistory = [];

    const carsWithSameUrls = await this.findCarsWithSameUrl(car.source);

    for (const carWithSameUrl of carsWithSameUrls) {
      priceHistory.push({
        price: carWithSameUrl.price,
        timestamp: carWithSameUrl.createdAt,
      });
    }

    if (priceHistory.length === 0) {
      return;
    }

    const data = {
      id: car.id,
      price_history: priceHistory,
    };

    this.eventEmitter.emit(
      'fragment',
      new EventPayload(EVENTS.PRICE_HISTORY.FOUND, data),
    );
  }

  async findCarsWithSameUrl(sourceUrl: string): Promise<CarDbType[]> {
    const response = await axios.post(
      'http://logger:3005/car/find-all-by-url',
      {
        source: sourceUrl,
      },
    );

    return response.data;
  }
}
