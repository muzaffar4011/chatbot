# 🚀 Quick Vercel Deployment Guide

## Frontend on Vercel (5 Minutes)

### Method 1: Using Vercel Dashboard (Easiest)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Go to Vercel**: https://vercel.com/
3. **Sign up/Login** with GitHub
4. **Click "Add New Project"**
5. **Import your GitHub repository**
6. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

7. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app` (or your backend URL)

8. **Click Deploy**

9. **Done!** Your frontend is live at `https://your-project.vercel.app`

### Method 2: Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Follow prompts and add `VITE_API_URL` when asked.

---

## Backend Deployment Options

### Option A: Railway (Recommended - Free Tier)

1. **Sign up**: https://railway.app/
2. **New Project** → **Deploy from GitHub**
3. **Select your repo**
4. **Settings:**
   - Root Directory: `backend`
   - Start Command: `npm start`

5. **Add Environment Variables:**
   - All variables from `backend/.env`

6. **Deploy** → Get your backend URL

7. **Run Ingestion:**
   - Railway Dashboard → Your Service → **Shell**
   - Run: `npm run ingest`

### Option B: Render (Free Tier)

1. **Sign up**: https://render.com/
2. **New** → **Web Service**
3. **Connect GitHub**
4. **Configure:**
   - Name: `salon-rag-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`

5. **Add Environment Variables**
6. **Deploy**

---

## Update CORS

After getting your frontend URL, update `backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'  // Your Vercel URL
  ],
  credentials: true
}));
```

Then redeploy backend.

---

## Final Steps

1. ✅ Frontend deployed on Vercel
2. ✅ Backend deployed on Railway/Render
3. ✅ Environment variables set
4. ✅ CORS updated
5. ✅ Knowledge base ingested
6. ✅ Test your live app!

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app/
- Check deployment logs if issues occur

