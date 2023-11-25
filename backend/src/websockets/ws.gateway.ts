//ws.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['https://www.questmind.ai', 'https://questmind.ai'],
    // origin: 'http://localhost:3000',
    // !!!deployCheck can be removed?
    credentials: true,
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WsGateway');

  notifyClient(dialogueId: string, updatedData: any) {
    this.logger.log(
      `Emitting to client - Dialogue ID: ${dialogueId}, Data: ${JSON.stringify(
        updatedData,
      )}`,
    );
    this.server.emit('dialogueUpdated', { dialogueId, updatedData });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
