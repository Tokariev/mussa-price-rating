import { Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PriceRatingDto } from '../dto/price-rating-dto';
import { CarType } from './interfaces/car.type';
@Injectable()
export class CarWitVeryGoodPrice implements ICar {
  constructor(private eventEmitter: EventEmitter2) {}

  async process(car: CarType): Promise<void> {
    const priceRating: PriceRatingDto = {
      id: car.id,
      price_rating_object: car.price_rating_object,
    };

    this.eventEmitter.emit('onRatingProcessed', priceRating);
  }
}
