import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { PriceService } from 'src/price/price.service';

interface IInactiveCar {
  id: string;
  source: string;
}

@Processor('inactive-cars')
export class InactiveCarsConsumer {
  constructor(private readonly priceService: PriceService) {}

  @Process('parse')
  async parse(job: Job<IInactiveCar>) {
    const { source } = job.data;

    const parsedData = await this.priceService.parseUrl(source);
    this.priceService.processRating(parsedData);
  }
}
