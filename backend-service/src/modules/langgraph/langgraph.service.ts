/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import {
  END,
  START,
  MemorySaver,
  StateGraph,
  StateGraphArgs,
} from '@langchain/langgraph';

import { RunnableConfig } from '@langchain/core/runnables';
import { BaseMessage, AIMessage, HumanMessage } from '@langchain/core/messages';
import * as uuid from 'uuid';

import { DynamicStructuredTool } from '@langchain/core/tools';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';

import { z } from 'zod';
import { workflow } from 'src/lib/graph';

interface IState {
  input: string;

  results?: string;
}

@Injectable()
export class LanggraphService {
  async nodeExample(query: string) {
    const graphState: StateGraphArgs<IState>['channels'] = {
      input: {
        reducer: (x?: string, y?: string) => y ?? x ?? '',
        default: () => '',
      },
      results: {
        reducer: (x?: string, y?: string) => y ?? x ?? '',
        default: () => '',
      },
    };

    const myNode = (state: IState, config: RunnableConfig) => {
      console.log('In node: ', config?.configurable?.user_id);

      return { results: `Hello, ${state.input}!` };
    };

    const myOtherNode = (state: IState) => {
      console.log('In other node', state);
      return state;
    };

    const builder = new StateGraph({ channels: graphState })
      .addNode('my_node', myNode)
      .addNode('my_other_node', myOtherNode)
      .addEdge(START, 'my_node')
      .addEdge('my_node', 'my_other_node')
      .addEdge('my_other_node', END);

    const graph = builder.compile();

    const result = await graph.invoke(
      { input: query },
      { configurable: { user_id: 'abcd-123' } },
    );

    return result;
  }

  async stateManagement(query: number) {
    interface StateB {
      myField: number;
    }

    function add(existing: number, updated?: number) {
      console.log('existing:', existing, 'updated:', updated);
      return existing + (updated ?? 0);
    }

    const builder = new StateGraph<StateB>({
      channels: {
        myField: {
          // "Override" is the default behavior:
          value: add,
          default: () => 0,
        },
      },
    })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .addNode('my_node', (_state) => ({ myField: 2 }))
      .addEdge(START, 'my_node')
      .addEdge('my_node', END);

    const graph = builder.compile();

    return await graph.invoke({ myField: query });
  }

  async rootReducer(query: string) {
    const builder = new StateGraph({
      channels: {
        __root__: {
          reducer: (x: string[], y: string[]) => x.concat(y ?? []),
          default: () => [],
        },
      },
    })
      .addNode('my_node', (_state, config) => {
        return [`Adding message to state: ${_state}`];
      })
      .addEdge(START, 'my_node')
      .addEdge('my_node', END);

    const graph = builder.compile();

    return await graph.invoke([query]);
  }

  async configuration() {
    interface State {
      total: number;

      turn?: string;
    }

    function addF(existing: number, updated?: number) {
      return existing + (updated ?? 0);
    }
    const builder = new StateGraph<State>({
      channels: {
        total: {
          value: addF,
          default: () => 0,
        },
        turn: {
          reducer: (x?: string, y?: string) => {
            console.log('Turn y:', y);
            console.log('Turn x:', x);
            return y ?? x ?? '';
          },
          default: () => '',
        },
      },
    })
      .addNode('add_one', (_state) => ({ total: 1 }))
      .addEdge(START, 'add_one')
      .addEdge('add_one', END);

    const memory = new MemorySaver();

    const graphG = builder.compile({ checkpointer: memory });

    const threadId = 'some-thread';

    const config = { configurable: { thread_id: threadId } };

    const result = await graphG.invoke(
      { total: 1, turn: 'First Turn' },
      config,
    );

    const result2 = await graphG.invoke({ turn: 'Next Turn' }, config);

    const result3 = await graphG.invoke({ total: 5 }, config);

    console.log(result);
    console.log(result2);
    console.log(result3);

    const result4 = await graphG.invoke(
      { total: 5 },
      { configurable: { thread_id: 'some-other-thread' } },
    );

    console.log(result4);
  }

  async subGraph() {
    const reduceList = (
      left?: string[] | string,
      right?: string[] | string,
    ) => {
      if (!left) {
        left = [];
      } else if (typeof left === 'string') {
        left = [left];
      }

      if (!right) {
        right = [];
      } else if (typeof right === 'string') {
        right = [right];
      }

      return [...left, ...right];
    };

    interface IState {
      name: string;
      path: string[];
    }

    const graphState: StateGraphArgs<IState>['channels'] = {
      name: {
        // Overwrite name if a new one is provided
        value: (x: string, y?: string) => (y ? y : x),
        default: () => 'default',
      },
      path: {
        // Concatenate paths
        value: reduceList,
        default: () => [],
      },
    };

    const childrenBuilder = new StateGraph<IState>({
      channels: graphState,
    })
      .addNode('child_start', (_state) => ({ path: ['child_start'] }))
      .addEdge(START, 'child_start')
      .addNode('child_middle', (_state) => ({ path: ['child_middle'] }))
      .addEdge('child_start', 'child_middle')
      .addNode('child_end', (_state) => ({ path: ['child_end'] }))
      .addEdge('child_middle', 'child_end')
      .addEdge('child_end', END);

    const builder = new StateGraph<IState>({
      channels: graphState,
    });

    builder
      .addNode('grandparent', (_state) => ({ path: ['grandparent'] }))
      .addEdge(START, 'grandparent')
      .addNode('parent', (_state) => ({ path: ['parent'] }))
      .addEdge('grandparent', 'parent')
      .addNode('child', childrenBuilder.compile())
      .addEdge('parent', 'child')
      .addNode('sibling', (_state) => ({ path: ['sibling'] }))
      .addEdge('parent', 'sibling')
      .addNode('fin', (_state) => ({ path: ['fin'] }))
      .addEdge('sibling', 'fin')
      .addEdge('child', 'fin')
      .addEdge('fin', END);

    return {
      primary: await builder.compile().invoke({ name: 'parent' }),
    };
  }

