import { Request, Response, NextFunction } from 'express';
import { handleError } from '../helpers/responseHandler';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        next(err);
        return;
    }
    handleError(err, res);
};
