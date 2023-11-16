import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketModule } from './socket/socket.module';
import { PriceModule } from './price/price.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { PublicationModule } from './publication/publication.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    SocketModule,
    PriceModule,
    PublicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
