export default function handler(req, res) {
  res.json({
    message: 'Smart Notes API',
    version: '1.0.0',
    status: 'ok',
    endpoints: {
      health: '/health',
      notes: '/api/notes',
      'get all notes': 'GET /api/notes',
      'get note by id': 'GET /api/notes/:id',
      'create note': 'POST /api/notes',
      'update note': 'PUT /api/notes/:id',
      'delete note': 'DELETE /api/notes/:id',
      'search notes': 'POST /api/notes/search',
      'sync notes': 'POST /api/notes/sync'
    }
  });
}

