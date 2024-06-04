"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ollama = void 0;
const debug_1 = __importDefault(require("debug"));
const ollama_1 = require("@langchain/community/llms/ollama");
const messages_1 = require("@langchain/core/messages");
const base_model_js_1 = require("../interfaces/base-model.cjs");
class Ollama extends base_model_js_1.BaseModel {
    constructor({ baseUrl, temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:Ollama')
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new ollama_1.Ollama({
            model: modelName ?? 'llama2',
            baseUrl: baseUrl ?? 'http://localhost:11434',
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new messages_1.SystemMessage(system)];
        pastMessages.push(new messages_1.SystemMessage(`Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`));
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new messages_1.AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new messages_1.SystemMessage({ content: c.message });
            else
                return new messages_1.HumanMessage({ content: c.message });
        }));
        pastMessages.push(new messages_1.HumanMessage(`${userQuery}?`));
        this.debug(`Executing ollama model ${this.model} with prompt -`, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Ollama response -', result);
        return result.toString();
    }
}
exports.Ollama = Ollama;
