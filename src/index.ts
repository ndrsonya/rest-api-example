import express, { Request, Response, Express } from 'express';
import knex from './db/knex';
const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Set log level to 'info'
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()) }),
        new winston.transports.File({ filename: 'app.log' }) // Optionally, log to a file as well
    ]
});


// Create Express application
const app: Express = express();
const port = process.env.PORT || 8080;



// Middleware to parse JSON
app.use(express.json());

// Default route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

// Endpoint to get devices by user_id
app.get('/devices/:user_id', async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.params;

    try {
        const devices = await knex('device').where({ user_id });


        if (devices.length === 0) {
            return res.status(404).json({ message: 'No devices found for the given user_id.' });
        }


        return res.status(200).json(devices);
    } catch (error) {
        logger.error('Error fetching devices:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    knex.raw('SELECT 1+1 AS result')
        .then(() => {
            logger.info('Successfully connected to the database');
        })
        .catch((err) => {
            logger.error('Cant connect to the database');
            logger.error(err);
        });
});