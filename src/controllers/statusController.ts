import { Request, Response } from 'express';
import knex from '../config/database';
import { handleResponse, handleError } from '../helpers/responseHandler';

export const getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        await knex.raw('SELECT 1+1 AS result');

        const statusData = {
            status: 'OK',
            message: 'API is healthy and the database connection is successful!',
        };

        handleResponse(statusData, res);
    } catch (error) {
        handleError(error, res);
    }
};
