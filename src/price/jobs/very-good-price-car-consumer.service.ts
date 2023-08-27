import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, JobInformation, Queue } from 'bull';
import { PriceService } from 'src/price/price.service';

interface IVeryGoodPriceCar {
  documentId: string;
}

@Processor('very-good-price-cars')
export class VeryGoodPriceCarsConsumer {
  constructor(
    private readonly priceService: PriceService,
    @InjectQueue('very-good-price-cars')
    private readonly queue: Queue,
  ) {}

  @Process('check-price-was-changed')
  async checkPriceWasChanged(job: Job<IVeryGoodPriceCar>) {
    let isOnline = true;
    let parsedData: any = null;

    const { documentId } = job.data;

    const jobs = await this.queue.getRepeatableJobs();
    const foundJob = jobs.find((job) => job.id === documentId);

    const car = await this.priceService.findCarById(documentId);
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
      // Emit : car is offline )))
      // Delete car from mongo db
      await this.removeJobFromQueue(foundJob);
      return;
    }

    if (parsedData.price_rating !== 'VERY_GOOD_PRICE') {
      // Emit : price rating was changed )))
      await this.removeJobFromQueue(foundJob);
      return;
    }

    const previousPrice = car.price;
    const currentPrice = parsedData.price;

    if (previousPrice !== currentPrice) {
      // Emit : price was changed )))
    }
  }
  async removeJobFromQueue(foundJob: JobInformation) {
    if (!foundJob) {
      return;
    }
    await this.queue.removeRepeatableByKey(foundJob.key);

    console.log(`Repeated job with ID ${foundJob.key} removed.`);
  }
}
