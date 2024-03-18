import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketModule } from './socket/socket.module';
import { RatingModule } from './rating/rating.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { PublicationModule } from './publication/publication.module';
import { CarAccidentModule } from './car-accident/car-accident.module';
import { ParserModule } from './parser/parser.module';
import { CarManagerModule } from './car-manager/car-manager.module';
import { JobsModule } from './jobs/jobs.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),

    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    SocketModule,
    RatingModule,
    PublicationModule,
    CarAccidentModule,
    ParserModule,
    CarManagerModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
