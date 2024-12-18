import express from 'express';
import { getDevicesByUserId } from '../controllers/deviceController';

const router = express.Router();

router.get('/devices/:user_id', getDevicesByUserId);

export default router;
