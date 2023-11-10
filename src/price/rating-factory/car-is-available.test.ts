import { EventEmitter2 } from '@nestjs/event-emitter';
import { CarIsAvailable } from './car-is-available';

describe('CarIsAvailable', () => {
  let carIsAvailable: CarIsAvailable;

  beforeEach(() => {
    carIsAvailable = new CarIsAvailable(new EventEmitter2());
  });

  describe('hasDescriptionDamamage', () => {
    it('should return true if ratingReason includes "unfall"', () => {
      const ratingReason = 'The car has been in an Unfall';
      const result = carIsAvailable.hasDescriptionDamamage(ratingReason);
      expect(result).toBe(true);
    });

    it('should return false if ratingReason does not include "unfall"', () => {
      const ratingReason = 'The car is in good condition';
      const result = carIsAvailable.hasDescriptionDamamage(ratingReason);
      expect(result).toBe(false);
    });
  });
});
