import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SharedModule } from './shared/shared.module';
import { LoggerModule } from './lib/logger/logger.module';
import { ContextStorageModule } from './lib/context-storage/context-storage.module';
import { AgentModule } from './modules/agent/agent.module';
import { ChainingModule } from './modules/chaining/chaining.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './shared/service/config.service';
import { WebsocketModule } from './lib/websocket/websocket.module';
import { AgentSupervisorModule } from './modules/agent-supervisor/agent-supervisor.module';

import { LanggraphModule } from './modules/langgraph/langgraph.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.databaseConfig,
      inject: [ConfigService],
    }),
    SharedModule,
    LoggerModule,
    ContextStorageModule,
    AgentModule,
    ChainingModule,
    WebsocketModule,
    UserModule,
    AgentSupervisorModule,
    LanggraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
