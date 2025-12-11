import express from 'express';
import { detectLanguage, getLanguageFromHistory } from '../utils/language-detection.js';
import { generateEmbedding } from '../services/embeddings.js';
import { searchSimilar } from '../services/vector-db.js';
import { generateStreamingResponse, buildSystemPrompt } from '../services/llm.js';

export const chatRouter = express.Router();

// In-memory session storage (in production, use Redis)
const sessions = new Map();

// Clean up expired sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > 30 * 60 * 1000) { // 30 minutes
      sessions.delete(sessionId);
    }
  }
}, 30 * 60 * 1000);

/**
 * Initialize or get session
 */
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      conversationHistory: [],
      lastActivity: Date.now(),
      messageCount: 0
    });
  }
  const session = sessions.get(sessionId);
  session.lastActivity = Date.now();
  return session;
}

/**
 * POST /api/chat
 * Main chat endpoint with streaming support
 */
chatRouter.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const session = getSession(sid);

  // Rate limiting per session
  if (session.messageCount >= 20) {
    return res.status(429).json({ 
      error: 'Message limit reached. Please start a new conversation.' 
    });
  }

  session.messageCount++;

  try {
    // Sanitize input
    const sanitizedMessage = sanitizeInput(message.trim());

    // Detect language
    let detectedLanguage = detectLanguage(sanitizedMessage);
    
    // If ambiguous, check conversation history
    if (detectedLanguage === 'en' && session.conversationHistory.length > 0) {
      const historyLanguage = getLanguageFromHistory(session.conversationHistory);
      if (historyLanguage === 'ur') {
        detectedLanguage = 'ur';
      }
    }

    // Add user message to history
    session.conversationHistory.push({
      role: 'user',
      content: sanitizedMessage
    });

    // Generate embedding for query
    let queryEmbedding;
    try {
      queryEmbedding = await generateEmbedding(sanitizedMessage);
    } catch (error) {
      console.error('Error generating embedding:', error);
      const errorMessage = detectedLanguage === 'ur'
        ? 'Maaf kijiye, technical issue ho gaya hai. Kya aap dobara try kar sakte hain?'
        : 'Sorry, there was a technical issue. Could you please try again?';
      return res.status(500).json({ error: errorMessage });
    }

    // Search vector database - get more results for better matching
    let searchResults;
    try {
      searchResults = await searchSimilar(queryEmbedding, 10); // Get top 10 for better matching
    } catch (error) {
      console.error('Error searching vector database:', error);
      const errorMessage = detectedLanguage === 'ur'
        ? 'Maaf kijiye, knowledge base access mein issue hai. Kya aap dobara try kar sakte hain?'
        : 'Sorry, there was an issue accessing the knowledge base. Could you please try again?';
      return res.status(500).json({ error: errorMessage });
    }
    
    // Filter and rank results
    // Qdrant returns similarity (0-1), we convert to distance (1 - similarity)
    // Lower distance = better match
    // Be very lenient - accept almost all results (distance < 1.0 means similarity > 0.0)
    const relevantChunks = searchResults
      .filter(chunk => chunk.score < 1.0) // Very lenient - accept almost all results
      .slice(0, 5); // Get top 5 chunks for better context

    // Calculate average similarity (higher is better)
    // score is distance, so similarity = 1 - score
    const avgSimilarity = relevantChunks.length > 0
      ? relevantChunks.reduce((sum, c) => sum + (1 - c.score), 0) / relevantChunks.length
      : 0;

    // Debug logging
    console.log(`Search results: ${searchResults.length}, Relevant: ${relevantChunks.length}, Avg similarity: ${avgSimilarity.toFixed(2)}`);

    // Build system prompt
    const systemPrompt = buildSystemPrompt(
      process.env.SALON_NAME || 'Premium Salon',
      process.env.SALON_LOCATION || 'Karachi',
      process.env.SALON_PHONE || '+92-300-1234567'
    );

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering

    // Send session ID
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: sid })}\n\n`);

    // Handle low confidence - be more lenient
    // Only show fallback if we have NO results at all
    // Even with low similarity, try to answer from available context
    if (relevantChunks.length === 0) {
      const fallbackMessage = detectedLanguage === 'ur'
        ? `Mujhe yeh specific information nahi hai. Behtar hoga aap hamare number par call karein: ${process.env.SALON_PHONE || '+92-300-1234567'}`
        : `I don't have that specific information. Please call us at ${process.env.SALON_PHONE || '+92-300-1234567'} for accurate details.`;
      
      res.write(`data: ${JSON.stringify({ type: 'token', content: fallbackMessage })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
      
      session.conversationHistory.push({
        role: 'assistant',
        content: fallbackMessage
      });
      return;
    }

    // Generate streaming response
    let fullResponse = '';
    try {
      for await (const token of generateStreamingResponse(
        systemPrompt,
        session.conversationHistory.slice(0, -1), // Exclude current user message
        sanitizedMessage,
        detectedLanguage,
        relevantChunks
      )) {
        fullResponse += token;
        res.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
      }

      // Send completion signal
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();

      // Add assistant response to history
      session.conversationHistory.push({
        role: 'assistant',
        content: fullResponse
      });

      // Keep only last 10 message pairs
      if (session.conversationHistory.length > 20) {
        session.conversationHistory = session.conversationHistory.slice(-20);
      }

    } catch (error) {
      console.error('Error in streaming response:', error);
      const errorMessage = detectedLanguage === 'ur'
        ? 'Maaf kijiye, kuch technical issue ho gaya hai. Kya aap dobara try kar sakte hain?'
        : 'Sorry, there was a technical issue. Could you please try again?';
      
      res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);
      res.end();
    }

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Sanitize user input
 */
function sanitizeInput(input) {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove potential script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove SQL injection patterns (basic)
  sanitized = sanitized.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, '');
  
  // Limit length
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }
  
  return sanitized.trim();
}

