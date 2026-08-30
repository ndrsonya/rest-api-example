import { Knex } from 'knex';
import { checkDatabaseConnection } from '../src/helpers/databaseHealthCheck';

describe('checkDatabaseConnection', () => {
    it('resolves when the database responds', async () => {
        const db = { raw: jest.fn().mockResolvedValue(undefined) } as unknown as Knex;

        await expect(checkDatabaseConnection(db)).resolves.toBeUndefined();
        expect(db.raw).toHaveBeenCalledWith('SELECT 1');
    });

    it('propagates the error when the database is unreachable', async () => {
        const db = { raw: jest.fn().mockRejectedValue(new Error('connection refused')) } as unknown as Knex;

        await expect(checkDatabaseConnection(db)).rejects.toThrow('connection refused');
    });
});
