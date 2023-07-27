import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  controllers: [],
  exports: [EventsGateway],
})
export class EventsModule {}
