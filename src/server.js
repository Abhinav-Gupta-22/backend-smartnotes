import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';
import { dbPromise } from './database/db.js'; // Initialize database

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Allow all origins for mobile development (restrict in production)
app.use(cors({
  origin: '*', // Allow all origins for development (change in production)
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

// Start server after database initialization
dbPromise.then(() => {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║   SMARTNOTES Backend Server          ║
╚══════════════════════════════════════╝
🚀 Server running on port ${PORT}
📊 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API endpoint: http://localhost:${PORT}/api/notes
💚 Health check: http://localhost:${PORT}/health
    `);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

