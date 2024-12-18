import express, { Express } from 'express';
import dotenv from 'dotenv';
import deviceRoutes from './routes/deviceRoutes';
import db from './db/knex';
import logger from './config/logger';
import statusRoutes from './routes/statusRoutes';
import { swaggerSpec, swaggerUi } from './config/swaggerConfig';

// Initialize environment variables
dotenv.config();

// Create Express application
const app: Express = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

// Set up routes
app.use(deviceRoutes);

app.use(statusRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Start the server
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
