"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anthropic = void 0;
const debug_1 = __importDefault(require("debug"));
const anthropic_1 = require("@langchain/anthropic");
const messages_1 = require("@langchain/core/messages");
const base_model_js_1 = require("../interfaces/base-model.cjs");
class Anthropic extends base_model_js_1.BaseModel {
    constructor(params) {
        super(params?.temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:Anthropic')
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
        this.model = new anthropic_1.ChatAnthropic({ temperature: this.temperature, model: this.modelName });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [
            new messages_1.SystemMessage(`${system}. Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`),
        ];
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new messages_1.AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new messages_1.SystemMessage({ content: c.message });
            else
                return new messages_1.HumanMessage({ content: c.message });
        }));
        pastMessages.push(new messages_1.HumanMessage(`${userQuery}?`));
        this.debug('Executing anthropic model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Anthropic response -', result);
        return result.content.toString();
    }
}
exports.Anthropic = Anthropic;
