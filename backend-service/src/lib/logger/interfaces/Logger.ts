export enum LogLevel {
  Emergency = 'emergency',
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
}

export interface Log {
  timestamp: number;
  level: LogLevel;
  message: string;
  data: LogData;
}

export interface LogData {
  organization?: string; // Organization or project name
  context?: string; // Bounded Context name
  app?: string; // Application or Microservice name
  sourceClass?: string; // Classname of the source
  correlationId?: string; // Correlation ID
  error?: Error; // Error object
  props?: NodeJS.Dict<any>; // Additional custom properties
}

export const LoggerBaseKey = Symbol();
export const LoggerKey = Symbol();

export interface AbstractLogger {
  log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ): void;
  debug(message: string, data?: LogData, profile?: string): void;
  info(message: string, data?: LogData, profile?: string): void;
  warn(message: string | Error, data?: LogData, profile?: string): void;
  error(message: string | Error, data?: LogData, profile?: string): void;
  fatal(message: string | Error, data?: LogData, profile?: string): void;
  emergency(message: string | Error, data?: LogData, profile?: string): void;
  startProfile(id: string): void;
}
