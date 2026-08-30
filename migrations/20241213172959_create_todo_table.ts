import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('todo', (table) => {
        table.string('todo_id').primary();
        table.string('user_id').notNullable();
        table.string('title').notNullable();
        table.boolean('completed').notNullable().defaultTo(false);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('todo');
}
