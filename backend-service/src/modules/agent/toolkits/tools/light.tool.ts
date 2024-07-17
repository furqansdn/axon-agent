import { Inject, Injectable } from '@nestjs/common';
import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { WebsocketEmitService } from 'src/lib/websocket/websocket-emit.service';

@Injectable()
export class LightTools extends StructuredTool {
  schema = z.object({
    state: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        'The state of the light you want to control (true for on, false for off)',
      ),
  });

  name = 'LightTools';
  description = 'A tool that allows you to control a light';

  constructor(@Inject() private websocketService: WebsocketEmitService) {
    super();
  }

  async _call(arg: z.infer<typeof this.schema>): Promise<string> {
    this.websocketService.emitToAll('light', arg.state);
    return arg.state ? 'The light is on' : 'The light is off';
  }
}
