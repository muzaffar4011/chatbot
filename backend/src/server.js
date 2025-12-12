import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat.js';
import { healthRouter } from './routes/health.js';
import { initializeVectorDB } from './services/vector-db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy - required for Render/Railway behind reverse proxy
app.set('trust proxy', 1);

// Initialize vector database on startup
initializeVectorDB().catch((error) => {
  console.error('❌ Failed to initialize vector database:', error);
  console.error('⚠️  Make sure to run: npm run ingest');
});

// Security middleware
app.use(helmet());

// CORS configuration
// In development, always allow localhost. In production, use FRONTEND_URL
const isDevelopment = process.env.NODE_ENV !== 'production';
const productionOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

// Always include localhost for development
const allowedOrigins = isDevelopment
  ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', ...productionOrigins]
  : productionOrigins.length > 0 
    ? productionOrigins 
    : ['http://localhost:5173']; // Fallback if no FRONTEND_URL set

console.log(`🌐 CORS allowed origins: ${allowedOrigins.join(', ')}`);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, always allow localhost variants
    if (isDevelopment && (
      origin.startsWith('http://localhost:') || 
      origin.startsWith('http://127.0.0.1:')
    )) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`⚠️ CORS blocked origin: ${origin}`);
      console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/health', healthRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

