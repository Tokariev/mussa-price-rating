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

    const oneMinuteInMilliseconds = 60000;

    const job = await this.inactiveCarsQueue.add(
      'parse',
      {
        id: car.id,
        source: car.source,
      },
      { delay: 5000, removeOnComplete: true }, // 3 seconds delayed
    );

    console.log(`Job created with id: ${job.id}`);

    return `Job created with id: ${job.id}`;
  }
}
