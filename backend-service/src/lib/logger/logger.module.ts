import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import * as morgan from 'morgan';
import { ConfigService } from 'src/shared/service/config.service';

import { AbstractLogger, LoggerBaseKey, LoggerKey } from './interfaces/Logger';
import LoggerService from './logger.service';
import NestLoggerServiceAdapter from './nestlogger-service-adapter';
import ConsoleTransport from './winston/transports/console-transport';
import FileTransport from './winston/transports/file-transport';
import WinstonLogger, {
  WinstonLoggerTransportsKey,
} from './winston/winston-logger';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: NestLoggerServiceAdapter,
      useFactory: (logger: AbstractLogger) =>
        new NestLoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: () => {
        const transport: any = [];
        transport.push(ConsoleTransport.createColorize());
        transport.push(FileTransport.create());

        return transport;
      },
    },
  ],
  exports: [LoggerKey, NestLoggerServiceAdapter],
})
export class LoggerModule implements NestModule {
  constructor(
    @Inject(LoggerKey) private logger: AbstractLogger,
    private configService: ConfigService,
  ) {}
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan(this.configService.isProduction ? 'combined' : 'dev', {
          stream: {
            write: (message: string) => {
              this.logger.debug(message, {
                sourceClass: 'RequestLogger',
              });
            },
          },
        }),
      )
      .forRoutes('*');
  }
}
