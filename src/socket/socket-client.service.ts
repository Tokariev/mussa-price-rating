// Create websocket client in rating/src/websocket/websocket.client.ts

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Socket, io } from 'socket.io-client';
import { PriceService } from '../price/price.service';

const socketUrl = io('http://central-api:3000');

@Injectable()
export class SocketClientService implements OnModuleInit {
  public socketClient: Socket;

  constructor(private readonly priceService: PriceService) {
    this.socketClient = socketUrl;
  }

  onModuleInit() {
    this.registerConsumerEvents();
  }

  private registerConsumerEvents() {
    this.socketClient.on('connect', () => {
      console.log(`Connected to central-api server`);
    });

    this.socketClient.on('onCarReceived', (data) => {
      console.log(`Get car from central-api and process it 🏃🏻`);
      this.priceService.processRating(data);
    });
  }

  // Response to central-api
  @OnEvent('price_rating.processed')
  onRatingProcessed(data: any) {
    this.socketClient.emit('price_rating.processed', data);
  }

  @OnEvent('very_good_price.found')
  onVeryGoodPrice(data: any) {
    this.socketClient.emit('very_good_price.found', data);
  }

  @OnEvent('very_good_price.deleted')
  onVeryGoodPriceDeleted(data: any) {
    this.socketClient.emit('very_good_price.deleted', data);
  }

  @OnEvent('very_good_price.updated')
  onVeryGoodPriceUpdated(data: any) {
    this.socketClient.emit('very_good_price.updated', data);
  }

  @OnEvent('fragment.new')
  onChunk(data: any) {
    this.socketClient.emit('fragment.new', data);
  }
}
