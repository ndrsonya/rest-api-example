import { Request, Response } from 'express';
import { DeviceService } from '../services/deviceService';
import { Device } from '../types/deviceTypes';
import { handleResponse, handleError } from '../helpers/responseHandler';

export const createDeviceController = (deviceService: DeviceService) => ({
    getDevicesByUserId: async (req: Request, res: Response): Promise<void> => {
        const { user_id } = req.params;

        try {
            const devices = await deviceService.getDevicesForUser(user_id);
            handleResponse<Device[]>(devices, res);
        } catch (error) {
            handleError(error, res);
        }
    },
});

