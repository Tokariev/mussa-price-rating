import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RatingFactoryService } from 'src/price/rating-factory/rating-factory.service';

const CENTRAL_API_URL = 'http://central-api:3000';

@Injectable()
export class PriceService {
  constructor(private readonly ratingFactoryService: RatingFactoryService) {}

  async processRating(parsedData: any): Promise<string> {
    console.log('2. Process rating');
    const car = this.ratingFactoryService.create(parsedData);
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
      console.log('Error while parsing url');
    }
  }
}
