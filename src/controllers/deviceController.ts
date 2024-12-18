import { Request, Response, NextFunction, RequestHandler } from 'express';
import { fetchDevicesByUserId } from '../repositories/deviceRepository';
import { Device } from '../types/deviceTypes';
import { handleResponse, handleError } from '../helpers/responseHandler';

export const getDevicesByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user_id } = req.params;

    try {
        const devices = await fetchDevicesByUserId(user_id);
        handleResponse<Device[]>(devices, res, 'No devices found for the given user_id.');
    } catch (error) {
        handleError(error, res);
    }
};

