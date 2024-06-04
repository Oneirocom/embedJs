import { Chunk, ConversationHistory } from '../global/types.js';
import { BaseModel } from '../interfaces/base-model.js';
export declare class VertexAI extends BaseModel {
    private readonly debug;
    private model;
    constructor({ temperature, modelName }: {
        temperature?: number;
        modelName?: string;
    });
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
}
