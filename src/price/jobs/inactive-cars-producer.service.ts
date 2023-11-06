import { InjectQueue, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CarType } from '../rating-factory/interfaces/car.type';
@Injectable()
export class InactiveCarProducerService {
  constructor(
    @InjectQueue('inactive-cars')
    private readonly inactiveCarsQueue: Queue,
  ) {}

  async processCarInOneMinute(car: CarType) {
    const fiftySeconds = 50000;

    const job = await this.inactiveCarsQueue.add(
      '/parse-not-emit',
      {
        source: car.source,
      },
      { delay: fiftySeconds, removeOnComplete: true }, // 3 seconds delayed
    );

    console.log(`Job created with id: ${job.id}`);
  }

  async processCarIn20Seconds(car: CarType) {
    const twentySeconds = 20000;

    const job = await this.inactiveCarsQueue.add(
      '/parse-not-emit',
      {
        source: car.source,
      },
      { delay: twentySeconds, removeOnComplete: true },
    );
  }
}
