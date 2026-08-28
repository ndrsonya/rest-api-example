import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import deviceRoutes from './routes/deviceRoutes';
import statusRoutes from './routes/statusRoutes';
import { swaggerSpec, swaggerUi } from './config/swaggerConfig';
import { stream } from './config/logger';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(express.json());

app.use(deviceRoutes);
app.use(statusRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
