import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { InactiveCarProducerService } from './inactive-cars-producer.service';
import { InactiveCarsConsumerService } from './inactive-cars-consumer.service';
import { ParserModule } from 'src/parser/parser.module';
import { RatingModule } from 'src/rating/rating.module';
import { CarAccidentModule } from 'src/car-accident/car-accident.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'inactive-cars',
    }),
    ParserModule,
    RatingModule,
    CarAccidentModule,
  ],
  providers: [
    JobsService,
    InactiveCarProducerService,
    InactiveCarsConsumerService,
  ],
  exports: [JobsService, InactiveCarProducerService],
})
export class JobsModule {}
