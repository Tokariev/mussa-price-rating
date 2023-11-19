import { Injectable } from '@nestjs/common';
import { CarType } from '../rating/types/car.type';
import { PublicationService } from 'src/publication/publication.service';
import { ParserService } from '../parser/parser.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from 'src/events/event';
import { EVENTS } from 'src/events/events.constants';

@Injectable()
export class CarAccidentService {
  constructor(
    private readonly publicationService: PublicationService,
    private readonly parcerService: ParserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Wenn bei Mobile Auto nicht Neu (online), muss es bitte wegen "Unfall" bei Mobile kontrollieren,
  // nicht bei Cardeluxe Vorschau

  async processCarAccident(car: CarType) {
    if (!this.isDataFromCarDeluxe(car)) {
      return;
    }

    if (!this.isSourceMobileDe(car)) {
      return;
    }

    if (this.publicationService.isPublicationOnline(car)) {
      return;
    }

    // Parse by source and check if car has accident
    const parsedCar = await this.parcerService.parseUrl(car.source);

    if (!parsedCar.has_car_accident) {
      return;
    }

    const accident = {
      id: parsedCar.id,
      has_car_accident: true,
    };

    this.eventEmitter.emit(
      'fragment',
      new EventPayload(EVENTS.FRAGMENT.CAR_ACCIDENT, accident),
    );
  }
  isSourceMobileDe(car: CarType) {
    return car.source.includes('mobile.de');
  }
  isDataFromCarDeluxe(car: CarType): boolean {
    return car.url.includes('hs-preview.cardeluxe.net');
  }
}
