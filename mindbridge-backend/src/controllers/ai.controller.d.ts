import type { Request, Response } from 'express';
export declare const getOracleContext: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const chatWithOracle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const clearChatHistory: (req: Request, res: Response) => Promise<void>;
export declare const deleteChatMessage: (req: Request, res: Response) => Promise<void>;
export declare const deleteBulkChatMessages: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=ai.controller.d.ts.map