import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { RatingFactoryService } from '../price/rating-factory/rating-factory.service';
import { CarType } from './rating-factory/interfaces/car.type';

const CENTRAL_API_URL = 'http://central-api:3000';

@Injectable()
export class PriceService {
  constructor(private readonly ratingFactoryService: RatingFactoryService) {}

  async processRating(parsedData: CarType): Promise<string> {
    const car = await this.ratingFactoryService.create(parsedData);
    console.log('Get instanceof from 🏭');
    car.process(parsedData);

    return 'Rating will be processed';
  }

  async findCarById(documentId: string): Promise<any> {
    try {
      const resp = await axios.get(
        `${CENTRAL_API_URL}/api/cars/very-good-price/${documentId}`,
      );

      return resp.data;
    } catch (error) {
      console.log('Error while getting car from central-api');
    }
  }

  async parseUrl(url: string): Promise<any> {
    try {
      const response = await axios.post(
        'http://central-api:3000/api/parser/parse-not-emit',
        {
          url: url,
        },
      );

      console.log(`...Parsed ✅`);

      return response.data;
    } catch (error) {
      console.log(`.Error to parse: ${url}`);

      if (error.traceback) {
        console.log(error.traceback);
      }
    }
  }
}
