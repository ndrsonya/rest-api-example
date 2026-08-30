import { DeviceRepository } from '../repositories/deviceRepository';
import { Device } from '../types/deviceTypes';

export interface DeviceService {
    getDevicesForUser(userId: string): Promise<Device[]>;
}

export const createDeviceService = (deviceRepository: DeviceRepository): DeviceService => ({
    getDevicesForUser: (userId: string): Promise<Device[]> => {
        return deviceRepository.fetchDevicesByUserId(userId);
    },
});
