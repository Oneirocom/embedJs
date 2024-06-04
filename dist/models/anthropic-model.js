import createDebugMessages from 'debug';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class Anthropic extends BaseModel {
    constructor(params) {
        super(params?.temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:Anthropic')
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = params?.modelName ?? 'claude-3-sonnet-20240229';
    }
    async init() {
        this.model = new ChatAnthropic({ temperature: this.temperature, model: this.modelName });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [
            new SystemMessage(`${system}. Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`),
        ];
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new SystemMessage({ content: c.message });
            else
                return new HumanMessage({ content: c.message });
        }));
        pastMessages.push(new HumanMessage(`${userQuery}?`));
        this.debug('Executing anthropic model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Anthropic response -', result);
        return result.content.toString();
    }
}
