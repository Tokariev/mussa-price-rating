import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { CarWithoutRating } from './car-without-rating';
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

  async isCarOnline(car: CarType): Promise<boolean> {
    console.log('Is car online?', car.source);

    try {
      const response = await axios.get(car.source);
      console.log('V - online:', response.status);
      return true;
    } catch (error) {
      console.log('X - offline:', error.response.status);
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
