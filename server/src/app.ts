import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.route';

const app: Application = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Khai báo Route Auth
app.use('/api/v1/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Fashion E-commerce API is running...' });
});

export default app;