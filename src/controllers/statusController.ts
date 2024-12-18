import { Request, Response } from 'express';
import knex from '../db/knex';
import { handleResponse, handleError } from '../helpers/responseHandler';

// Status endpoint to check the health of the API and DB connection
export const getStatus = async (req: Request, res: Response) => {
    try {
        // Simple DB query to check if the database is reachable
        await knex.raw('SELECT 1+1 AS result');

        // Status data for the healthy response
        const statusData = {
            status: 'OK',
            message: 'API is healthy and the database connection is successful!',
        };

        // Use handleResponse to send the success response
        return handleResponse(statusData, res);
    } catch (error) {
        // Handle any error with the DB connection 
        return handleError(error, res);
    }
};
