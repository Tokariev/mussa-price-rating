import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, JobInformation, Queue } from 'bull';
import { PriceService } from '../../price/price.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import { CarType } from '../rating-factory/interfaces/car.type';
import axios from 'axios';
import { EVENTS } from '../events/events.constants';
import { EventPayload } from '../events/event';

interface IVeryGoodPriceCar {
  documentId: string;
}

type NewPrice = {
  documentId: string;
  newPrice: number;
};

@Processor('very-good-price-cars')
export class VeryGoodPriceCarsConsumer {
  constructor(
    private readonly priceService: PriceService,
    @InjectQueue('very-good-price-cars')
    private readonly queue: Queue,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process('check-price-was-changed')
  async checkPriceWasChanged(job: Job<IVeryGoodPriceCar>) {
    console.log(`...VeryGoodPriceCarsConsumer check price after 1 hour`);

    let isOnline = true;
    let parsedData: CarType = null;

    const { documentId } = job.data;

    const jobs = await this.queue.getRepeatableJobs();
    const foundJob = jobs.find((job) => job.id === documentId);

    const car = await this.priceService.findCarByDocumentId(documentId);
    if (!car) {
      await this.removeJobFromQueue(foundJob);
      return;
    }

    const url = car?.source;

    try {
      parsedData = await this.priceService.parseUrl(url);
    } catch (error) {
      isOnline = false;
    }

    if (!isOnline) {
      // Delete car from mongo db
      await this.removeJobFromQueue(foundJob);
      return;
    }

    if (parsedData.price_rating.rating !== 'VERY_GOOD_PRICE') {
      // Emit : price rating was changed )))
      await this.removeJobFromQueue(foundJob);
      return;
    }

    const previousPrice = car.price;
    const currentPrice = parsedData.price;

    if (previousPrice !== currentPrice) {
      this.eventEmitter.emit(
        'carWithVeryGoodPrice',
        new EventPayload(EVENTS.CAR_WITH_VERY_GOOD_PRICE.UPDATED, car),
      );

      const newPrice: NewPrice = {
        documentId,
        newPrice: currentPrice,
      };

      await this.updatePrice(newPrice);
    }
  }
  async removeJobFromQueue(foundJob: JobInformation) {
    if (!foundJob) {
      return;
    }
    await this.queue.removeRepeatableByKey(foundJob.key);

    console.log(`Repeated job with ID ${foundJob.key} removed.`);
  }

  async updatePrice(newPrice: NewPrice) {
    // try {
    //   axios.post('http://logger:3005/car/update-price', {
    //     ...newPrice,
    //   });
    // } catch (error) {
    //   console.log(`Error while updating price`);
    // }
  }
}
