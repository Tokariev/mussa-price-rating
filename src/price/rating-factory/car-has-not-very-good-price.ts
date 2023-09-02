import { Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PriceRatingDto } from '../dto/price-rating-dto';

@Injectable()
export class CarHasNotVeryGoodPrice implements ICar {
  constructor(private eventEmitter: EventEmitter2) {}

  async process(car: any): Promise<void> {
    console.log(car.brand, 'has not very good price', car.price_rating);
    console.log('Job done and will be removed from queue');

    this.eventEmitter.emit('onRatingProcessed', {
      id: car.id,
      price_rating: car.price_rating,
    } as PriceRatingDto);
  }
}
