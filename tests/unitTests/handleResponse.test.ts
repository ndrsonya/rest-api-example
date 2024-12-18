
import { handleResponse, handleError } from '../../src/helpers/responseHandler';
import { Response } from 'express';
import logger from '../../src/config/logger';

// Mocking winston logger
jest.mock('../../src/config/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
}));

describe('handleResponse', () => {
    let res: Response;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });

    it('should return a 404 response when data is null', () => {
        handleResponse(null, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not Found' });
    });

    it('should return a 404 response when data is an empty array', () => {
        handleResponse([], res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not Found' });
    });

    it('should return a 404 response with a custom message when data is empty', () => {
        const customMessage = 'No users found';
        handleResponse([], res, customMessage);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: customMessage });
    });

    it('should return a 200 response when data is valid', () => {
        const data = [{ id: 1, name: 'John Doe' }];
        handleResponse(data, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(data);
    });
});

describe('handleError', () => {
    let res: Response;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });

    it('should log error and return a 500 response when error is an instance of Error', () => {
        const error = new Error('Test error');
        handleError(error, res);

        expect(logger.error).toHaveBeenCalledWith('Error: Test error');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });

    it('should log unknown error and return a 500 response when error is not an instance of Error', () => {
        const error = 'Some unknown error';
        handleError(error, res);

        expect(logger.error).toHaveBeenCalledWith('Unknown error occurred');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
});
