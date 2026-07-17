import express, { Application, Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';
import { upload } from './middlewares/fileStorage';
import './jobs/subscriptionCron';

dotenv.config({ path: './backend/.env' });

const app: Application = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.use(errorHandler);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;