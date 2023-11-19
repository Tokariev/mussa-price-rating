import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { RatingModule } from 'src/rating/rating.module';
import { PublicationModule } from 'src/publication/publication.module';
import { CarAccidentModule } from 'src/car-accident/car-accident.module';
import { CarManagerModule } from 'src/car-manager/car-manager.module';

@Module({
  imports: [
    RatingModule,
    PublicationModule,
    CarAccidentModule,
    CarManagerModule,
  ],
  providers: [SocketClientService],
})
export class SocketModule {}
