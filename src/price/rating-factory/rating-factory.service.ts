import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { CarWithoutRating } from './car-without-rating';
import { Autoscout24 as Autoscout24 } from './autoscout';
import { CarIsNotAvailableNow } from './car-is-not-available-now';
import { CarWithRating as CarWithRating } from './car-with-rating';
import { CarIsAvailable } from './car-is-available';
import { NullCar } from './null-car-object';
import { CarType } from './interfaces/car.type';

@Injectable()
export class RatingFactoryService {
  constructor(
    @Inject(CarWithoutRating)
    private readonly carWithoutRating: CarWithoutRating,
    @Inject(Autoscout24)
    private readonly autoscout: Autoscout24,
    @Inject(CarIsNotAvailableNow)
    private readonly carIsNotAvailableNow: CarIsNotAvailableNow,
    @Inject(CarWithRating)
    private readonly carWithRating: CarWithRating,
    @Inject(CarIsAvailable)
    private readonly carIsAvailable: CarIsAvailable,
    @Inject(NullCar)
    private readonly nullCar: NullCar,
  ) {}

  async create(car: CarType): Promise<ICar> {
    const siteWitRatings = ['mobile.de', 'autoscout24'];

    if (!car) {
      return this.nullCar;
    }

    if (!car.source) {
      throw new Error('Car has no source');
    }

    // kleinanzeigen.de
    if (car.source.includes('kleinanzeigen')) {
      return this.carWithoutRating;
    }

    if (this.isRatingExists(car)) {
      return this.carWithRating;
    }
    // ###
    // hs-preview.cardeluxe.net indicate that the car is fresh
    // after car was parsed, url get the same value as source
    // ###
    if (
      car.url.includes('hs-preview.cardeluxe.net') &&
      car.source.includes('autoscout24.de')
    ) {
      return this.autoscout;
    }

    if (this.carHasNoCity(car)) {
      return this.autoscout;
    }

    const isCarOnline = await this.isCarOnline(car);

    if (isCarOnline) {
      return this.carIsAvailable;
    }

    if (car.url.includes('hs-preview.cardeluxe.net') && !isCarOnline) {
      return this.carIsNotAvailableNow;
    }

    return this.carWithoutRating;
  }

  carHasNoCity(car: CarType) {
    if (!car.city && car.source.includes('autoscout24.de')) {
      return true;
    }

    return false;
  }

  async isCarOnline(car: CarType): Promise<boolean> {
    console.log('Is car online?', car.source);

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

  isRatingExists(car: CarType): boolean {
    if (car?.price_rating?.rating) {
      return true;
    }

    return false;
  }
}
