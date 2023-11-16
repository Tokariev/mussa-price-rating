import { Inject } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { InactiveCarProducerService } from '../jobs/inactive-cars-producer.service';
import { CarType } from './interfaces/car.type';

export class Autoscout24 implements ICar {
  constructor(
    @Inject(InactiveCarProducerService)
    private readonly inactiveCarProducerService: InactiveCarProducerService,
  ) {}

  // This car is from autoscout24.de and will be available in 65 (maybe earlier) seconds
  async process(car: CarType): Promise<void> {
    if (car.price_rating.rating) {
      return;
    }

    this.inactiveCarProducerService.processCarLater(car, 10);
    this.inactiveCarProducerService.processCarLater(car, 30);
    this.inactiveCarProducerService.processCarLater(car, 60);
  }
}
