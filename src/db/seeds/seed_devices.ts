import { Knex } from 'knex';
import cuid from 'cuid';


export async function seed(knex: Knex): Promise<void> {
    await knex('device').del();

    const devices = Array.from({ length: 10 }).map(() => ({
        device_id: cuid(),
        user_id: cuid(),
        last_charging_timestamp: null
    }));

    await knex('device').insert(devices);
}
