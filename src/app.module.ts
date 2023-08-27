import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketModule } from './socket/socket.module';
import { PriceModule } from './price/price.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot(), SocketModule, PriceModule],
  controllers: [AppController],
})
export class AppModule {}
