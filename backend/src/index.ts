// KORTEX Backend - Express Server with Bun Runtime
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';
import uploadRoutes from './routes/upload.routes';
import subjectRoutes from './routes/subject.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'kortex-backend',
    runtime: 'bun',
    version: Bun.version,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`🚀 KORTEX Backend running on http://localhost:${PORT}`);
  console.log(`📡 Runtime: Bun ${Bun.version}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
