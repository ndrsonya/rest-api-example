import dotenv from 'dotenv';
import createApp from './app';
import db from './config/database';
import logger from './config/logger';
import { checkDatabaseConnection } from './helpers/databaseHealthCheck';

dotenv.config();

const port = process.env.PORT || 8080;

const start = async (): Promise<void> => {
    try {
        await checkDatabaseConnection(db);
        logger.info('Successfully connected to the database');
    } catch (error) {
        logger.error('Cant connect to the database');
        logger.error(error);
        process.exit(1);
    }

    const app = createApp(db);

    const server = app.listen(port, () => {
        logger.info(`Server running at http://localhost:${port}, go to http://localhost:${port}/api-docs to check the docs'`);
    });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            logger.info('HTTP server closed');
        });
    });
};

void start();
