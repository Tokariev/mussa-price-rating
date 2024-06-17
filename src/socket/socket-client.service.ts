// Create websocket client in rating/src/websocket/websocket.client.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Socket, io } from 'socket.io-client';
import { EventPayload } from '../events/event';
import { EVENTS } from '../events/events.constants';
import { PublicationService } from '../publication/publication.service';
import { CarManagerService } from '../car-manager/car-manager.service';

const socketUrl = io('http://central-api:3000');

@Injectable()
export class SocketClientService implements OnModuleInit {
  public socketClient: Socket;

  constructor(
    private readonly publicationService: PublicationService,
    private readonly carManagerService: CarManagerService,
  ) {
    this.socketClient = socketUrl;
  }

  onModuleInit() {
    this.registerConsumerEvents();
  }

  private registerConsumerEvents() {
    this.socketClient.on('car', (car) => {
      console.log('... ))) car event');
      this.publicationService.processPublication(car.data);
      this.carManagerService.processCar(car.data);
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
      case EVENTS.FRAGMENT.CAR_ACCIDENT:
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
