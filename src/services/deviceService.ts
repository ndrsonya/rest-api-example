import { fetchDevicesByUserId } from '../repositories/deviceRepository';
import { Device } from '../types/deviceTypes';

export const getDevicesForUser = (userId: string): Promise<Device[]> => {
    return fetchDevicesByUserId(userId);
};
