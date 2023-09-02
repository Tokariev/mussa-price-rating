import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { RatingFactoryService } from 'src/price/rating-factory/rating-factory.service';

const CENTRAL_API_URL = 'http://central-api:3000';

@Injectable()
export class PriceService {
  constructor(private readonly ratingFactoryService: RatingFactoryService) {}

  async processRating(parsedData: any): Promise<string> {
    const car = await this.ratingFactoryService.create(parsedData);
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
      const response = await axios.post('http://parser-api:5000/parse', {
        url: url,
      });
      return response.data;
    } catch (error) {
      console.log(`Error while parsing url with parser-api: ${url}`);
    }
  }
}
