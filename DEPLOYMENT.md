# 🚀 Deployment Guide - Vercel

Complete guide to deploy your Salon RAG Bot on Vercel.

## 📋 Overview

- **Frontend**: Deploy on Vercel (Free tier available)
- **Backend**: Deploy on Railway/Render (Recommended) OR Vercel Serverless Functions
- **Vector DB**: Qdrant Cloud (Already set up)

---

## Option 1: Frontend on Vercel + Backend on Railway (Recommended) ⭐

### Step 1: Deploy Backend on Railway

1. **Sign up at Railway**: https://railway.app/
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Configure:**
   - Root Directory: `backend`
   - Build Command: (leave empty, Railway auto-detects)
   - Start Command: `npm start`

5. **Add Environment Variables in Railway:**
   ```
   PORT=3001
   NODE_ENV=production
   OPENROUTER_API_KEY=your_openrouter_key
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_key
   SALON_NAME=Premium Salon
   SALON_LOCATION=Karachi
   SALON_PHONE=+92-300-1234567
   SALON_WHATSAPP=+92-300-1234567
   ```

6. **Deploy & Get URL**: Railway will give you a URL like `https://your-app.railway.app`

7. **Run Knowledge Base Ingestion:**
   - Go to Railway dashboard → Your service → "Deploy Logs"
   - Or use Railway CLI to run: `railway run npm run ingest`

### Step 2: Deploy Frontend on Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy Frontend:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name: `salon-rag-frontend`
   - Directory: `./frontend`
   - Override settings? **No**

5. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app
     ```

6. **Redeploy** after adding environment variables

### Step 3: Update CORS in Backend

Update `backend/src/server.js` to allow your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

---

## Option 2: Both on Vercel (Serverless Functions)

### Step 1: Convert Backend to Vercel Serverless

1. **Create `vercel.json` in root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

2. **Update `frontend/vite.config.ts`:**
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
```

3. **Deploy:**
```bash
vercel
```

**Note**: Serverless functions have execution time limits. For RAG with streaming, Railway/Render is better.

---

## Option 3: Frontend on Vercel + Backend on Render

### Deploy Backend on Render:

1. **Sign up**: https://render.com/
2. **New** → **Web Service**
3. **Connect GitHub repo**
4. **Configure:**
   - Name: `salon-rag-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`

5. **Add Environment Variables** (same as Railway)

6. **Deploy & Get URL**: `https://your-app.onrender.com`

7. **Run Ingestion**: Use Render Shell or SSH to run `npm run ingest`

### Deploy Frontend on Vercel:

Same as Option 1, Step 2, but use Render backend URL in `VITE_API_URL`

---

## 📝 Pre-Deployment Checklist

### Backend:
- [ ] All environment variables set
- [ ] CORS configured for production domain
- [ ] Knowledge base ingested (`npm run ingest`)
- [ ] Health check endpoint working
- [ ] Rate limiting configured

### Frontend:
- [ ] `VITE_API_URL` set to production backend URL
- [ ] Build works: `npm run build`
- [ ] No hardcoded localhost URLs

---

## 🔧 Configuration Files

### Create `backend/vercel.json` (if using Vercel serverless):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Create `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🚀 Quick Deploy Commands

### Frontend (Vercel):
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Backend (Railway):
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

---

## 🔍 Post-Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend.railway.app/api/health
   ```

2. **Test Frontend:**
   - Open your Vercel URL
   - Check browser console for errors
   - Test a chat message

3. **Verify:**
   - [ ] Backend health check works
   - [ ] Frontend loads correctly
   - [ ] Chat messages send/receive
   - [ ] Streaming responses work
   - [ ] CORS errors resolved

---

## 🐛 Common Issues

### CORS Errors:
- Add Vercel URL to backend CORS origins
- Check `Access-Control-Allow-Origin` headers

### Environment Variables Not Loading:
- Redeploy after adding variables
- Check variable names match exactly

### Backend Not Found:
- Verify backend URL in `VITE_API_URL`
- Check backend is running and accessible

### Knowledge Base Empty:
- Run `npm run ingest` on backend
- Check Qdrant connection

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app/
- Render Docs: https://render.com/docs

---

## 💡 Pro Tips

1. **Use Railway for Backend**: Better for long-running processes and streaming
2. **Use Vercel for Frontend**: Perfect for React/Vite apps
3. **Set up Custom Domain**: Add your domain in Vercel settings
4. **Enable Analytics**: Track usage in Vercel dashboard
5. **Monitor Backend**: Use Railway/Render logs to debug issues

