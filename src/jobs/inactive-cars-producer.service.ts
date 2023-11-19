import { InjectQueue, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CarType } from '../rating/types/car.type';
@Injectable()
export class InactiveCarProducerService {
  constructor(
    @InjectQueue('inactive-cars')
    private readonly inactiveCarsQueue: Queue,
  ) {}

  async processCarLater(car: CarType, delayInSeconds: number) {
    const delay = delayInSeconds * 1000;

    const job = await this.inactiveCarsQueue.add(
      '/parse',
      {
        source: car.source,
      },
      { delay: delay, removeOnComplete: true },
    );

    console.log(`Job created with id: ${job.id}`);
  }
}
