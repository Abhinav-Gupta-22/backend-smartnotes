# SMARTNOTES Backend API

Node.js backend server for the SMARTNOTES mobile app using Express and SQL.js (pure JavaScript SQLite).

## Features

- ✅ RESTful API for notes CRUD operations
- ✅ SQLite database (using sql.js - no native compilation needed!)
- ✅ Pure JavaScript - no Python or build tools required
- ✅ Search and filter functionality
- ✅ Bulk sync endpoint for offline synchronization
- ✅ CORS enabled for mobile app
- ✅ Health check endpoint

## Setup

1. Install dependencies (no build tools needed!):
```bash
cd backend
npm install
# or
yarn install
```

2. Initialize database:
```bash
npm run init-db
# or
yarn init-db
```

3. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev
# or
yarn dev

# Production mode
npm start
# or
yarn start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Notes
- **GET** `/api/notes` - Get all notes (supports `?query=term&tag=Work`)
- **GET** `/api/notes/:id` - Get note by ID
- **POST** `/api/notes` - Create new note
  ```json
  {
    "title": "Note title",
    "content": "Note content",
    "tag": "Work"
  }
  ```
- **PUT** `/api/notes/:id` - Update note
- **DELETE** `/api/notes/:id` - Delete note
- **POST** `/api/notes/search` - Search notes
  ```json
  {
    "query": "search term",
    "tag": "Work"
  }
  ```
- **POST** `/api/notes/sync` - Bulk sync notes
  ```json
  {
    "notes": [
      {
        "id": "123",
        "title": "Note title",
        "content": "Note content",
        "tag": "Work",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./database/smartnotes.db
CORS_ORIGIN=http://localhost:8081
```

## Database

The backend uses `sql.js` - a pure JavaScript SQLite implementation. This means:
- ✅ No Python required
- ✅ No build tools needed
- ✅ Works on Windows, Mac, Linux
- ✅ Just `npm install` and go!

The database file is stored at `backend/database/smartnotes.db`

## Database Schema

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tag TEXT NOT NULL CHECK(tag IN ('Work', 'Personal', 'Study', 'Other')),
  updatedAt TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Development

The backend automatically saves the database every 30 seconds and on every write operation. No manual saving needed!

## Troubleshooting

If you get module resolution errors:
1. Make sure you're using Node.js 18+ 
2. Delete `node_modules` and `yarn.lock` (or `package-lock.json`)
3. Run `yarn install` or `npm install` again
