import { Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CarWitVeryGoodPrice implements ICar {
  constructor(private eventEmitter: EventEmitter2) {}

  async process(car: any): Promise<void> {
    this.eventEmitter.emit('onRatingProcessed', {
      id: car.id,
      rating: car.price_rating,
    });
  }
}
