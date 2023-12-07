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
    origin: ['https://www.questmind.ai', 'https://questmind.ai', "http://localhost:3000"],
    credentials: true,
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WsGateway');

  notifyClient(dialogueId: string, updatedData: any) {
    this.logger.log(
      `Emitting to client - Dialogue ID: ${dialogueId}, Data: ${JSON.stringify(updatedData)}`,
    );
    this.server.emit('dialogueUpdated', { dialogueId, updatedData });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Additional logging for debugging
    client.on('error', (error) => {
      this.logger.error(`Error on client ${client.id}: ${error}`);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Log the disconnect reason if available
    client.on('disconnect', (reason) => {
      this.logger.log(`Client ${client.id} disconnected: ${reason}`);
    });
  }
}
