import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

export default app;