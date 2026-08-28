import { Knex } from 'knex';
import { createId } from '@paralleldrive/cuid2';

export async function seed(knex: Knex): Promise<void> {
    await knex('device').del();

    const devices = Array.from({ length: 10 }).map(() => ({
        device_id: createId(),
        user_id: createId(),
        last_charging_timestamp: null
    }));

    await knex('device').insert(devices);
}
