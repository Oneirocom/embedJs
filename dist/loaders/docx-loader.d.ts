import { BaseLoader } from '../interfaces/base-loader.js';
export declare class DocxLoader extends BaseLoader<{
    type: 'DocxLoader';
}> {
    private readonly filePathOrUrl;
    private readonly isUrl;
    constructor({ filePathOrUrl, chunkOverlap, chunkSize, }: {
        filePathOrUrl: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        pageContent: string;
        metadata: {
            type: "DocxLoader";
            source: string;
        };
    }, void, unknown>;
}
