import { Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { CarType } from './interfaces/car.type';
@Injectable()
export class CarWithoutRating implements ICar {
  constructor() {}

  async process(car: CarType): Promise<void> {
    console.log(car.source, 'doesn`t have price rating. Skip it.');
  }
}
