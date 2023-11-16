// Create websocket client in rating/src/websocket/websocket.client.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Socket, io } from 'socket.io-client';
import { PriceService } from '../price/price.service';
import { EventPayload } from 'src/price/events/event';
import { EVENTS } from 'src/price/events/events.constants';
import { PublicationService } from 'src/publication/publication.service';

const socketUrl = io('http://central-api:3000');

@Injectable()
export class SocketClientService implements OnModuleInit {
  public socketClient: Socket;

  constructor(
    private readonly priceService: PriceService,
    private readonly publicationService: PublicationService,
  ) {
    this.socketClient = socketUrl;
  }

  onModuleInit() {
    this.registerConsumerEvents();
  }

  private registerConsumerEvents() {
    this.socketClient.on('connect', () => {
      console.log(`Connected to central-api server`);
    });

    this.socketClient.on('car', (car) => {
      console.log(`Post ptocessing ${car.data.brand} 🚙 `);
      this.priceService.processRating(car.data);
      this.publicationService.processPublication(car.data);
    });
  }

  // Display event name and data in console
  @OnEvent('**')
  handleEverything(payload: EventPayload) {
    const { type } = payload as EventPayload;

    switch (type) {
      case EVENTS.CAR_WITH_VERY_GOOD_PRICE.FOUND:
        this.socketClient.emit('carWithVeryGoodPrice', payload);
        break;
      case EVENTS.CAR_WITH_VERY_GOOD_PRICE.UPDATED:
        this.socketClient.emit('carWithVeryGoodPrice', payload);
        break;
      case EVENTS.CAR_WITH_VERY_GOOD_PRICE.DELETED:
        this.socketClient.emit('carWithVeryGoodPrice', payload);
        break;
      case EVENTS.PRICE_RATING.PROCESSED:
        this.socketClient.emit('fragment', payload);
        break;
      case EVENTS.FRAGMENT.CAR_IS_DAMAGED:
        this.socketClient.emit('fragment', payload);
        break;
      case EVENTS.FRAGMENT.PUBLICATION_IS_NEW:
        this.socketClient.emit('fragment', payload);
        break;
      default:
        break;
    }
  }
}
