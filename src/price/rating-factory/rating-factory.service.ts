import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ICar } from './interfaces/car.interface';
import { CarWithoutRating } from './car-without-rating';
import { CarIsNotAvailableNow } from './car-is-not-available-now';
import { CarWitVeryGoodPrice } from './car-with-very-good-price';
import { CarHasNotVeryGoodPrice } from './car-has-not-very-good-price';

@Injectable()
export class RatingFactoryService {
  constructor(
    @Inject(CarWithoutRating)
    private readonly carWithoutRating: CarWithoutRating,
    @Inject(CarIsNotAvailableNow)
    private readonly carIsNotAvailableNow: CarIsNotAvailableNow,
    @Inject(CarWitVeryGoodPrice)
    private readonly carWitVeryGoodPrice: CarWitVeryGoodPrice,
    @Inject(CarHasNotVeryGoodPrice)
    private readonly carHasNotVeryGoodPrice: CarHasNotVeryGoodPrice,
  ) {}

  create(car: any): ICar {
    const substrings = ['mobile.de', 'autoscout24'];

    if (!substrings.some((substr) => car.source.includes(substr))) {
      return this.carWithoutRating;
    }

    if (car.url.includes('hs-preview.cardeluxe.net')) {
      return this.carIsNotAvailableNow;
    }

    if (
      substrings.some((substr) => car.source.includes(substr)) &&
      car.price_rating === 'VERY_GOOD_PRICE'
    ) {
      return this.carWitVeryGoodPrice;
    }

    return this.carHasNotVeryGoodPrice;
  }

  async isCarOnline(car: any): Promise<boolean> {
    // Get response status code
    const response = await axios.get(car.source, {
      validateStatus: function (status) {
        return status < 500; // Reject only if the status code is greater than or equal to 500
      },
    });
    const statusCode = response.status;

    // If status code is 404, then the ad is deleted
    if (statusCode === 404) {
      return true;
    }

    return false;
  }
}
