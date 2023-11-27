import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { ParserService } from '../parser/parser.service';
import { RatingService } from '../rating/rating.service';
import { CarAccidentService } from '../car-accident/car-accident.service';
import { PriceHistoryService } from '../price-history/price-history.service';

interface IInactiveCar {
  id: string;
  source: string;
}

@Processor('inactive-cars')
export class InactiveCarsConsumerService {
  constructor(
    private readonly parserService: ParserService,
    private readonly ratingService: RatingService,
    private readonly carAccidentService: CarAccidentService,
    private readonly priceHistoryService: PriceHistoryService,
  ) {}

  @Process('/parse')
  async parse(job: Job<IInactiveCar>) {
    const { source } = job.data;

    console.log('⏰ Start parsing in as job...', job.id);
    console.log('Source:', source);

    const parsedData = await this.parserService.parseUrl(source);

    this.ratingService.processRating(parsedData);
    this.carAccidentService.processCarAccident(parsedData);
    this.priceHistoryService.processPriceHistory(parsedData);
  }
}
