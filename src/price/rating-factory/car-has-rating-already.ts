import { Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CarType } from './interfaces/car.type';
import { PriceRatingDto } from '../dto/price-rating-dto';
@Injectable()
export class CarHasRating implements ICar {
  constructor(private eventEmitter: EventEmitter2) {}

  async process(car: CarType): Promise<void> {
    const priceRating: PriceRatingDto = {
      id: car.id,
      price_rating_object: car.price_rating_object,
    };

    this.eventEmitter.emit('onRatingProcessed', priceRating);
  }
}
