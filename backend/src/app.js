import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import documentsRouter from './routes/documents.js';
import { CLIENT_ORIGIN } from './config/env.js';

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/documents', documentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
