import { Module } from '@nestjs/common';
import { CarManagerService } from './car-manager.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { RatingModule } from 'src/rating/rating.module';
import { CarAccidentModule } from 'src/car-accident/car-accident.module';
import { ParserModule } from 'src/parser/parser.module';

@Module({
  imports: [JobsModule, RatingModule, CarAccidentModule, ParserModule],
  providers: [CarManagerService],
  exports: [CarManagerService],
})
export class CarManagerModule {}
