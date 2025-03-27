import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { PublicationModule } from 'src/publication/publication.module';
import { CarManagerModule } from 'src/car-manager/car-manager.module';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [PublicationModule, CarManagerModule, NatsClientModule],
  providers: [SocketClientService],
})
export class SocketModule {}
