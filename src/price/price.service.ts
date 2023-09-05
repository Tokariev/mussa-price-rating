import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { RatingFactoryService } from '../price/rating-factory/rating-factory.service';

const CENTRAL_API_URL = 'http://central-api:3000';

@Injectable()
export class PriceService {
  constructor(private readonly ratingFactoryService: RatingFactoryService) {}

  async processRating(parsedData: any): Promise<string> {
    const car = await this.ratingFactoryService.create(parsedData);

    console.log('Get instanceof from 🏭');

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
        'http://central-api:3000/api/parser/parse-not-emmit',
        {
          url: url,
        },
      );
      console.log(
        `ooo... ${response.data.brand} ${response.data.price_rating}`,
      );
      return response.data;
    } catch (error) {
      console.log(`.Error to parse: ${url}`);

      if (error.traceback) {
        console.log(error.traceback);
      }
    }
  }
}
