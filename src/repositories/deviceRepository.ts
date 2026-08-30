
import { Knex } from 'knex';
import { Device } from '../types/deviceTypes';
import logger from '../config/logger';

export interface DeviceRepository {
    fetchDevicesByUserId(user_id: string): Promise<Device[]>;
}

export const createDeviceRepository = (db: Knex): DeviceRepository => ({
    fetchDevicesByUserId: async (user_id: string): Promise<Device[]> => {
        try {
            const devices: Device[] = await db('device').where({ user_id });
            return devices;
        } catch (error) {
            logger.error(error)
            throw new Error('Error fetching devices');
        }
    },
});
