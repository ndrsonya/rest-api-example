import { Express } from 'express';
import request from 'supertest';
import createApp from '../src/app';
import { startTestDatabase, stopTestDatabase, TestDatabase } from './testDatabase';

describe('Device routes (integration)', () => {
    let testDatabase: TestDatabase;
    let app: Express;

    beforeAll(async () => {
        testDatabase = await startTestDatabase();
        app = createApp(testDatabase.db);
    });

    afterEach(async () => {
        await testDatabase.db('device').del();
    });

    afterAll(async () => {
        await stopTestDatabase(testDatabase);
    });

    it('returns 200 with the devices belonging to the given user_id', async () => {
        await testDatabase.db('device').insert([
            { device_id: 'd1', user_id: 'u1', last_charging_timestamp: null },
            { device_id: 'd2', user_id: 'u1', last_charging_timestamp: null },
            { device_id: 'd3', user_id: 'u2', last_charging_timestamp: null },
        ]);

        const response = await request(app).get('/devices/u1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { device_id: 'd1', user_id: 'u1', last_charging_timestamp: null },
            { device_id: 'd2', user_id: 'u1', last_charging_timestamp: null },
        ]);
    });

    it('returns 404 when the user has no devices', async () => {
        const response = await request(app).get('/devices/unknown-user');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'No devices found for the given user_id.' });
    });
});
