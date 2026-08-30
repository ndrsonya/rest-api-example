import { Request, Response } from 'express';
import { createDeviceController } from '../src/controllers/deviceController';
import { DeviceService } from '../src/services/deviceService';
import { Device } from '../src/types/deviceTypes';

jest.mock('../src/config/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
}));

describe('deviceController', () => {
    let res: Response;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });

    const buildReq = (user_id: string) => ({ params: { user_id } }) as unknown as Request;

    it('returns 200 with the devices for the given user_id', async () => {
        const devices: Device[] = [
            { device_id: 'd1', user_id: 'u1', last_charging_timestamp: null },
        ];
        const getDevicesForUser = jest.fn().mockResolvedValue(devices);
        const controller = createDeviceController({ getDevicesForUser } as DeviceService);

        await controller.getDevicesByUserId(buildReq('u1'), res);

        expect(getDevicesForUser).toHaveBeenCalledWith('u1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(devices);
    });

    it('returns 200 with an empty array when the user has no devices', async () => {
        const getDevicesForUser = jest.fn().mockResolvedValue([]);
        const controller = createDeviceController({ getDevicesForUser } as DeviceService);

        await controller.getDevicesByUserId(buildReq('u1'), res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('returns 500 when the service throws', async () => {
        const getDevicesForUser = jest.fn().mockRejectedValue(new Error('Error fetching devices'));
        const controller = createDeviceController({ getDevicesForUser } as DeviceService);

        await controller.getDevicesByUserId(buildReq('u1'), res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
});
