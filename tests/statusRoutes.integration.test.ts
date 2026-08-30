import { Express } from 'express';
import request from 'supertest';
import createApp from '../src/app';
import { startTestDatabase, stopTestDatabase, TestDatabase } from './testDatabase';

describe('Status route (integration)', () => {
    let testDatabase: TestDatabase;
    let app: Express;

    beforeAll(async () => {
        testDatabase = await startTestDatabase();
        app = createApp(testDatabase.db);
    });

    afterAll(async () => {
        await stopTestDatabase(testDatabase);
    });

    it('returns 200 OK when the database connection is healthy', async () => {
        const response = await request(app).get('/health/ready');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'OK',
            message: 'API is healthy and the database connection is successful!',
        });
    });

    it('returns 200 OK from the liveness probe', async () => {
        const response = await request(app).get('/health/live');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'OK', message: 'API process is alive.' });
    });
});
