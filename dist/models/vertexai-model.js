import createDebugMessages from 'debug';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class VertexAI extends BaseModel {
    constructor({ temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:VertexAI')
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new ChatVertexAI({ model: modelName ?? 'gemini-1.0-pro' });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const systemString = system + '\n' + `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`;
        const pastMessages = [new SystemMessage(systemString)];
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new SystemMessage({ content: c.message });
            else
                return new HumanMessage({ content: c.message });
        }));
        pastMessages.push(new HumanMessage(`${userQuery}?`));
        this.debug('Executing VertexAI model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('VertexAI response -', result);
        return result.content.toString();
    }
}
