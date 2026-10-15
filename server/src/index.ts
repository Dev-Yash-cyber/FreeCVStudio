import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import coverLetterRoutes from './routes/coverLetter.routes.js';
import applicationRoutes from './routes/application.routes.js';
import atsRoutes from './routes/ats.routes.js';
import aiRoutes from './routes/ai.routes.js';
import importRoutes from './routes/import.routes.js';
import exportRoutes from './routes/export.routes.js';
import careerToolsRoutes from './routes/careerTools.routes.js';
import templateRoutes from './routes/templates.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/cover-letters', coverLetterRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/import', importRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/career-tools', careerToolsRoutes);
app.use('/api/templates', templateRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FreeCV Studio API',
    version: '1.0.0',
    freePolicy: '100% Free Forever - No Paywalls, No Watermarks',
  });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 FreeCV Studio Server running on port ${PORT}`);
});

export default app;
