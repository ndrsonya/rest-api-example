import { Request, Response } from 'express';
import { Knex } from 'knex';
import { handleResponse, handleError } from '../helpers/responseHandler';
import { checkDatabaseConnection } from '../helpers/databaseHealthCheck';

export const createStatusController = (db: Knex) => ({
    getLiveness: (req: Request, res: Response): void => {
        handleResponse({ status: 'OK', message: 'API process is alive.' }, res);
    },

    getReadiness: async (req: Request, res: Response): Promise<void> => {
        try {
            await checkDatabaseConnection(db);

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
