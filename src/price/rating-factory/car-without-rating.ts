import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';

@Injectable()
export class CarWithoutRating implements ICar {
  constructor() {}

  async process(car: any): Promise<void> {
    console.log(car.source, 'doesn`t have price rating. Skip it.');
  }
}
