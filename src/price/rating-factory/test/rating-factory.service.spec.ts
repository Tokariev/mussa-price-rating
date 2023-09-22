import { Test, TestingModule } from '@nestjs/testing';
import { RatingFactoryService } from '../rating-factory.service';
import { InactiveCarsConsumer } from '../../jobs/inactive-cars-consumer.service';
import { InactiveCarProducerService } from '../../jobs/inactive-cars-producer.service';
import { VeryGoodPriceCarsConsumer } from '../../jobs/very-good-price-car-consumer.service';
import { VeryGoodPriceCarProducerService } from '../../jobs/very-good-price-car-producer.service';
import { PriceService } from '../../price.service';
import { CarWithoutRating } from '../car-without-rating';
import { CarHasRating } from '../car-has-rating-already';
import { CarIsAvailable } from '../car-is-available';
import { CarIsNotAvailableNow } from '../car-is-not-available-now';
import { NullCar } from '../null-car-object';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import axios from 'axios';
import { CarType } from '../interfaces/car.type';

describe('RatingFactoryService', () => {
  let ratingFactoryService: RatingFactoryService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
        BullModule.forRoot({
          redis: {
            host: 'redis',
            port: 6379,
          },
        }),
        BullModule.registerQueue({
          name: 'inactive-cars',
        }),
        BullModule.registerQueue({
          name: 'very-good-price-cars',
        }),
      ],
      providers: [
        PriceService,
        CarHasRating,
        CarIsAvailable,
        RatingFactoryService,
        CarWithoutRating,
        CarIsNotAvailableNow,

        InactiveCarProducerService,
        InactiveCarsConsumer,
        VeryGoodPriceCarProducerService,
        VeryGoodPriceCarsConsumer,
        NullCar,
      ],
    }).compile();

    ratingFactoryService =
      module.get<RatingFactoryService>(RatingFactoryService);
  });

  describe('create', () => {
    it('should return nullCar when car is falsy', async () => {
      const car = null;
      const result = await ratingFactoryService.create(car);
      expect(result).toBeInstanceOf(NullCar);
    });
  });

  it('should return carWithoutRating when car has no source', async () => {
    const car: CarType = {
      id: '123',
      url: 'https://www.mobile.de/mock-car',
      source: null,
    };
    await expect(ratingFactoryService.create(car)).rejects.toThrowError(
      'Car has no source',
    );
  });

  it('should return carHasRating when car has price rating', async () => {
    const car: CarType = {
      id: '123',
      url: 'https://www.mobile.de/mock-car',
      source: 'https://www.mobile.de/123',
      price_rating_object: {
        rating: 'VERY_GOOD_PRICE',
        rating_reason: 'Very good price',
      },
    };
    const result = await ratingFactoryService.create(car);
    expect(result).toBeInstanceOf(CarHasRating);
  });

  it('should return carWithoutRating when car source does not contain substrings', async () => {
    const car: CarType = {
      id: '123',
      url: 'https://www.mobile.de/mock-car',
      source: 'kleinanzeigen.ebay.de/123',
    };
    const result = await ratingFactoryService.create(car);
    expect(result).toBeInstanceOf(CarWithoutRating);
  });

  it('should return carIsAvailable when car URL contains "hs-preview.cardeluxe.net" and is online', async () => {
    const car: CarType = {
      id: '123',
      url: 'https://hs-preview.cardeluxe.net/car',
      source: 'https://www.mobile.de/123',
    };
    // Mock axios.get to return a successful response
    axios.get = jest.fn().mockResolvedValue({ status: 200 });
    const result = await ratingFactoryService.create(car);
    expect(result).toBeInstanceOf(CarIsAvailable);
  });

  it('should return carIsNotAvailableNow when car URL contains "hs-preview.cardeluxe.net" and is offline', async () => {
    const car: CarType = {
      id: '123',
      url: 'https://hs-preview.cardeluxe.net/car',
      source: 'https://www.mobile.de/123',
    };
    // Mock axios.get to return a failed response
    axios.get = jest.fn().mockRejectedValue({ response: { status: 404 } });
    const result = await ratingFactoryService.create(car);
    expect(result).toBeInstanceOf(CarIsNotAvailableNow);
  });

  describe('isCarOnline', () => {
    it('should return true when car source is online', async () => {
      // Mock axios.get to return a successful response
      axios.get = jest.fn().mockResolvedValue({ status: 200 });
      const car: CarType = {
        id: '123',
        url: 'https://hs-preview.cardeluxe.net/mock-car',
        source: 'https://example.com',
      };
      const result = await ratingFactoryService.isCarOnline(car);
      expect(result).toBe(true);
    });

    it('should return false when car source is offline', async () => {
      // Mock axios.get to throw an error (simulate offline)
      axios.get = jest.fn().mockRejectedValue({ response: { status: 404 } });
      const car: CarType = {
        id: '123',
        url: 'https://hs-preview.cardeluxe.net/mock-car',
        source: 'https://example.com',
      };
      const result = await ratingFactoryService.isCarOnline(car);
      expect(result).toBe(false);
    });
  });

  describe('isRatingExists', () => {
    it('should return true when car has a price rating', () => {
      const car: CarType = {
        id: '123',
        url: 'https://hs-preview.cardeluxe.net/mock-car',
        source: 'https://www.mobile.de/mock-car',
        price_rating_object: {
          rating: 'VERY_GOOD_PRICE',
          rating_reason: 'Very good price',
        },
      };
      const result = ratingFactoryService.isRatingExists(car);
      expect(result).toBe(true);
    });

    it('should return false when car has no price rating', () => {
      const car: CarType = {
        id: '123',
        url: 'https://hs-preview.cardeluxe.net/mock-car',
        source: 'https://www.mobile.de/mock-car',
        price_rating_object: null,
      };
      const result = ratingFactoryService.isRatingExists(car);
      expect(result).toBe(false);
    });
  });

  afterAll(async () => {
    // Close the Bull queues to release associated resources
    await module.close();
  });
});
