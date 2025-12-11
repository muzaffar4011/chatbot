# 🚀 Step-by-Step Vercel Deployment

## Quick Deploy (15 Minutes)

### Part 1: Deploy Backend (Railway - Free)

1. **Go to**: https://railway.app/
2. **Sign up** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**
5. **Settings:**
   - Root Directory: `backend`
   - Build Command: (leave empty)
   - Start Command: `npm start`

6. **Add Environment Variables:**
   - Click on your service → **Variables** tab
   - Add all from `backend/.env`:
     ```
     PORT=3001
     NODE_ENV=production
     OPENROUTER_API_KEY=your_key
     QDRANT_URL=your_url
     QDRANT_API_KEY=your_key
     SALON_NAME=Premium Salon
     SALON_LOCATION=Karachi
     SALON_PHONE=+92-300-1234567
     SALON_WHATSAPP=+92-300-1234567
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

7. **Deploy** → Wait for deployment
8. **Copy your Railway URL**: `https://your-app.railway.app`

9. **Run Knowledge Base Ingestion:**
   - Railway Dashboard → Your Service → **Shell** tab
   - Run: `npm run ingest`
   - Wait for: `✅ Successfully ingested X documents!`

---

### Part 2: Deploy Frontend (Vercel - Free)

#### Option A: Using Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to**: https://vercel.com/
3. **Sign up/Login** with GitHub
4. **Click "Add New Project"**
5. **Import your GitHub repository**
6. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

7. **Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://your-backend.railway.app
     ```

8. **Click "Deploy"**
9. **Wait for deployment** (2-3 minutes)
10. **Done!** Your app is live at `https://your-project.vercel.app`

#### Option B: Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

When asked:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing? **No**
- Project name: `salon-rag-frontend`
- Directory: `./frontend`
- Override settings? **No**

Then add environment variable:
```bash
vercel env add VITE_API_URL
# Enter: https://your-backend.railway.app
```

Deploy:
```bash
vercel --prod
```

---

### Part 3: Update CORS

1. **Get your Vercel frontend URL**
2. **Update Railway Environment Variables:**
   - Add/Update: `FRONTEND_URL=https://your-frontend.vercel.app`
3. **Redeploy backend** (Railway auto-redeploys on env change)

---

## ✅ Verification

1. **Test Backend:**
   ```bash
   curl https://your-backend.railway.app/api/health
   ```
   Should return: `{"status":"healthy"}`

2. **Test Frontend:**
   - Open your Vercel URL
   - Open browser console (F12)
   - Check for errors
   - Try sending a message

3. **Test Chat:**
   - Type: "hy"
   - Should get a friendly response
   - Type: "kon kon si services hain?"
   - Should get services list

---

## 🔧 Troubleshooting

### Frontend shows "Cannot connect to backend"
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend URL is correct
- Check backend is running (Railway dashboard)

### CORS Error
- Update `FRONTEND_URL` in Railway with your Vercel URL
- Redeploy backend
- Check browser console for exact error

### Backend 404
- Verify Railway service is running
- Check Railway logs for errors
- Verify PORT is set correctly

### Knowledge Base Empty
- Run `npm run ingest` in Railway Shell
- Check Qdrant connection
- Verify QDRANT_URL and QDRANT_API_KEY

---

## 📱 Custom Domain (Optional)

### Vercel:
1. Go to Project → Settings → Domains
2. Add your domain
3. Follow DNS setup instructions

### Railway:
1. Go to Service → Settings → Networking
2. Add custom domain
3. Update DNS records

---

## 🎉 You're Live!

Your chatbot is now deployed and accessible worldwide!

**Frontend**: `https://your-project.vercel.app`  
**Backend**: `https://your-app.railway.app`

