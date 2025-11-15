# Deploying Backend to Vercel

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Have a Vercel account (sign up at https://vercel.com)

## Deployment Steps

### 1. Install Dependencies
```bash
cd backend
yarn install
```

### 2. Deploy to Vercel
```bash
# Login to Vercel (first time only)
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

### 3. Get Your Backend URL
After deployment, Vercel will provide you with a URL like:
- `https://your-project-name.vercel.app`

Your API will be available at:
- `https://your-project-name.vercel.app/api/notes`
- `https://your-project-name.vercel.app/health` (health check)

### 4. Update Mobile App Configuration
Update the `EXPO_PUBLIC_API_URL` environment variable in your mobile app to point to your Vercel URL:

```bash
# In smart-notes directory
# Create .env file or update app.json with:
EXPO_PUBLIC_API_URL=https://your-project-name.vercel.app/api/notes
```

## Important Notes

⚠️ **Database Storage**: The current setup uses `/tmp` directory which is **ephemeral**. Data will be lost when:
- Function cold starts
- Serverless function restarts
- After inactivity periods

### For Production (Persistent Storage):
Consider using one of these options:

1. **Vercel Postgres** (Recommended)
   - Free tier available
   - Persistent storage
   - Easy integration

2. **External Database Service**
   - Supabase (free tier)
   - PlanetScale
   - Railway
   - MongoDB Atlas

3. **Alternative Hosting**
   - Railway (supports SQLite better)
   - Render
   - Fly.io

## Environment Variables (Optional)
You can set environment variables in Vercel dashboard:
- `DB_PATH`: Custom database path
- `NODE_ENV`: Set to `production`

## Testing Your Deployment
```bash
# Test health endpoint
curl https://your-project-name.vercel.app/health

# Test API endpoint
curl https://your-project-name.vercel.app/api/notes
```

