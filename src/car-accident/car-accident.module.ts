import { Module } from '@nestjs/common';
import { CarAccidentService } from './car-accident.service';
import { ParserModule } from '../parser/parser.module';
import { PublicationModule } from 'src/publication/publication.module';

@Module({
  imports: [ParserModule, PublicationModule],
  providers: [CarAccidentService],
  exports: [CarAccidentService],
})
export class CarAccidentModule {}
