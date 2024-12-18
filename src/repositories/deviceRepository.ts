
import db from '../db/knex';
import { Device } from '../types/deviceTypes';
import logger from '../config/logger';

export const fetchDevicesByUserId = async (user_id: string): Promise<Device[]> => {
    try {
        const devices: Device[] = await db('device').where({ user_id });
        return devices;
    } catch (error) {
        logger.error(error)
        throw new Error('Error fetching devices');
    }
};
