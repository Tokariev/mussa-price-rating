import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { CarWithoutRating } from './car-without-rating';
import { CarWithoutCity } from './car-without-city';
import { CarIsNotAvailableNow } from './car-is-not-available-now';
import { CarHasRating } from './car-has-rating-already';
import { CarIsAvailable } from './car-is-available';
import { NullCar } from './null-car-object';
import { CarType } from './interfaces/car.type';

@Injectable()
export class RatingFactoryService {
  constructor(
    @Inject(CarWithoutRating)
    private readonly carWithoutRating: CarWithoutRating,
    @Inject(CarWithoutCity)
    private readonly carWithoutCity: CarWithoutCity,
    @Inject(CarIsNotAvailableNow)
    private readonly carIsNotAvailableNow: CarIsNotAvailableNow,
    @Inject(CarHasRating)
    private readonly carHasRating: CarHasRating,
    @Inject(CarIsAvailable)
    private readonly carIsAvailable: CarIsAvailable,
    @Inject(NullCar)
    private readonly nullCar: NullCar,
  ) {}

  async create(car: CarType): Promise<ICar> {
    const substrings = ['mobile.de', 'autoscout24'];

    if (!car) {
      return this.nullCar;
    }

    if (!car.source) {
      throw new Error('Car has no source');
    }

    if (this.carHasNoCity(car)) {
      console.log('Car has no city 🏣, process later');
      return this.carWithoutCity;
    }

    if (this.isRatingExists(car)) {
      return this.carHasRating;
    }

    if (!substrings.some((substr) => car.source.includes(substr))) {
      return this.carWithoutRating;
    }

    const isCarOnline = await this.isCarOnline(car);

    if (car.url.includes('hs-preview.cardeluxe.net') && isCarOnline) {
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
      console.log('V - online');
      return true;
    } catch (error) {
      console.log('X - offline');
      return false;
    }
  }

  isRatingExists(car: CarType): boolean {
    if (car?.price_rating_object?.rating) {
      return true;
    }

    return false;
  }
}
