import { Module } from '@nestjs/common';
import { CarAccidentService } from './car-accident.service';

@Module({
  imports: [],
  providers: [CarAccidentService],
  exports: [CarAccidentService],
})
export class CarAccidentModule {}
