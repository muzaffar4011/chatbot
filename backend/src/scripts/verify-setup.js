import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeVectorDB, getCollectionStats } from '../services/vector-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from backend directory
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

async function verifySetup() {
  console.log('🔍 Verifying setup...\n');

  // Check environment variables
  console.log('📋 Checking environment variables...');
  const requiredVars = ['OPENROUTER_API_KEY'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   Please create backend/.env file with OPENROUTER_API_KEY');
    process.exit(1);
  }
  
  // Check Qdrant URL
  const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
  console.log(`📦 Qdrant URL: ${qdrantUrl}`);
  
  if (process.env.QDRANT_API_KEY) {
    console.log('   ✅ Using Qdrant Cloud (API key provided)');
    if (!qdrantUrl.startsWith('https://')) {
      console.warn('   ⚠️  Warning: Cloud URL should start with https://');
    }
  } else if (qdrantUrl.startsWith('https://')) {
    console.warn('   ⚠️  Warning: Cloud URL detected but no API key provided');
    console.warn('   Add QDRANT_API_KEY to your .env file');
  } else {
    console.log('   📍 Using local Qdrant (make sure it\'s running)');
  }
  
  console.log('✅ Environment variables configured\n');

  // Check vector database
  console.log('💾 Checking vector database...');
  try {
    await initializeVectorDB();
    const stats = await getCollectionStats();
    
    if (stats.count === 0) {
      console.warn('⚠️  Vector database is empty!');
      console.warn('   Run: npm run ingest');
      process.exit(1);
    }
    
    console.log(`✅ Vector database has ${stats.count} documents\n`);
  } catch (error) {
    console.error('❌ Error accessing vector database:', error.message);
    console.error('   Make sure to run: npm run ingest');
    process.exit(1);
  }

  console.log('✅ Setup verification complete!');
  console.log('🚀 You can now start the server with: npm run dev');
  process.exit(0);
}

verifySetup();

