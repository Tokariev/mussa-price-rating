import { CarType } from './car.type';

export interface ICar {
  process(car: CarType): Promise<void>;
}
