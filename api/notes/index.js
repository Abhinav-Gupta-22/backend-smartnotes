import express from 'express';
import cors from 'cors';
import notesRouter from '../../src/routes/notes.js';
import { dbPromise } from '../../src/database/db.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path rewriting middleware - strip /api/notes prefix
app.use((req, res, next) => {
  // Vercel passes full path, but router expects relative paths
  // /api/notes -> /
  // /api/notes/123 -> /123
  if (req.url.startsWith('/api/notes')) {
    req.url = req.url.replace('/api/notes', '') || '/';
  }
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} (original: ${req.originalUrl || req.url})`);
  next();
});

// API Routes - Mount router at root since we've rewritten the path
app.use('/', notesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    await dbPromise;
    app(req, res);
  } catch (error) {
    console.error('Database initialization error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Database initialization failed' });
    }
  }
}

