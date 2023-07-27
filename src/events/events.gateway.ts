import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  users: Map<number, string[]> = new Map();

  async handleConnection(client: Socket) {
    const token = this.extractTokenFromHeaders(client.request);
    if (!token) return client.disconnect();
    try {
      const payload = await this.jwtService.verify(token);
      const userId = payload.id;
      if (this.users.get(userId)) {
        this.users.get(userId).push(client.id);
      } else {
        this.users.set(userId, [client.id]);
      }
    } catch {
      return client.disconnect();
    }
    client.emit('message', 'authorized');
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((sockets, userId) => {
      const idx = sockets.indexOf(client.id);
      if (idx !== -1) {
        sockets.splice(idx, 1);
        if (sockets.length === 0) {
          this.users.delete(userId);
        }
      }
    });
  }

  sendNotificationToUser(userId: number, message: string) {
    const sockets = this.users.get(userId);
    if (!sockets) return false;
    sockets.forEach((socket) =>
      this.server.to(socket).emit('notification', { message }),
    );
    return true;
  }

  sendNotificationToAll(message: string) {
    return this.server.emit('notification', { message });
  }

  private extractTokenFromHeaders(req: IncomingMessage): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
