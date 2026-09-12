const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/requestLogger');
const { notFoundHandler } = require('./errors/notFoundHandler');
const { errorHandler } = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const indexRoutes = require('./routes/index');

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

module.exports = app;
