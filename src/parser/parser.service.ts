import { Injectable } from '@nestjs/common';
import { CarType } from '../rating/types/car.type';
import axios from 'axios';

@Injectable()
export class ParserService {
  async parseUrl(url: string): Promise<CarType> {
    try {
      console.debug(`Start to parse: ${url}`);

      const response = await axios.post(
        'https://makkizentral.de/api/parser/parse-not-emit',
        {
          url: url,
          action: 'parseRating',
        },
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
