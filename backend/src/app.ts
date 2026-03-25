import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import candidateRoutes from './routes/candidateRoutes';
import authRoutes from './routes/authRoutes';
import logger from './utils/logger';
import { rateLimiter } from './middlewares/rateLimiter';

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
  console.log('✅ dotenv loaded');
  console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
  console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH);
}
const app = express();

// Middleware
app.use(express.json());
app.use(rateLimiter);
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const morganFormat = morgan((tokens, req, res) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    responseTime: Number(tokens['response-time'](req, res)),
    userAgent: tokens['user-agent'](req, res),
    remoteAddr: tokens['remote-addr'](req, res),
  });
}, {
  stream: { write: (message) => logger.info(message) }
});

app.use(morganFormat);
app.use('/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.get('/debug-env', (req, res) => {
  res.json({
    adminUsername: process.env.ADMIN_USERNAME,
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ? 'present' : 'missing',
  });
});
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      logger.info('Connected to MongoDB');
    } catch (err) {
      logger.error('MongoDB connection error:', err);
      process.exit(1);
    }
  };
  connectDB();
}
export default app;