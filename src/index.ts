import express, { Express } from 'express';
import dotenv from 'dotenv';
import deviceRoutes from './routes/deviceRoutes';
import db from './db/knex';
import logger from './config/logger';

// Initialize environment variables
dotenv.config();

// Create Express application
const app: Express = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

// Set up routes
app.use(deviceRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);

    db.raw('SELECT 1+1 AS result')
        .then(() => {
            logger.info('Successfully connected to the database');
        })
        .catch((err) => {
            logger.error('Cant connect to the database');
            logger.error(err);
        });
});
