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

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes - Vercel will route /api/notes/* to this function
// The path will be relative (e.g., /api/notes/123 becomes /123 in Express)
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

