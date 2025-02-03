import { Response } from 'express';
import logger from '../config/logger';

export const handleResponse = <T>(data: T, res: Response, notFoundMessage: string = 'Not Found') => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return res.status(404).json({ message: notFoundMessage });
    }

    return res.status(200).json(data);
};

export const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        logger.error(`Error: ${error.message}`);
    } else {
        logger.error('Unknown error occurred');
    }

    return res.status(500).json({ message: 'Internal server error.' });
};
