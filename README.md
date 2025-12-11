# Salon AI Assistant with RAG

A bilingual (English/Roman Urdu) RAG-based chatbot for salon services, built with React, Node.js, and Qdrant Cloud.

## 🚀 Features

- **RAG-Based Knowledge Retrieval**: Accurate answers from salon knowledge base
- **Bilingual Support**: Automatic language detection (English/Roman Urdu)
- **Streaming Responses**: Real-time token-by-token response display
- **Session Management**: Conversation memory within chat sessions
- **Modern UI**: Responsive chat widget with Tailwind CSS
- **Vector Search**: Semantic search using Qdrant Cloud (free tier available) and embeddings

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- Qdrant Cloud account ([Free tier available](https://cloud.qdrant.io/)) OR Docker for local Qdrant

## 🛠️ Installation

1. **Clone and install dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**

Create `backend/.env` file:
```env
PORT=3001
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
QDRANT_URL=https://your-cluster-url.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key-here
SALON_NAME=Premium Salon
SALON_LOCATION=Karachi
SALON_PHONE=+92-300-1234567
SALON_WHATSAPP=+92-300-1234567
```

**Get Qdrant Cloud credentials:**
1. Sign up at https://cloud.qdrant.io/ (free tier available!)
2. Create a cluster
3. Get your URL and API key
4. Add them to `.env`

**OR use Local Qdrant:**
```env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
```

Then start Qdrant:
```bash
docker-compose up -d
```

Create `frontend/.env` (optional):
```env
VITE_API_URL=http://localhost:3001
```

3. **Ingest knowledge base:**
```bash
cd backend
npm run ingest
```

This will create the vector database with sample salon data.

## 🎯 Usage

1. **Start backend server:**
```bash
npm run dev:backend
```

2. **Start frontend (in another terminal):**
```bash
npm run dev:frontend
```

3. **Open browser:**
Navigate to `http://localhost:5173`

4. **Start chatting:**
Click the chat button in the bottom-right corner and start asking questions!

## 📝 Example Queries

**English:**
- "What services do you offer?"
- "How much does a haircut cost?"
- "What are your operating hours?"

**Roman Urdu:**
- "Hair cut ki price kya hai?"
- "Facial ke liye kya options hain?"
- "Booking kaise karni hai?"

## 🏗️ Project Structure

```
rag_bot/
├── backend/
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # RAG, LLM, embeddings
│   │   ├── utils/         # Language detection
│   │   └── scripts/       # Knowledge base ingestion
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── store/         # State management
│   │   └── App.tsx
│   └── package.json
└── requirements.md
```

## 🔧 Configuration

### Update Salon Information

Edit `backend/src/scripts/ingest-knowledge-base.js` to update:
- Service prices
- Operating hours
- Contact information
- Policies

Then re-run ingestion:
```bash
cd backend
npm run ingest
```

### Customize Chat Widget

Edit `frontend/src/components/ChatWidget.tsx` to customize:
- Colors and styling
- Widget position
- Message appearance

## 📚 API Endpoints

- `POST /api/chat` - Send message and receive streaming response
- `GET /api/health` - Health check endpoint

## 🧪 Testing

Test the chatbot with various queries:
- Service inquiries
- Price questions
- Booking information
- Policy questions
- Off-topic handling

## 🚀 Deployment

**Quick Deploy Guide**: See `DEPLOY_STEPS.md` or `QUICK_DEPLOY.md`

**Recommended Setup:**
- Frontend: Vercel (free tier)
- Backend: Railway or Render (free tier available)
- Vector DB: Qdrant Cloud (free tier)

**Full Deployment Guide**: See `DEPLOYMENT.md`

## 🐛 Troubleshooting

**Vector database not found:**
- Run `npm run ingest` in the backend directory

**API errors:**
- Check that `OPENROUTER_API_KEY` is set correctly
- Verify OpenRouter API is accessible

**Streaming not working:**
- Check browser console for errors
- Verify backend is running on port 3001

**Deployment issues:**
- Check environment variables are set correctly
- Verify CORS is configured for production domain
- Check deployment logs in Vercel/Railway dashboard

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

