import { Body, Controller, Param, Post } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';

@Controller('notification')
export class NotificationController {
  constructor(private eventsGateway: EventsGateway) {}

  @Post(':id')
  async notifyUserById(
    @Param('id') userId: string,
    @Body('message') message: string,
  ) {
    const sent = this.eventsGateway.sendNotificationToUser(
      Number(userId),
      message,
    );
    return { message, sent };
  }

  @Post()
  async notifyAllUsers(@Body('message') message: string) {
    this.eventsGateway.sendNotificationToAll(message);
    return { message };
  }
}
