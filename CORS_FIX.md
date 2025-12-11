# 🔧 CORS Issue Fix - "Failed to fetch" Error

## Problem
Frontend se backend ko request nahi ja rahi kyunki backend CORS me frontend URL allow nahi hai.

## Solution - 2 Steps

### Step 1: Backend me Frontend URL Add Karein (Render Dashboard)

1. **Render Dashboard** me jayein: https://dashboard.render.com
2. Apne service ko select karein (`salon-rag-backend`)
3. **Settings** → **Environment** section me jayein
4. **Environment Variable** add karein:

   ```
   Key: FRONTEND_URL
   Value: https://your-frontend-url.vercel.app
   ```

   **Important:** 
   - Agar aapka frontend Vercel pe hai, to Vercel ka URL use karein
   - Agar localhost pe test kar rahe hain, to: `http://localhost:5173`
   - Multiple URLs ke liye comma se separate karein: `https://frontend1.vercel.app,https://frontend2.vercel.app`

5. **Save Changes** click karein
6. Render automatically redeploy karega

### Step 2: Frontend me Backend URL Set Karein (Vercel Dashboard)

1. **Vercel Dashboard** me jayein: https://vercel.com/dashboard
2. Apne project ko select karein
3. **Settings** → **Environment Variables** me jayein
4. **Environment Variable** add/update karein:

   ```
   Key: VITE_API_URL
   Value: https://chatbot-viv6.onrender.com
   ```

   **Important:**
   - URL me trailing slash nahi hona chahiye
   - `https://chatbot-viv6.onrender.com` ✅
   - `https://chatbot-viv6.onrender.com/` ❌

5. **Save** karein
6. **Redeploy** karein (Settings → Deployments → Redeploy)

## Quick Checklist

### Backend (Render):
- [ ] `FRONTEND_URL` = `https://your-frontend.vercel.app` (apna frontend URL)
- [ ] Service redeployed ho gaya

### Frontend (Vercel):
- [ ] `VITE_API_URL` = `https://chatbot-viv6.onrender.com`
- [ ] Project redeployed ho gaya

## Test Karein

1. **Health Check:**
   ```
   https://chatbot-viv6.onrender.com/api/health
   ```
   Browser me open karein - JSON response aana chahiye

2. **Frontend se Test:**
   - Frontend URL open karein
   - Chat me message send karein
   - Ab "Failed to fetch" error nahi aana chahiye

## Common Issues

### Issue 1: Still "Failed to fetch"
- Check browser console (F12) me exact error
- Verify `VITE_API_URL` frontend me correctly set hai
- Verify `FRONTEND_URL` backend me correctly set hai
- Dono services redeploy karein

### Issue 2: CORS Error in Console
- Backend me `FRONTEND_URL` exact frontend URL hona chahiye
- Protocol match karein: `https://` dono jagah
- Trailing slash avoid karein

### Issue 3: 404 Error
- Check API URL: `https://chatbot-viv6.onrender.com/api/chat`
- Browser me manually test karein

## Debug Steps

1. **Browser Console Check:**
   - F12 press karein
   - Console tab me error dekhein
   - Network tab me request check karein

2. **Backend Logs Check:**
   - Render Dashboard → Logs
   - Request aane pe logs dikhne chahiye

3. **Manual API Test:**
   ```bash
   curl -X POST https://chatbot-viv6.onrender.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```

## Example Configuration

### Render Environment Variables:
```
FRONTEND_URL=https://salon-chatbot.vercel.app
PORT=3001
NODE_ENV=production
OPENROUTER_API_KEY=sk-or-v1-...
QDRANT_URL=https://...
QDRANT_API_KEY=...
SALON_NAME=Premium Salon
SALON_LOCATION=Karachi
SALON_PHONE=+92-300-1234567
```

### Vercel Environment Variables:
```
VITE_API_URL=https://chatbot-viv6.onrender.com
```

---

**Note:** Environment variables change karne ke baad **always redeploy** karein!

