import createDebugMessages from 'debug';
export class BaseModel {
    static setDefaultTemperature(temperature) {
        BaseModel.defaultTemperature = temperature;
    }
    constructor(temperature) {
        Object.defineProperty(this, "baseDebug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:BaseModel')
        });
        Object.defineProperty(this, "conversationMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._temperature = temperature;
        this.conversationMap = new Map();
    }
    get temperature() {
        return this._temperature ?? BaseModel.defaultTemperature;
    }
    async init() { }
    /**
     * The query function asynchronously processes user queries mixing references from a vector database
     * and maintains the conversation history.
     * @param {string} system - This is the system prompt passed to the LLM.
     * @param {string} userQuery - The `userQuery` parameter in the `query` method represents the query
     * or question inputted by the user that the system will process and provide a response to.
     * @param {Chunk[]} supportingContext - The `supportingContext` parameter in the `query` method is
     * an array of `Chunk` objects. Each `Chunk` object typically contains information or context
     * relevant to the user query being processed. The `supportingContext` is used to provide
     * additional RAG context to the system when running the query,
     * @param {string} [conversationId=default] - The `conversationId` parameter in the `query` method
     * is a unique identifier for a conversation. It is used to keep track of the conversation history
     * and context for each conversation. If a conversation with the specified `conversationId` does
     * not exist in the `conversationMap`, a new entry is created
     * @returns The `query` method returns a Promise that resolves to a string with the LLM response.
     */
    async query(system, userQuery, supportingContext, conversationId = 'default') {
        if (!this.conversationMap.has(conversationId))
            this.conversationMap.set(conversationId, []);
        const conversationHistory = this.conversationMap.get(conversationId);
        this.baseDebug(`${conversationHistory.length} history entries found for conversationId '${conversationId}'`);
        const result = await this.runQuery(system, userQuery, supportingContext, conversationHistory);
        conversationHistory.push({ message: userQuery, sender: 'HUMAN' });
        conversationHistory.push({
            message: `Old context: ${supportingContext.map((s) => s.pageContent).join('; ')}`,
            sender: 'SYSTEM',
        });
        conversationHistory.push({ message: result, sender: 'AI' });
        return result;
    }
}
