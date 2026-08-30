import { Request, Response } from 'express';
import { Knex } from 'knex';
import { createStatusController } from '../src/controllers/statusController';

jest.mock('../src/config/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
}));

describe('statusController', () => {
    let res: Response;
    const req = {} as Request;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });

    it('returns 200 OK when the database check succeeds', async () => {
        const db = { raw: jest.fn().mockResolvedValue(undefined) } as unknown as Knex;
        const controller = createStatusController(db);

        await controller.getStatus(req, res);

        expect(db.raw).toHaveBeenCalledWith('SELECT 1+1 AS result');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'OK',
            message: 'API is healthy and the database connection is successful!',
        });
    });

    it('returns 500 when the database check fails', async () => {
        const db = { raw: jest.fn().mockRejectedValue(new Error('connection refused')) } as unknown as Knex;
        const controller = createStatusController(db);

        await controller.getStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
});
