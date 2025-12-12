import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from backend directory
const envPath = path.resolve(__dirname, '../../.env');

console.log('🔍 Checking environment configuration...\n');
console.log(`📁 Looking for .env file at: ${envPath}\n`);

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.error(`   Expected location: ${envPath}`);
  console.error('\n💡 Solution:');
  console.error('   1. Copy env.example to .env:');
  console.error('      cp env.example .env');
  console.error('   2. Edit .env and add your API keys');
  process.exit(1);
}

console.log('✅ .env file found\n');

// Load environment variables
dotenv.config({ path: envPath });

// Check required variables
const requiredVars = {
  'OPENROUTER_API_KEY': 'OpenRouter API key for embeddings and LLM',
  'QDRANT_URL': 'Qdrant database URL (optional, defaults to localhost)',
  'QDRANT_API_KEY': 'Qdrant API key (optional, for cloud)'
};

console.log('📋 Checking environment variables:\n');

let allGood = true;

for (const [varName, description] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  if (value) {
    // Mask the key for security
    const masked = varName.includes('KEY') 
      ? (value.length > 10 ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}` : '***')
      : value;
    console.log(`   ✅ ${varName}: ${masked}`);
  } else {
    if (varName === 'OPENROUTER_API_KEY') {
      console.error(`   ❌ ${varName}: NOT SET (REQUIRED)`);
      allGood = false;
    } else {
      console.log(`   ⚠️  ${varName}: Not set (${description})`);
    }
  }
}

console.log('');

if (!allGood) {
  console.error('❌ Missing required environment variables!');
  console.error('\n💡 Solution:');
  console.error('   1. Open backend/.env file');
  console.error('   2. Add your OPENROUTER_API_KEY');
  console.error('   3. Format: OPENROUTER_API_KEY=sk-or-v1-your-key-here');
  console.error('   4. Make sure there are NO spaces around the = sign');
  console.error('   5. Make sure there are NO quotes around the value');
  process.exit(1);
}

console.log('✅ All required environment variables are set!');
console.log('\n🚀 You can now run: npm run ingest');

