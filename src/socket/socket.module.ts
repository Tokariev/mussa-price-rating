import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { PriceModule } from 'src/price/price.module';

@Module({
  imports: [PriceModule],
  controllers: [],
  providers: [SocketClientService],
})
export class SocketModule {}
