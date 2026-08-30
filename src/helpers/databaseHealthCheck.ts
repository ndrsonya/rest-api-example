import { Knex } from 'knex';

export const checkDatabaseConnection = async (db: Knex): Promise<void> => {
    await db.raw('SELECT 1');
};
