import { Inject } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { InactiveCarProducerService } from '../jobs/inactive-cars-producer.service';
import { CarType } from './interfaces/car.type';
export class CarIsNotAvailableNow implements ICar {
  constructor(
    @Inject(InactiveCarProducerService)
    private readonly inactiveCarProducerService: InactiveCarProducerService,
  ) {}

  async process(car: CarType): Promise<void> {
    this.inactiveCarProducerService.processCarLater(car, 60);
  }
}
