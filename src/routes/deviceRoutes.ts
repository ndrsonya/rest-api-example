import express from 'express';
import { getDevicesByUserId } from '../controllers/deviceController';

const router = express.Router();

router.get('/devices/:user_id', getDevicesByUserId);

export default router;

/**
 * @openapi
 * /devices/{user_id}:
 *   get:
 *     summary: Retrieve a list of devices belonging to a user
 *     description: Returns an array of devices belonging to the specified user.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: string
 *           example: q9m18b1frwn1kh4gun8c3g9o
 *     responses:
 *       200:
 *         description: A list of devices belonging to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   last_charging_timestamp:
 *                     type: string
 *                     nullable: true
 *             example:
 *               - device_id: "xiiu1zushyiurb8xndqz3osc"
 *                 user_id: "q9m18b1frwn1kh4gun8c3g9o"
 *                 last_charging_timestamp: null
 *       404:
 *         description: No devices found for the given user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'No devices found for the given user_id.'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'Internal server error.'
 */

