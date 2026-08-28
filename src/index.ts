import dotenv from 'dotenv';
import app from './app';
import db from './config/database';
import logger from './config/logger';

dotenv.config();

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
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

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
