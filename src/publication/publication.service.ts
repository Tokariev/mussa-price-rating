import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
import { EventData, EventPayload } from '../events/event';
import { EVENTS } from '../events/events.constants';
import { CarType } from '../rating/types/car.type';

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
      externalCarId: data.externalCarId,
      isAdNew: true,
    } as EventData;

    this.eventEmitter.emit(
      'fragment',
      new EventPayload(EVENTS.FRAGMENT.PUBLICATION_IS_NEW, publicationState),
    );
  }

  isPublicationNew = async (data: CarType): Promise<boolean> => {
    if (data.source.includes('mobile.de')) {
      return await this.isMobilePublicationNew(data);
    }

    if (
      data.source.includes('autoscout24.de') &&
      data.price_history.length > 1
    ) {
      return false;
    }

    return true;
  };

  isSamePublicationInDatabase = async (data: CarType): Promise<boolean> => {
    const response = await loggerApi.post('/car/find-all-by-url', {
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

  isMobilePublicationNew = async (data: CarType): Promise<boolean> => {
    const response = await axios.post(
      'https://makkizentral.de/api/parser/parse-not-emit',
      {
        url: data.source,
        action: 'checkIfCarIsAvailable',
      },
    );

    if (response.data.ad_status === 'INACTIVE') {
      return true;
    }

    return false;
  };
}
