import { createDeviceService } from '../src/services/deviceService';
import { DeviceRepository } from '../src/repositories/deviceRepository';
import { Device } from '../src/types/deviceTypes';

describe('deviceService', () => {
    const buildRepository = (overrides: Partial<DeviceRepository> = {}): DeviceRepository => ({
        fetchDevicesByUserId: jest.fn(),
        ...overrides,
    });

    it('delegates to the repository with the given userId', async () => {
        const devices: Device[] = [
            { device_id: 'd1', user_id: 'u1', last_charging_timestamp: null },
        ];
        const fetchDevicesByUserId = jest.fn().mockResolvedValue(devices);
        const service = createDeviceService(buildRepository({ fetchDevicesByUserId }));

        const result = await service.getDevicesForUser('u1');

        expect(fetchDevicesByUserId).toHaveBeenCalledWith('u1');
        expect(result).toBe(devices);
    });

    it('propagates errors thrown by the repository', async () => {
        const fetchDevicesByUserId = jest.fn().mockRejectedValue(new Error('Error fetching devices'));
        const service = createDeviceService(buildRepository({ fetchDevicesByUserId }));

        await expect(service.getDevicesForUser('u1')).rejects.toThrow('Error fetching devices');
    });
});
