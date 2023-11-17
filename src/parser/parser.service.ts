import { Injectable } from '@nestjs/common';
import { CarType } from '../price/rating-factory/interfaces/car.type';
import axios from 'axios';

@Injectable()
export class ParserService {
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
}
