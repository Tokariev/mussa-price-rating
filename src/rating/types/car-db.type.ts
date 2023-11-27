import { CarType } from './car.type';

// Extend CarType with a new field
export type CarDbType = CarType & {
  createdAt: Date;
};
