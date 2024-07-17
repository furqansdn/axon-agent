// src/websocket/websocket-emit.service.ts

import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketEmitService {
  constructor(private websocketGateway: WebsocketGateway) {}

  emitToAll(event: string, data: any) {
    this.websocketGateway.server.emit(event, data);
  }

  emitToRoom(room: string, event: string, data: any) {
    this.websocketGateway.server.to(room).emit(event, data);
  }

  emitToClient(clientId: string, event: string, data: any) {
    this.websocketGateway.server.to(clientId).emit(event, data);
  }
}
