import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use('/api', apiRoutes);

const uploadPath = path.resolve(__dirname, 'uploads');
console.log("Sunucu şu yolu servis ediyor:", uploadPath);
app.use('/uploads', express.static(uploadPath));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.use(errorHandler);

export default app;