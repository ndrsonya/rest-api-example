import express, { Router } from 'express';
import { Knex } from 'knex';
import { createStatusController } from '../controllers/statusController';

export const createStatusRoutes = (db: Knex): Router => {
    const router = express.Router();
    const statusController = createStatusController(db);

    router.get('/status', statusController.getStatus);

    return router;
};

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Check the health of the API and the database connection
 *     description: This endpoint returns the status of the API and checks if the database is reachable.
 *     responses:
 *       200:
 *         description: API is healthy and the database connection is successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'OK'
 *                 message:
 *                   type: string
 *                   example: 'API is healthy and the database connection is successful!'
 *       500:
 *         description: Internal server error if the database connection fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'Internal server error or database connection failed.'
 */
