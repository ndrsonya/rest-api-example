import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import deviceRoutes from './routes/deviceRoutes';
import db from './db/knex';
import logger, { stream } from './config/logger';
import statusRoutes from './routes/statusRoutes';
import { swaggerSpec, swaggerUi } from './config/swaggerConfig';
import { handleError } from './helpers/responseHandler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.disable('x-powered-by');
app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(express.json());

app.use(deviceRoutes);

app.use(statusRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    handleError(err, res);
});

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