import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Knex } from 'knex';
import { createDeviceRoutes } from './routes/deviceRoutes';
import { createStatusRoutes } from './routes/statusRoutes';
import { createDeviceRepository } from './repositories/deviceRepository';
import { createDeviceService } from './services/deviceService';
import { swaggerSpec, swaggerUi } from './config/swaggerConfig';
import { stream } from './config/logger';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (db: Knex): Express => {
    const app: Express = express();

    app.disable('x-powered-by');
    app.use(helmet());
    app.use(morgan('combined', { stream }));
    app.use(express.json());

    const deviceRepository = createDeviceRepository(db);
    const deviceService = createDeviceService(deviceRepository);

    app.use(createDeviceRoutes(deviceService));
    app.use(createStatusRoutes(db));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

export default createApp;
