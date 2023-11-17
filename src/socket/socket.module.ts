import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { PriceModule } from 'src/price/price.module';
import { PublicationModule } from 'src/publication/publication.module';
import { CarAccidentModule } from 'src/car-accident/car-accident.module';

@Module({
  imports: [PriceModule, PublicationModule, CarAccidentModule],
  providers: [SocketClientService],
})
export class SocketModule {}
