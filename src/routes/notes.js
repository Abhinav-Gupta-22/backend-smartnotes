import express from 'express';
import { queries, dbPromise } from '../database/db.js';

const router = express.Router();

// Middleware to ensure database is initialized
const ensureDb = async (req, res, next) => {
  try {
    await dbPromise;
    next();
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Database initialization failed' });
  }
};

/**
 * GET /api/notes
 * Get all notes
 * Supports query parameters: ?query=searchterm&tag=Work
 */
router.get('/', ensureDb, (req, res) => {
  try {
    const { query, tag } = req.query;
    
    if (query || tag) {
      // Use search functionality
      const searchPattern = query ? `%${query.toLowerCase()}%` : '%%';
      const tagFilter = tag || null;
      const notes = queries.searchNotes(searchPattern, tagFilter);
      res.json(notes);
    } else {
      // Get all notes
      const notes = queries.getAllNotes();
      res.json(notes);
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

/**
 * GET /api/notes/:id
 * Get a specific note by ID
 */
router.get('/:id', ensureDb, (req, res) => {
  try {
    const note = queries.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

/**
 * POST /api/notes
 * Create a new note
 */
router.post('/', ensureDb, (req, res) => {
  try {
    const { id, title, content, tag } = req.body;

    // Validation
    if (!title || !content || !tag) {
      return res.status(400).json({ error: 'Title, content, and tag are required' });
    }

    const validTags = ['Work', 'Personal', 'Study', 'Other'];
    if (!validTags.includes(tag)) {
      return res.status(400).json({ error: 'Invalid tag. Must be one of: Work, Personal, Study, Other' });
    }

    // Use provided ID or generate a new one (for offline-first sync consistency)
    const noteId = id || (Date.now().toString() + Math.random().toString(36).substr(2, 9));
    const updatedAt = new Date().toISOString();

    // Check if note with this ID already exists
    const existingNote = queries.getNoteById(noteId);
    if (existingNote) {
      // If note exists, update it instead
      queries.updateNote(title, content, tag, updatedAt, noteId);
      const updatedNote = queries.getNoteById(noteId);
      return res.json(updatedNote);
    }

    queries.insertNote(noteId, title, content, tag, updatedAt);
    
    const note = queries.getNoteById(noteId);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

/**
 * PUT /api/notes/:id
 * Update an existing note
 */
router.put('/:id', ensureDb, (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tag } = req.body;

    // Check if note exists
    const existingNote = queries.getNoteById(id);
    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Validation
    if (!title || !content || !tag) {
      return res.status(400).json({ error: 'Title, content, and tag are required' });
    }

    const validTags = ['Work', 'Personal', 'Study', 'Other'];
    if (!validTags.includes(tag)) {
      return res.status(400).json({ error: 'Invalid tag. Must be one of: Work, Personal, Study, Other' });
    }

    const updatedAt = new Date().toISOString();
    queries.updateNote(title, content, tag, updatedAt, id);

    const updatedNote = queries.getNoteById(id);
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
router.delete('/:id', ensureDb, (req, res) => {
  try {
    const { id } = req.params;

    // Check if note exists
    const existingNote = queries.getNoteById(id);
    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    queries.deleteNote(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

/**
 * POST /api/notes/search
 * Search notes by query and optional tag
 */
router.post('/search', ensureDb, (req, res) => {
  try {
    const { query, tag } = req.body;
    const searchPattern = query ? `%${query.toLowerCase()}%` : '%%';
    const tagFilter = tag || null;

    const notes = queries.searchNotes(searchPattern, tagFilter);
    res.json(notes);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

/**
 * POST /api/notes/sync
 * Bulk sync notes (for offline-first sync)
 */
router.post('/sync', ensureDb, (req, res) => {
  try {
    const { notes } = req.body;

    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Notes must be an array' });
    }

    // Bulk insert or replace
    queries.bulkInsertOrReplace(notes);

    // Return all notes after sync
    const allNotes = queries.getAllNotes();
    res.json(allNotes);
  } catch (error) {
    console.error('Error syncing notes:', error);
    res.status(500).json({ error: 'Failed to sync notes' });
  }
});

export default router;

