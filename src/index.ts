import express, { Express } from 'express';
import dotenv from 'dotenv';
import deviceRoutes from './routes/deviceRoutes';
import db from './db/knex';
import logger from './config/logger';
import statusRoutes from './routes/statusRoutes';
import { swaggerSpec, swaggerUi } from './config/swaggerConfig';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use(deviceRoutes);

app.use(statusRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}, go to http://localhost:${port}/api-docs to check the docs'`);

    db.raw('SELECT 1+1 AS result')
        .then(() => {
            logger.info('Successfully connected to the database');
        })
        .catch((err) => {
            logger.error('Cant connect to the database');
            logger.error(err);
        });
});
