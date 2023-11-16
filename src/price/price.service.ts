import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { RatingFactoryService } from '../price/rating-factory/rating-factory.service';
import { CarType } from './rating-factory/interfaces/car.type';

const LOGGER = 'http://logger:3005';
@Injectable()
export class PriceService {
  constructor(private readonly ratingFactoryService: RatingFactoryService) {}

  async processRating(parsedData: CarType): Promise<string> {
    const car = await this.ratingFactoryService.create(parsedData);
    console.log(`Get instanceof ${car.constructor.name} from 🏭`);
    car.process(parsedData);

    return 'Rating will be processed';
  }

  async findCarByDocumentId(documentId: string): Promise<any> {
    try {
      const resp = await axios.get(`${LOGGER}/car/${documentId}`);

      return resp.data;
    } catch (error) {
      console.log('Error while getting car from central-api');
    }
  }

  async parseUrl(url: string): Promise<CarType> {
    try {
      const response = await axios.post(
        'http://central-api:3000/api/parser/parse-not-emit',
        {
          url: url,
        },
      );

      console.log(`...Ratin service get parsed data ✅`);

      return response.data;
    } catch (error) {
      console.log(`.Error to parse: ${url}`);

      if (error.traceback) {
        console.log(error.traceback);
      }
    }
  }

  async parseAndEmit(url: string) {
    try {
      axios.post('http://central-api:3000/api/parser', {
        url: url,
      });
    } catch (error) {
      // Do nothing
    }
  }
}
