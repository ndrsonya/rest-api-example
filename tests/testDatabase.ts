import path from 'path';
import Knex, { Knex as KnexType } from 'knex';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export interface TestDatabase {
    container: StartedPostgreSqlContainer;
    db: KnexType;
}

export const startTestDatabase = async (): Promise<TestDatabase> => {
    const container = await new PostgreSqlContainer('postgres:13').start();

    const db = Knex({
        client: 'pg',
        connection: container.getConnectionUri(),
        migrations: {
            directory: path.join(__dirname, '../migrations'),
        },
    });

    await db.migrate.latest();

    return { container, db };
};

export const stopTestDatabase = async ({ container, db }: TestDatabase): Promise<void> => {
    await db.destroy();
    await container.stop();
};