  async subGraphWithID() {
    type ValWithId = { id?: string; val: string };
    const reduceListWithID = (
      left?: ValWithId[] | ValWithId,
      right?: ValWithId[] | ValWithId,
    ) => {
      if (!left) {
        left = [];
      } else if (!Array.isArray(left)) {
        left = [left];
      }

      if (!right) {
        right = [];
      } else if (!Array.isArray(right)) {
        right = [right];
      }

      const [_left, _right] = [left, right].map((orig) =>
        orig.map((x) => {
          if (!x.id) {
            x.id = uuid.v4();
          }
          return x;
        }),
      );

      const leftIdxById = _left.reduce(
        (acc, val, i) => ({ ...acc, [val.id as string]: i }),
        {} as Record<string, number>,
      );
      const merged = [..._left];
      for (const val of _right) {
        const existingIdx = leftIdxById[val.id as string];
        if (existingIdx !== undefined) {
          merged[existingIdx] = val;
        } else {
          merged.push(val);
        }
      }
      return merged;
    };

    interface IStateWithID {
      name: string;
      path: ValWithId[];
    }

    const graphState: StateGraphArgs<IStateWithID>['channels'] = {
      name: {
        // Overwrite name if a new one is provided
        value: (x: string, y?: string) => (y ? y : x),
        default: () => 'default',
      },
      path: {
        // Concatenate paths
        value: reduceListWithID,
        default: () => [],
      },
    };

    const childrenBuilder = new StateGraph<IStateWithID>({
      channels: graphState,
    })
      .addNode('child_start', (_state) => ({ path: [{ val: 'child_start' }] }))
      .addEdge(START, 'child_start')
      .addNode('child_middle', (_state) => ({
        path: [{ val: 'child_middle' }],
      }))
      .addEdge('child_start', 'child_middle')
      .addNode('child_end', (_state) => ({ path: [{ val: 'child_end' }] }))
      .addEdge('child_middle', 'child_end')
      .addEdge('child_end', END);

    const builder = new StateGraph<IStateWithID>({
      channels: graphState,
    });

    builder
      .addNode('grandparent', (_state) => ({ path: [{ val: 'grandparent' }] }))
      .addEdge(START, 'grandparent')
      .addNode('parent', (_state) => ({ path: [{ val: 'parent' }] }))
      .addEdge('grandparent', 'parent')
      .addNode('child', childrenBuilder.compile())
      .addEdge('parent', 'child')
      .addNode('sibling', (_state) => ({ path: [{ val: 'sibling' }] }))
      .addEdge('parent', 'sibling')
      .addNode('fin', (_state) => ({ path: [{ val: 'fin' }] }))
      .addEdge('sibling', 'fin')
      .addEdge('child', 'fin')
      .addEdge('fin', END);

    return {
      primary: await builder.compile().invoke({ name: 'parent' }),
    };
  }

  async persistentGraph() {
    interface IState {
      messages: BaseMessage[];
    }

    // This defines the agent state
    const graphState: StateGraphArgs<IState>['channels'] = {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
    };

    const searchTool = new DynamicStructuredTool({
      name: 'search',
      description:
        'Use to surf the web, fetch current information, check the weather, and retrieve other information.',
      schema: z.object({
        query: z.string().describe('The query to use in your search.'),
      }),
      func: async ({}: { query: string }) => {
        // This is a placeholder for the actual implementation
        return 'Cold, with a low of 13 ℃';
      },
    });

    const tools = [searchTool];
    const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
    const model = new ChatOpenAI();

    const boundModel = model.bindTools(tools);

    const routeMessage = (state: IState, config: RunnableConfig) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1] as AIMessage;

      console.log(messages);
      if (!lastMessage.tool_calls?.length) {
        return END;
      }

      return 'tools';
    };

    const callModel = async (state: IState, config: RunnableConfig) => {
      const { messages } = state;

      const response = await boundModel.invoke(messages, config);
      // console.log('response', response);
      return { messages: [response] };
    };

    const workflow = new StateGraph<IState>({
      channels: graphState,
    })
      .addNode('agent', callModel)
      .addNode('tools', toolNode)
      .addEdge(START, 'agent')
      .addConditionalEdges('agent', routeMessage)
      .addEdge('tools', 'agent');

    const graph = workflow.compile();

    return await graph.invoke({
      messages: [new HumanMessage('What is the weather today?')],
    });
  }

  async agentSupervisor(query: string) {
    // const graph = (await workflow()).compile();
    // return await graph.invoke({ input: query });
  }
}
