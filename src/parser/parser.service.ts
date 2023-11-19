import { Injectable } from '@nestjs/common';
import { CarType } from '../rating/types/car.type';
import axios from 'axios';

@Injectable()
export class ParserService {
  async parseUrl(url: string): Promise<CarType> {
    try {
      console.debug(`Start to parse: ${url}`);

      const response = await axios.post(
        'http://central-api:3000/api/parser/parse-not-emit',
        {
          url: url,
        },
      );

      console.debug(`.Finish. Rating: ${response.data.price_rating}}`);

      return response.data;
    } catch (error) {
      console.log(`.Error to parse: ${url}`);

      if (error.traceback) {
        console.log(error.traceback);
      }
    }
  }
}
