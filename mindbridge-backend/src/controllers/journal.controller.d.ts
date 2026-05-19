import type { Request, Response } from 'express';
export declare const getEntries: (req: Request, res: Response) => Promise<void>;
export declare const createEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=journal.controller.d.ts.map