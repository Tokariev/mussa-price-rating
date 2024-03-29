import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CarAccidentService } from '../car-accident/car-accident.service';
import { InactiveCarProducerService } from '../jobs/inactive-cars-producer.service';
import { CarType } from '../rating/types/car.type';
import { RatingService } from '../rating/rating.service';
import { ParserService } from '../parser/parser.service';

@Injectable()
export class CarManagerService {
  constructor(
    @Inject(InactiveCarProducerService)
    private readonly jobsService: InactiveCarProducerService,
    @Inject(RatingService)
    private readonly ratingService: RatingService,
    @Inject(CarAccidentService)
    private readonly carAccidentService: CarAccidentService,
    @Inject(ParserService)
    private readonly parserService: ParserService,
  ) {}

  //TODO: Split in two methods rating and car accident
  async processCar(car: CarType) {
    if (!car.source) {
      console.log('🚧', car);
      return;
    }

    if (car.source.includes('kleinanzeigen')) {
      return;
    }

    if (car.source.includes('mobile.de')) {
      const isCarOnline = await this.isCarOnline(car);

      if (isCarOnline) {
        this.processCarImmediately(car);
        return;
      }
      //   Parse car and process after 60 seconds
      await this.jobsService.processCarLater(car, 60);
      return;
    }

    if (car.source.includes('autoscout24.de') && this.carHasNoCity(car)) {
      // Process car after 30 seconds
      await this.jobsService.processCarLater(car, 30);
      await this.jobsService.processCarLater(car, 60);
      return;
    }

    if (
      car.source.includes('autoscout24.de') &&
      car.price_history.length === 0 &&
      !this.hasRating(car)
    ) {
      // Process car after 30 seconds
      await this.jobsService.processCarLater(car, 10);
      return;
    }

    this.processCarImmediately(car);
  }

  async isCarOnline(car: CarType): Promise<boolean> {
    if (!car.source.includes('mobile.de')) {
      return true;
    }

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: car.source,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.google.com/',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        TE: 'trailers',
      },
    };

    // If response is 200 then the ad is online, if 404 then the ad is offline
    try {
      await axios(config);
      return true;
    } catch (error) {
      return false;
    }
  }

  carHasNoCity(car: CarType) {
    if (!car.city) {
      return true;
    }

    return false;
  }

  async processCarImmediately(car: CarType) {
    const parsedData = await this.parserService.parseUrl(car.source);
    this.ratingService.processRating(parsedData);
    this.carAccidentService.processCarAccident(parsedData);
  }

  hasRating(car: CarType): boolean {
    if (car.price_rating.rating || car.price_rating.rating_reason) {
      return true;
    }

    return false;
  }
}
