"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexAI = void 0;
const debug_1 = __importDefault(require("debug"));
const google_vertexai_1 = require("@langchain/google-vertexai");
const messages_1 = require("@langchain/core/messages");
const base_model_js_1 = require("../interfaces/base-model.cjs");
class VertexAI extends base_model_js_1.BaseModel {
    constructor({ temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:VertexAI')
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new google_vertexai_1.ChatVertexAI({ model: modelName ?? 'gemini-1.0-pro' });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const systemString = system + '\n' + `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`;
        const pastMessages = [new messages_1.SystemMessage(systemString)];
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new messages_1.AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new messages_1.SystemMessage({ content: c.message });
            else
                return new messages_1.HumanMessage({ content: c.message });
        }));
        pastMessages.push(new messages_1.HumanMessage(`${userQuery}?`));
        this.debug('Executing VertexAI model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('VertexAI response -', result);
        return result.content.toString();
    }
}
exports.VertexAI = VertexAI;
