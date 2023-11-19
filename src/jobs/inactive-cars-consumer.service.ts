import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { ParserService } from 'src/parser/parser.service';
import { RatingService } from 'src/rating/rating.service';
import { CarAccidentService } from 'src/car-accident/car-accident.service';

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
  ) {}

  @Process('/parse')
  async parse(job: Job<IInactiveCar>) {
    const { source } = job.data;

    console.log('⏰ Start parsing in as job...', job.id);
    console.log('Source:', source);

    const parsedData = await this.parserService.parseUrl(source);

    this.ratingService.processRating(parsedData);
    this.carAccidentService.processCarAccident(parsedData);
  }
}
