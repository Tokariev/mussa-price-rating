import { InjectQueue, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class InactiveCarProducerService {
  constructor(
    @InjectQueue('inactive-cars')
    private readonly inactiveCarsQueue: Queue,
  ) {}

  async processCarInOneMinute(car: any) {
    console.log('Produce job to check car in one minute');

    const fiftySeconds = 50000;

    const job = await this.inactiveCarsQueue.add(
      'parse',
      {
        source: car.source,
      },
      { delay: fiftySeconds, removeOnComplete: true }, // 3 seconds delayed
    );

    console.log(`Job created with id: ${job.id}`);

    return `Job created with id: ${job.id}`;
  }
}
