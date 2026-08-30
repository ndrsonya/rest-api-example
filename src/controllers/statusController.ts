import { Request, Response } from 'express';
import { Knex } from 'knex';
import { handleResponse, handleError } from '../helpers/responseHandler';

export const createStatusController = (db: Knex) => ({
    getStatus: async (req: Request, res: Response): Promise<void> => {
        try {
            await db.raw('SELECT 1+1 AS result');

            const statusData = {
                status: 'OK',
                message: 'API is healthy and the database connection is successful!',
            };

            handleResponse(statusData, res);
        } catch (error) {
            handleError(error, res);
        }
    },
});
