import { internalErrorResponse } from './response-handlers';

export const tryCatchWrapper = (fn: (req: Request, res: Response) => Promise<Response>) => {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      return internalErrorResponse(error);
    }
  };
};
