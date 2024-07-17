import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';

import ContextStorageService from './context-storage.service';
import { ContextStorageServiceKey } from './interfaces/context-storage.interface';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['x-correlation-id'] ?? v4(),
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: ContextStorageServiceKey,
      useClass: ContextStorageService,
    },
  ],
  exports: [ContextStorageServiceKey],
})
export class ContextStorageModule {}
