import { Request, Response } from 'express';
import { fetchDevicesByUserId } from '../repositories/deviceRepository';
import { Device } from '../types/deviceTypes';
import logger from '../config/logger';

const handleResponse = (devices: Device[], res: Response) => {
    if (devices.length === 0) {
        return res.status(404).json({ message: 'No devices found for the given user_id.' });
    }
    return res.status(200).json(devices);
};

const handleError = (error: unknown, res: Response) => {
    logger.error(`Error: ${error}`);
    return res.status(500).json({ message: 'Internal server error.' });
};

export const getDevicesByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { user_id } = req.params;

    try {
        const devices = await fetchDevicesByUserId(user_id);

        return handleResponse(devices, res);
    } catch (error) {
        return handleError(error, res);
    }
};
