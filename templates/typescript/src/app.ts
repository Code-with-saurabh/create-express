import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { apiLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './errors/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import indexRoutes from './routes/index';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(compression());

app.use(requestLogger);

app.use('/api/', apiLimiter);

app.use('/api/health', healthRoutes);
app.use('/api', indexRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
