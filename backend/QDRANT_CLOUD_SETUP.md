# Qdrant Cloud Setup Guide

Qdrant Cloud offers a free tier that's perfect for getting started! No need to run Docker or manage infrastructure.

## Step 1: Sign Up for Qdrant Cloud

1. Go to https://cloud.qdrant.io/
2. Click "Sign Up" or "Get Started"
3. Create your account (free tier available)

## Step 2: Create a Cluster

1. After signing in, click "Create Cluster"
2. Choose the **Free Tier** (1GB storage, perfect for development)
3. Select your preferred region
4. Give your cluster a name (e.g., "salon-rag-bot")
5. Click "Create"

## Step 3: Get Your Credentials

Once your cluster is created:

1. Click on your cluster name
2. Go to the "API Keys" section
3. Create a new API key (or use the default one)
4. Copy the following:
   - **Cluster URL**: Something like `https://xxxxx-xxxxx.us-east-1-0.aws.cloud.qdrant.io`
   - **API Key**: A long string starting with your key

## Step 4: Configure Your Application

1. Open `backend/.env` file
2. Add your Qdrant Cloud credentials:

```env
QDRANT_URL=https://your-cluster-url.qdrant.io
QDRANT_API_KEY=your-api-key-here
```

**Example:**
```env
QDRANT_URL=https://abc123-def456.us-east-1-0.aws.cloud.qdrant.io
QDRANT_API_KEY=your-actual-api-key-string-here
```

## Step 5: Verify Connection

Test if your connection works:

```bash
cd backend
npm run verify
```

You should see:
```
✅ Connected to existing Qdrant collection
```

## Step 6: Ingest Knowledge Base

```bash
npm run ingest
```

This will populate your Qdrant Cloud cluster with the salon knowledge base.

## Step 7: Start Your Server

```bash
npm run dev
```

## Benefits of Qdrant Cloud

✅ **No Infrastructure Management** - No Docker, no servers to manage  
✅ **Free Tier Available** - 1GB storage, perfect for development  
✅ **Scalable** - Easy to upgrade as you grow  
✅ **Global CDN** - Fast access from anywhere  
✅ **Automatic Backups** - Your data is safe  
✅ **Monitoring Dashboard** - Track usage and performance  

## Free Tier Limits

- **Storage**: 1GB
- **Collections**: Unlimited
- **Requests**: Generous free tier
- **Perfect for**: Development, small to medium projects

## Upgrading (When Needed)

When you outgrow the free tier:
1. Go to your cluster dashboard
2. Click "Upgrade"
3. Choose a plan that fits your needs
4. No code changes needed!

## Troubleshooting

**"Connection refused" or "Unauthorized"**
- Double-check your `QDRANT_URL` - should start with `https://`
- Verify your `QDRANT_API_KEY` is correct
- Make sure there are no extra spaces in your `.env` file

**"Cluster not found"**
- Verify the cluster URL is correct
- Check if the cluster is active in the Qdrant Cloud dashboard

**"Rate limit exceeded"**
- Free tier has rate limits
- Consider upgrading if you need higher limits
- Or implement request throttling in your app

## Need Help?

- Qdrant Cloud Docs: https://qdrant.tech/documentation/cloud/
- Support: https://qdrant.tech/contact/
- Community: https://qdrant.tech/community/

