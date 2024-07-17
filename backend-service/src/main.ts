import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from './shared/service/config.service';
import NestLoggerServiceAdapter from './lib/logger/nestlogger-service-adapter';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const logger = app.get(NestLoggerServiceAdapter);
  app.useLogger(logger);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const { port, enabledDocumentation } = app.get(ConfigService).appSetting;

  if (enabledDocumentation) {
    setupSwagger(app);
  }
  await app.listen(port);
}
bootstrap();
