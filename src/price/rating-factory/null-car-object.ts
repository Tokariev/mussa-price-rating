import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';

@Injectable()
export class NullCar implements ICar {
  async process(car: any): Promise<void> {
    console.log('Null car. Skip it.');
  }
}
