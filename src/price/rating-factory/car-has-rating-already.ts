import { Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CarHasRating implements ICar {
  constructor(private eventEmitter: EventEmitter2) {}

  async process(car: any): Promise<void> {
    console.log(`Car ${car.brand} has rating already ${car.price_rating}`);

    this.eventEmitter.emit('onRatingProcessed', {
      id: car.id,
      price_rating: car.price_rating,
    });
  }
}
