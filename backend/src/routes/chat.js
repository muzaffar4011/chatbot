import express from 'express';
import { detectLanguage, getLanguageFromHistory } from '../utils/language-detection.js';
import { generateStreamingResponse, buildSystemPrompt } from '../services/llm.js';
import { SALON_KNOWLEDGE_BASE } from '../data/salonData.js';
import { detectUserIntent, expandQueryWithIntent, getIntentGuidance } from '../utils/intent-understanding.js';

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
      messageCount: 0,
      preferredLanguage: 'en' // Default to English
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
  const { message, sessionId, preferredLanguage } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const session = getSession(sid);

  // Update preferred language if provided
  if (preferredLanguage === 'en' || preferredLanguage === 'ur') {
    session.preferredLanguage = preferredLanguage;
    console.log(`🌐 User preferred language set to: ${preferredLanguage}`);
  }

  // Debug: Log session info
  console.log(`💬 Session: ${sid}, History length: ${session.conversationHistory.length}, Message: ${message.substring(0, 50)}...`);

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

    // Use preferred language (always set, no auto-detect)
    const detectedLanguage = session.preferredLanguage || 'en';
    console.log(`✅ Using user preferred language: ${detectedLanguage}`);
    console.log(`🌐 Final language: ${detectedLanguage} for query: "${sanitizedMessage.substring(0, 50)}"`);

    // Add user message to history
    session.conversationHistory.push({
      role: 'user',
      content: sanitizedMessage
    });

    // Detect user intent for better understanding
    const userIntent = detectUserIntent(sanitizedMessage, session.conversationHistory);
    const intentGuidance = getIntentGuidance(userIntent);
    
    console.log(`🔍 Query: "${sanitizedMessage}"`);
    console.log(`🌐 Language: ${detectedLanguage}`);
    console.log(`🎯 Intent: ${userIntent}`);
    console.log(`💡 Guidance: ${intentGuidance.substring(0, 80)}...`);

    // Set up SSE headers BEFORE any processing
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for SSE

    // Send session ID immediately
    try {
      res.write(`data: ${JSON.stringify({ type: 'session', sessionId: sid })}\n\n`);
    } catch (writeError) {
      console.error('Error writing session ID:', writeError);
      return;
    }

    // Build system prompt with hard-coded salon data and intent understanding
    let systemPrompt;
    try {
      systemPrompt = buildSystemPrompt(
        SALON_KNOWLEDGE_BASE,
        detectedLanguage,
        userIntent,
        intentGuidance
      );
    } catch (error) {
      console.error('Error building system prompt:', error);
      const errorMessage = detectedLanguage === 'ur'
        ? 'Maaf kijiye, kuch technical issue ho gaya hai. Kya aap dobara try kar sakte hain?'
        : 'Sorry, there was a technical issue. Could you please try again?';
      
      res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
      return;
    }

    // Generate streaming response using hard-coded data (no vector search needed)
    let fullResponse = '';
    try {
      for await (const token of generateStreamingResponse(
        systemPrompt,
        session.conversationHistory.slice(0, -1), // Exclude current user message
        sanitizedMessage,
        detectedLanguage,
        userIntent,
        intentGuidance
      )) {
        fullResponse += token;
        try {
          res.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
        } catch (writeError) {
          console.error('Error writing token:', writeError);
          // Client disconnected, stop streaming
          break;
        }
      }

      // Send completion signal
      try {
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
      } catch (endError) {
        console.error('Error ending response:', endError);
      }

      // Add assistant response to history
      if (fullResponse) {
        session.conversationHistory.push({
          role: 'assistant',
          content: fullResponse
        });

        // Keep only last 10 message pairs
        if (session.conversationHistory.length > 20) {
          session.conversationHistory = session.conversationHistory.slice(-20);
        }
      }

    } catch (error) {
      console.error('Error in streaming response:', error);
      console.error('Error stack:', error.stack);
      const errorMessage = detectedLanguage === 'ur'
        ? 'Maaf kijiye, kuch technical issue ho gaya hai. Kya aap dobara try kar sakte hain?'
        : 'Sorry, there was a technical issue. Could you please try again?';
      
      try {
        res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
      } catch (endError) {
        console.error('Error sending error response:', endError);
      }
    }

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    console.error('Error stack:', error.stack);
    
    // Check if headers already sent (SSE started)
    if (res.headersSent) {
      // Already started SSE, send error via SSE
      try {
        const errorMessage = 'Sorry, there was a technical issue. Could you please try again?';
        res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
      } catch (endError) {
        console.error('Error sending error response:', endError);
      }
    } else {
      // Headers not sent yet, send JSON error
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
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

