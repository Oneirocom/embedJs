import { Chunk, ConversationHistory } from '../global/types.js';
export declare abstract class BaseModel {
    private readonly baseDebug;
    private static defaultTemperature;
    static setDefaultTemperature(temperature?: number): void;
    private readonly conversationMap;
    private readonly _temperature?;
    constructor(temperature?: number);
    get temperature(): number;
    init(): Promise<void>;
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
    query(system: string, userQuery: string, supportingContext: Chunk[], conversationId?: string): Promise<string>;
    protected abstract runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
}
