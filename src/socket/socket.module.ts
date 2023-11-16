import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { PriceModule } from 'src/price/price.module';
import { PublicationModule } from 'src/publication/publication.module';

@Module({
  imports: [PriceModule, PublicationModule],
  controllers: [],
  providers: [SocketClientService],
})
export class SocketModule {}
