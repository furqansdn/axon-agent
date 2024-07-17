// src/websocket/websocket.module.ts

import { Global, Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketEmitService } from './websocket-emit.service';

@Global()
@Module({
  providers: [WebsocketGateway, WebsocketEmitService],
  exports: [WebsocketEmitService],
})
export class WebsocketModule {}
