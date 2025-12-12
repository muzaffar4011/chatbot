# 🚀 Quick Start Guide

Get your Salon RAG Bot up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Docker (for running Qdrant locally - free)
- OpenRouter API key ([Get free key here](https://openrouter.ai/keys))

## Installation Steps

### 1. Install All Dependencies

```bash
# From project root
npm run install:all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Backend

```bash
cd backend
cp env.example .env
```

Edit `backend/.env` and add your API keys:

**For Qdrant Cloud (Recommended):**
```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
QDRANT_URL=https://your-cluster-url.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key-here
```

Get Qdrant Cloud credentials from: https://cloud.qdrant.io/ (free tier available!)

**OR for Local Qdrant:**
```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
```

Then start Qdrant locally:
```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

### 3. Ingest Knowledge Base

```bash
cd backend
npm run ingest
```

Wait for: `✅ Successfully ingested X documents!`

### 4. Start Backend Server

```bash
# In backend directory
npm run dev
```

You should see: `🚀 Server running on port 3001`

### 5. Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:5173`

### 6. Open Browser

Navigate to: **http://localhost:5173**

Click the chat button (bottom-right) and start chatting!

## Test Queries

**English:**
- "What services do you offer?"
- "How much does a haircut cost?"
- "What are your operating hours?"

**Roman Urdu:**
- "Hair cut ki price kya hai?"
- "Facial ke liye kya options hain?"
- "Booking kaise karni hai?"

## Troubleshooting

### ❌ "OPENROUTER_API_KEY is not set"
- Make sure `backend/.env` exists
- Check that the key starts with `sk-or-v1-`

### ❌ "Connection refused" or "Qdrant not accessible"
- Make sure Qdrant is running: `docker ps`
- Start Qdrant: `docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant`
- Check the URL in `backend/.env` matches your Qdrant instance

### ❌ "Vector database not found"
- Run `npm run ingest` in backend directory
- Make sure Qdrant is running and accessible

### ❌ "Port 3001 already in use"
- Change PORT in `backend/.env`
- Or stop the process using port 3001

### ❌ "Cannot connect to backend"
- Make sure backend is running on port 3001
- Check `frontend/vite.config.ts` proxy settings

## Verify Setup

Run this to check everything is configured:
```bash
cd backend
npm run verify
```

## Next Steps

- Customize salon data in `backend/src/scripts/ingest-knowledge-base.js`
- Update contact info in `backend/.env`
- Customize UI colors in `frontend/tailwind.config.js`

## Need Help?

Check the full documentation in `README.md` and `requirements.md`

