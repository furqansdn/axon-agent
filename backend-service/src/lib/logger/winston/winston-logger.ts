import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { AbstractLogger, LogData, LogLevel } from '../interfaces/Logger';

export const WinstonLoggerTransportsKey = Symbol();

@Injectable()
export default class WinstonLogger implements AbstractLogger {
  private logger: winston.Logger;

  constructor(
    @Inject(WinstonLoggerTransportsKey) transports: winston.transport[],
  ) {
    this.logger = winston.createLogger(this.getLoggerFormatOptions(transports));
  }

  private getLoggerFormatOptions(transports: winston.transport[]) {
    const levels: any = {};

    let cont = 0;

    Object.values(LogLevel).forEach((level) => {
      levels[level] = cont;
      cont++;
    });

    return {
      level: LogLevel.Debug,
      levels: levels,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD, HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        winston.format((info, _opts) => {
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }

          info.label = `${info.organization}.${info.context}.${info.app}`;

          return info;
        })(),
        winston.format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
        winston.format.json(),
      ),
      transports: transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    const logData = {
      level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data,
    };

    if (profile) {
      this.logger.profile(profile);
    } else {
      this.logger.log(logData);
    }
  }

  public debug(
    message: string,
    data?: LogData | undefined,
    profile?: string | undefined,
  ): void {
    this.log(LogLevel.Debug, message, data, profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Info, message, data, profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Warn, message, data, profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Error, message, data, profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Fatal, message, data, profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Emergency, message, data, profile);
  }

  public startProfile(id: string) {
    this.logger.profile(id);
  }
}
