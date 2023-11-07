import { Inject } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { InactiveCarProducerService } from '../jobs/inactive-cars-producer.service';
import { CarType } from './interfaces/car.type';

export class CarWithoutCity implements ICar {
  constructor(
    @Inject(InactiveCarProducerService)
    private readonly inactiveCarProducerService: InactiveCarProducerService,
  ) {}

  // This car is from autoscout24.de and will be available in 65 (maybe earlier) seconds
  async process(car: CarType): Promise<void> {
    this.inactiveCarProducerService.processCarIn23Seconds(car);
  }
}
