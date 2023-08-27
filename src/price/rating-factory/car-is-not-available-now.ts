import { Inject } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { InactiveCarProducerService } from '../jobs/inactive-cars-producer.service';

export class CarIsNotAvailableNow implements ICar {
  constructor(
    @Inject(InactiveCarProducerService)
    private readonly inactiveCarProducerService: InactiveCarProducerService,
  ) {}

  async process(car: any): Promise<void> {
    this.inactiveCarProducerService.processCarInOneMinute(car);
  }
}
