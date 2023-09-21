import { Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { CarType } from './interfaces/car.type';
@Injectable()
export class NullCar implements ICar {
  async process(car: CarType): Promise<void> {
    console.log('Null car. Skip it.');
  }
}
