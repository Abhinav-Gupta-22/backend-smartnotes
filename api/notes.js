import express from 'express';
import cors from 'cors';
import notesRouter from '../src/routes/notes.js';
import { dbPromise } from '../src/database/db.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path rewriting middleware - Handle Vercel's routing
// Vercel routes /api/notes/* to this file, but passes full path
app.use((req, res, next) => {
  // Get the path from various possible sources
  let path = req.url || req.path || '';
  
  // Check if we have the full path with /api/notes
  if (path.includes('/api/notes')) {
    // Extract everything after /api/notes
    const match = path.match(/\/api\/notes(.*)$/);
    if (match && match[1]) {
      path = match[1];
    } else {
      path = '/';
    }
  }
  
  // Also check query string
  const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
  const cleanPath = path.split('?')[0];
  
  // Update req.url for Express router
  req.url = cleanPath || '/';
  if (queryString) {
    req.url += '?' + queryString;
  }
  
  // Preserve original for debugging
  req.originalUrl = req.originalUrl || req.url;
  
  console.log(`[${req.method}] Path: ${req.url}, Original: ${req.originalUrl}`);
  next();
});

// Mount the notes router
app.use('/', notesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ error: 'Route not found' });
  }
});

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    await dbPromise;
    
    // Log the incoming request for debugging
    console.log('Vercel Request:', {
      method: req.method,
      url: req.url,
      path: req.path,
      query: req.query,
      headers: req.headers
    });
    
    // Handle the request with Express
    app(req, res);
  } catch (error) {
    console.error('Database initialization error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Database initialization failed' });
    }
  }
}

