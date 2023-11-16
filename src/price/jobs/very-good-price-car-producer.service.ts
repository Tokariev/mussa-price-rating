import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class VeryGoodPriceCarProducerService {
  constructor(
    @InjectQueue('very-good-price-cars')
    private readonly veryGoodPriceCarsQueue: Queue,
  ) {}

  async chekEvery1HourIsOnline(documentId: string) {
    const oneHour = 1000 * 60 * 60;

    console.log(`...Check every 1 hour is online`);

    const job = this.veryGoodPriceCarsQueue.add(
      'check-price-was-changed',
      {
        documentId: documentId.toString(),
      },
      {
        jobId: documentId.toString(),
        delay: oneHour,
        repeat: {
          every: oneHour,
        },
        removeOnFail: true,
      },
    );
  }
}
