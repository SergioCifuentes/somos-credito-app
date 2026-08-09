import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';
import reportsRoutes from './routes/report.routes';
import { errorHandler } from './middlewares/errorHandler';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);
app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRoutes);
app.use('/api/v1/reportes', reportsRoutes);

app.use(errorHandler);

export default app;