# ⚡ Quick Deploy Guide

## 🎯 Recommended Setup: Frontend (Vercel) + Backend (Railway)

### Step 1: Deploy Backend on Railway (5 min)

1. Go to https://railway.app/ → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. **Settings:**
   - Root Directory: `backend`
   - Start Command: `npm start`
5. **Add Environment Variables:**
   ```
   PORT=3001
   NODE_ENV=production
   OPENROUTER_API_KEY=your_key
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_key
   SALON_NAME=Premium Salon
   SALON_LOCATION=Karachi
   SALON_PHONE=+92-300-1234567
   SALON_WHATSAPP=+92-300-1234567
   ```
6. **Deploy** → Copy your Railway URL
7. **Run Ingestion:** Railway Dashboard → Shell → `npm run ingest`

### Step 2: Deploy Frontend on Vercel (5 min)

1. Go to https://vercel.com/ → Sign up with GitHub
2. **Add New Project** → Import your repo
3. **Configure:**
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`
4. **Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
5. **Deploy** → Done!

### Step 3: Update CORS

In Railway, add environment variable:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

Railway will auto-redeploy.

---

## ✅ Test Your Deployment

1. **Backend Health:** `https://your-backend.railway.app/api/health`
2. **Frontend:** Open your Vercel URL
3. **Test Chat:** Send "hy" and "kon kon si services hain?"

---

## 📚 Full Guides

- **Detailed Guide**: See `DEPLOYMENT.md`
- **Step-by-Step**: See `DEPLOY_STEPS.md`
- **Quick Reference**: See `VERCEL_DEPLOY.md`

---

## 🆓 Free Tier Limits

- **Vercel**: Unlimited deployments, 100GB bandwidth
- **Railway**: $5 free credit/month (enough for small apps)
- **Qdrant Cloud**: 1GB free storage

---

## 💡 Pro Tips

1. Use Railway for backend (better for streaming)
2. Use Vercel for frontend (perfect for React)
3. Set up custom domains for professional look
4. Monitor usage in both dashboards
5. Keep environment variables secure

