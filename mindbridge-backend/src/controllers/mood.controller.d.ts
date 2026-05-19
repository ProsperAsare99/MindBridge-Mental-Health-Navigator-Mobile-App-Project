import type { Request, Response } from 'express';
export declare const getMoodLogs: (req: Request, res: Response) => Promise<void>;
export declare const createMoodLog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInsights: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=mood.controller.d.ts.map