import { BaseMessage } from '@langchain/core/messages';
import { END, StateGraphArgs } from '@langchain/langgraph';
import { JsonOutputToolsParser } from 'langchain/output_parsers';
import { ChatOpenAI } from '@langchain/openai';

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

export interface AgentStateChannels {
  messages: BaseMessage[];
  // The agent node that last performed work
  next: string;
}

export const members = ['chart_generator', 'researcher'];
// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
export const agentStateChannels: StateGraphArgs<AgentStateChannels>['channels'] =
  {
    messages: {
      value: (x?: BaseMessage[], y?: BaseMessage[]) =>
        (x ?? []).concat(y ?? []),
      default: () => [],
    },
    next: {
      value: (x?: string, y?: string) => y ?? x ?? END,
      default: () => END,
    },
  };

export const createAgentSupervisor = async () => {
  const systemPrompt =
    'You are a supervisor tasked with managing a conversation between the' +
    ' following workers: {members}. Given the following user request,' +
    ' respond with the worker to act next. Each worker will perform a' +
    ' task and respond with their results and status. When finished,' +
    ' respond with FINISH.';

  const options = [END, ...members];

  console.log('options', options);

  const functionDef = {
    name: 'route',
    description: 'Select the next role.',
    parameters: {
      title: 'routeSchema',
      type: 'object',
      properties: {
        next: {
          title: 'Next',
          anyOf: [{ enum: options }],
        },
      },
      required: ['next'],
    },
  };

  const toolDef = {
    type: 'function',
    function: functionDef,
  } as const;

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    new MessagesPlaceholder('messages'),
    [
      'system',
      'Given the conversation above, who should act next?' +
        ' Or should we FINISH? Select one of: {options}',
    ],
  ]);

  const formattedPrompt = await prompt.partial({
    options: options.join(', '),
    members: members.join(', '),
  });

  const llm = new ChatOpenAI();

  const supervisorChain = formattedPrompt
    .pipe(
      llm.bindTools([toolDef], {
        tool_choice: { type: 'function', function: { name: 'route' } },
      }),
    )
    .pipe(new JsonOutputToolsParser())
    .pipe((x) => x[0].args);

  return supervisorChain;
};
