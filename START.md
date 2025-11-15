# Quick Start Guide

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Initialize Database

```bash
npm run init-db
```

## 3. Start Backend Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:3000`

## 4. Test the API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3000/health

# Get all notes
curl http://localhost:3000/api/notes
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/search` - Search notes
- `POST /api/notes/sync` - Bulk sync

## Frontend Configuration

Update `services/api.ts` to point to your backend:
```typescript
const API_BASE_URL = 'http://localhost:3000/api/notes';
```

Or set environment variable:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api/notes
```

