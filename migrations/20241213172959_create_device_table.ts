import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('device', (table) => {
        table.string('device_id').primary();
        table.string('user_id').notNullable();
        table.timestamp('last_charging_timestamp').nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('device');
}
