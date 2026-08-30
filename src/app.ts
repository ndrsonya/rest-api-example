import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Knex } from 'knex';
import { createTodoRoutes } from './routes/todoRoutes';
import { createStatusRoutes } from './routes/statusRoutes';
import { createTodoRepository } from './repositories/todoRepository';
import { createTodoService } from './services/todoService';
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

    const todoRepository = createTodoRepository(db);
    const todoService = createTodoService(todoRepository);

    app.use(createTodoRoutes(todoService));
    app.use(createStatusRoutes(db));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

export default createApp;
