import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
import { EventPayload } from '../price/events/event';
import { EVENTS } from '../price/events/events.constants';
import { CarType } from '../price/rating-factory/interfaces/car.type';

const loggerApi = axios.create({
  baseURL: 'http://logger:3005',
});

@Injectable()
export class PublicationService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async processPublication(data: CarType) {
    const isAdNew = await this.isPublicationNew(data);

    if (!isAdNew) {
      return;
    }

    const publicationState = {
      id: data.id,
      isAdNew: true,
    };

    this.eventEmitter.emit(
      'fragment',
      new EventPayload(EVENTS.FRAGMENT.PUBLICATION_IS_NEW, publicationState),
    );
  }

  isPublicationNew = async (data: CarType): Promise<boolean> => {
    if (data.source.includes('mobile.de')) {
      return await this.isPublicationOnline(data);
    }

    return true;
  };

  isSamePublicationInDatabase = async (data: CarType): Promise<boolean> => {
    const response = await loggerApi.post('/car/find-by-url', {
      source: data.source,
    });

    if (!response.data) {
      return false;
    }

    if (response.data.length > 1) {
      return true;
    }

    return false;
  };

  hasPublicationPriceHistory = async (data: CarType): Promise<boolean> => {
    const response = await loggerApi.post('/car/find-last-by-url', {
      source: data.source,
    });

    if (!response.data) {
      return false;
    }

    if (response.data.price_history.length > 1) {
      return true;
    }

    return false;
  };

  isPublicationOnline = async (data: CarType): Promise<boolean> => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: data.source,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.google.com/',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        TE: 'trailers',
      },
    };

    try {
      await axios(config);
      // Exception will be thrown if publication is offline
      return false;
    } catch (error) {
      return true;
    }
  };
}
