import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { PublicationModule } from 'src/publication/publication.module';
import { CarManagerModule } from 'src/car-manager/car-manager.module';

@Module({
  imports: [PublicationModule, CarManagerModule],
  providers: [SocketClientService],
})
export class SocketModule {}
