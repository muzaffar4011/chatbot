import axios from 'axios';

/**
 * Generate embeddings using OpenRouter API
 * @param {string|Array<string>} texts - Text(s) to embed
 * @returns {Promise<Array<Array<number>>>} - Embedding vectors
 */
export async function generateEmbeddings(texts) {
  // Read environment variables dynamically (not at module load time)
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }

  const textArray = Array.isArray(texts) ? texts : [texts];

  try {
    // Using text-embedding-3-small model via OpenRouter
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/embeddings`,
      {
        model: 'openai/text-embedding-3-small',
        input: textArray
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3001',
          'X-Title': 'Salon RAG Bot'
        }
      }
    );

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from OpenRouter embeddings API');
    }

    // Extract embeddings
    const embeddings = response.data.data
      .sort((a, b) => a.index - b.index)
      .map(item => item.embedding);

    return Array.isArray(texts) ? embeddings : embeddings[0];
  } catch (error) {
    console.error('❌ Error generating embeddings:', error.response?.data || error.message);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

/**
 * Generate embedding for a single text
 * @param {string} text - Text to embed
 * @returns {Promise<Array<number>>} - Embedding vector
 */
export async function generateEmbedding(text) {
  const embeddings = await generateEmbeddings([text]);
  return embeddings[0];
}

