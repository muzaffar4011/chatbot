import { QdrantClient } from '@qdrant/js-client-rest';

let client = null;
let collectionName = 'salon_knowledge_base';

/**
 * Initialize Qdrant client and collection
 */
export async function initializeVectorDB() {
  try {
    const url = process.env.QDRANT_URL || 'http://localhost:6333';
    const apiKey = process.env.QDRANT_API_KEY; // Optional, for cloud

    // Initialize Qdrant client
    const clientConfig = {
      url: url
    };

    if (apiKey) {
      clientConfig.apiKey = apiKey;
    }

    client = new QdrantClient(clientConfig);

    // Check if collection exists, create if not
    try {
      const collectionInfo = await client.getCollection(collectionName);
      console.log('✅ Connected to existing Qdrant collection');
      console.log(`   Collection size: ${collectionInfo.points_count || 0} points`);
    } catch (error) {
      // Collection doesn't exist, create it
      // Get embedding dimension (text-embedding-3-small has 1536 dimensions)
      const vectorSize = 1536;
      
      await client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine'
        }
      });
      console.log('✅ Created new Qdrant collection');
    }

    return { client, collectionName };
  } catch (error) {
    console.error('❌ Error initializing vector database:', error.message);
    
    const url = process.env.QDRANT_URL || 'http://localhost:6333';
    if (url.startsWith('https://')) {
      console.error('   Cloud connection failed. Check:');
      console.error('   - QDRANT_URL is correct (should be your cluster URL)');
      console.error('   - QDRANT_API_KEY is set and valid');
      console.error('   - Your cluster is active in Qdrant Cloud dashboard');
    } else {
      console.error('   Local connection failed. Make sure:');
      console.error('   - Qdrant is running: docker run -p 6333:6333 qdrant/qdrant');
      console.error('   - Or set QDRANT_URL and QDRANT_API_KEY for cloud instance');
    }
    throw error;
  }
}

/**
 * Get the client instance
 */
export function getClient() {
  if (!client) {
    throw new Error('Vector database not initialized. Call initializeVectorDB() first.');
  }
  return client;
}

/**
 * Add documents to vector database
 * @param {Array} documents - Array of document objects with id, content, metadata
 * @param {Array} embeddings - Pre-computed embeddings for documents
 */
export async function addDocuments(documents, embeddings) {
  try {
    const qdrantClient = getClient();
    
    // Prepare points for Qdrant
    // Use hash of document ID for consistent numeric IDs
    const points = documents.map((doc, index) => {
      // Convert string ID to numeric hash for Qdrant
      let numericId;
      if (typeof doc.id === 'string') {
        // Simple hash function to convert string to number
        let hash = 0;
        for (let i = 0; i < doc.id.length; i++) {
          const char = doc.id.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        numericId = Math.abs(hash);
      } else {
        numericId = doc.id;
      }

      return {
        id: numericId,
        vector: embeddings[index],
        payload: {
          id: doc.id,
          content: doc.content,
          ...doc.metadata
        }
      };
    });

    // Upsert points (insert or update)
    await qdrantClient.upsert(collectionName, {
      wait: true,
      points: points
    });

    console.log(`✅ Added ${documents.length} documents to Qdrant`);
    return true;
  } catch (error) {
    console.error('❌ Error adding documents:', error);
    throw error;
  }
}

/**
 * Search for similar documents
 * @param {Array} queryEmbedding - Query embedding vector
 * @param {number} topK - Number of results to return
 * @param {Object} filter - Optional metadata filter
 * @returns {Array} - Array of similar documents with scores
 */
export async function searchSimilar(queryEmbedding, topK = 5, filter = null) {
  try {
    const qdrantClient = getClient();
    
    const searchOptions = {
      vector: queryEmbedding,
      limit: topK,
      with_payload: true
    };

    // Add filter if provided
    if (filter) {
      searchOptions.filter = {
        must: Object.entries(filter).map(([key, value]) => ({
          key: key,
          match: { value: value }
        }))
      };
    }

    const results = await qdrantClient.search(collectionName, searchOptions);

    if (!results || results.length === 0) {
      return [];
    }

    // Format results to match expected structure
    const formattedResults = results.map((result) => {
      const payload = result.payload || {};
      // Remove content from metadata to avoid duplication
      const { content, ...metadata } = payload;
      
      return {
        content: content || '',
        score: 1 - result.score, // Convert similarity to distance (Qdrant returns similarity, 0-1)
        metadata: metadata,
        id: payload.id || result.id
      };
    });

    return formattedResults;
  } catch (error) {
    console.error('❌ Error searching vector database:', error);
    throw error;
  }
}

/**
 * Get collection stats
 */
export async function getCollectionStats() {
  try {
    const qdrantClient = getClient();
    const collectionInfo = await qdrantClient.getCollection(collectionName);
    return { count: collectionInfo.points_count || 0 };
  } catch (error) {
    console.error('❌ Error getting collection stats:', error);
    return { count: 0 };
  }
}
