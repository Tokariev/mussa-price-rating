import { Injectable } from '@nestjs/common';
import { CarDbType } from '../rating/types/car-db.type';
import { CarType } from '../rating/types/car.type';
import axios from 'axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from '../events/event';
import { EVENTS } from '../events/events.constants';
import e from 'express';

@Injectable()
export class PriceHistoryService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async processPriceHistory(car: CarType) {
    const priceHistory = [];

    const carsWithSameUrls = await this.findSameCars(car.source);

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

  async findSameCars(sourceUrl: string): Promise<CarDbType[]> {
    let mobileDeId = null;

    // Check if sourceUrl is contains mobile.de
    console.log('Searching for the same cars in the database...');

    if (sourceUrl.includes('mobile.de')) {
      mobileDeId = this.extractMobileDeId(sourceUrl);
    }

    if (mobileDeId) {
      console.log('Found Mobile.de ID:', mobileDeId);

      const response = await axios.post(
        'http://logger:3005/car/find-all-by-mobile-de-id',
        {
          mobileDeId: mobileDeId,
        },
      );

      return response.data;
    } else {
      console.log('No mobile.de ID found', sourceUrl);
    }

    // If sourceUrl is not mobile.de, then check if it is in the database
    const response = await axios.post(
      'http://logger:3005/car/find-all-by-url',
      {
        source: sourceUrl,
      },
    );

    return response.data;
  }

  extractMobileDeId(sourceUrl: string) {
    const regex1 = /(?:\?|&)id=(\d+)/;
    const match1 = sourceUrl.match(regex1);

    // For the second sourceUrl format
    const regex2 = /\/(\d+)\.html/;
    const match2 = sourceUrl.match(regex2);

    // Check which regex matched and return the ID
    if (match1 && match1[1]) {
      return match1[1];
    } else if (match2 && match2[1]) {
      return match2[1];
    }

    // Return null if no match is found
    return null;
  }
}
