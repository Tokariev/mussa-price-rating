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
      this.priceService.processRating(data);
    });
  }

  // Response to central-api
  @OnEvent('onRatingProcessed')
  onRatingProcessed(data: any) {
    this.socketClient.emit('onRatingProcessed', data);
  }

  @OnEvent('onFragment')
  onChunk(data: any) {
    this.socketClient.emit('onFragment', data);
  }
}
