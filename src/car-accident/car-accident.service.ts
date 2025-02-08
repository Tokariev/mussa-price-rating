import { Injectable } from '@nestjs/common';
import { CarType } from '../rating/types/car.type';
import { PublicationService } from 'src/publication/publication.service';
import { ParserService } from '../parser/parser.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from 'src/events/event';
import { EVENTS } from 'src/events/events.constants';

@Injectable()
export class CarAccidentService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async processCarAccident(parsedCar: CarType) {
    const accident = {
      externalCarId: parsedCar.externalCarId,
      has_car_accident: parsedCar.has_car_accident,
    };

    this.eventEmitter.emit(
      'fragment',
      new EventPayload(EVENTS.FRAGMENT.CAR_ACCIDENT, accident),
    );
  }
}
