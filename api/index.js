import express from 'express';
import cors from 'cors';
import notesRouter from '../src/routes/notes.js';
import { dbPromise } from '../src/database/db.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (restrict in production if needed)
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/notes', notesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Vercel serverless function handler
export default async (req, res) => {
  // Ensure database is initialized before handling requests
  try {
    await dbPromise;
    return app(req, res);
  } catch (error) {
    console.error('Database initialization error:', error);
    return res.status(500).json({ error: 'Database initialization failed' });
  }
};

