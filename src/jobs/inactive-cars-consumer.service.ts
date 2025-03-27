import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { ParserService } from '../parser/parser.service';
import { RatingService } from '../rating/rating.service';
import { CarAccidentService } from '../car-accident/car-accident.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { PriceHistoryService } from '../price-history/price-history.service';

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
    // private readonly priceHistoryService: PriceHistoryService,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Process('/parse')
  async parse(job: Job<IInactiveCar>) {
    const { source } = job.data;

    console.log('⏰ Start parsing in as job...', job.id);

    const parsedData = await this.parserService.parseUrl(source);

    this.ratingService.processRating(parsedData);
    this.carAccidentService.processCarAccident(parsedData);
    this.natsClient.emit('read_price_history', parsedData);
  }
}
