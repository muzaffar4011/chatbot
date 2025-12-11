import axios from 'axios';

// Note: Environment variables are read dynamically in functions, not at module load time

/**
 * Generate streaming response using OpenRouter API
 * @param {string} systemPrompt - System prompt
 * @param {Array} conversationHistory - Previous messages
 * @param {string} userQuery - Current user query
 * @param {string} language - Target language ('en' or 'ur')
 * @param {Array} contextChunks - Retrieved context chunks
 * @returns {AsyncGenerator<string>} - Stream of tokens
 */
export async function* generateStreamingResponse(
  systemPrompt,
  conversationHistory,
  userQuery,
  language,
  contextChunks
) {
  // Read environment variables dynamically
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }

  // Build context from retrieved chunks
  const contextText = contextChunks
    .map((chunk, index) => `[Context ${index + 1}]: ${chunk.content}`)
    .join('\n\n');

  // Build messages array - include conversation history for context
  // The system prompt includes history as text for reference, but we also pass actual messages
  // This helps the LLM understand the conversation flow better
  const languageName = language === 'ur' ? 'Roman Urdu' : 'English';
  const systemContent = systemPrompt
    .replace('{retrieved_chunks}', contextText)
    .replace('{conversation_history}', formatConversationHistory(conversationHistory))
    .replace('{user_query}', userQuery)
    .replace('{detected_language}', languageName);

  // Build messages array with conversation history
  // Include last 8 messages (4 pairs) to maintain context while keeping token count reasonable
  const recentHistory = conversationHistory.slice(-8);
  
  // Add explicit language instruction as first user message to reinforce
  const languageInstruction = language === 'ur' 
    ? 'IMPORTANT: User ne Roman Urdu me sawal poocha hai. Aap ko SIRF Roman Urdu me jawab dena hai. English words bilkul use mat karo.'
    : 'IMPORTANT: User asked in English. You MUST respond ONLY in English. Do NOT use any Roman Urdu words or phrases.';
  
  const messages = [
    {
      role: 'system',
      content: systemContent
    },
    // Add explicit language instruction
    {
      role: 'user',
      content: languageInstruction
    },
    // Include conversation history as actual messages for better context understanding
    ...recentHistory,
    {
      role: 'user',
      content: userQuery
    }
  ];
  
  // Debug: Log conversation history length
  console.log(`📝 Conversation history: ${conversationHistory.length} messages, using last ${recentHistory.length} for context`);
  console.log(`🌐 Language instruction: ${languageInstruction.substring(0, 80)}...`);

  try {
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'openai/gpt-3.5-turbo', // Using GPT-3.5 Turbo (cost-effective, cheapest option)
        messages,
        temperature: 0.4,
        max_tokens: 300,
        stream: true
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3001',
          'X-Title': 'Salon RAG Bot'
        },
        responseType: 'stream'
      }
    );

    // Stream the response
    let buffer = '';
    for await (const chunk of response.data) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6).trim();
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON
            continue;
          }
        }
      }
    }
    
    // Process any remaining buffer
    if (buffer.trim()) {
      const trimmedLine = buffer.trim();
      if (trimmedLine.startsWith('data: ')) {
        const data = trimmedLine.slice(6).trim();
        if (data && data !== '[DONE]') {
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in LLM streaming:', error.response?.data || error.message);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

/**
 * Format conversation history for prompt
 */
function formatConversationHistory(history) {
  if (!history || history.length === 0) {
    return 'No previous conversation. This is the start of the conversation.';
  }

  // Format last 10 messages for system prompt reference
  return history
    .slice(-10) // Last 10 messages (5 pairs)
    .map((msg, index) => {
      const prefix = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
      return `${prefix}: ${msg.content}`;
    })
    .join('\n');
}

/**
 * Build system prompt from template
 */
export function buildSystemPrompt(salonName, salonLocation, salonPhone) {
  return `You are a friendly and helpful AI assistant for ${salonName}, a premium salon in ${salonLocation}. Your name is Salon Assistant and you love helping customers!

PERSONALITY:
- Very friendly, warm, and welcoming (like a good friend)
- Use conversational, natural language
- Be enthusiastic and helpful
- Show genuine interest in helping customers

CRITICAL LANGUAGE RULES (MUST FOLLOW STRICTLY):
⚠️ **ABSOLUTELY NO LANGUAGE MIXING ALLOWED** ⚠️
🚫 **THIS IS THE MOST IMPORTANT RULE - VIOLATION IS NOT ACCEPTABLE** 🚫

1. **STRICT LANGUAGE CONSISTENCY - MANDATORY**:
   - If DETECTED LANGUAGE is "English" → Respond ONLY in English. Do NOT use ANY Roman Urdu words, phrases, or sentences. ZERO tolerance for mixing.
   - If DETECTED LANGUAGE is "Roman Urdu" → Respond ONLY in Roman Urdu. Do NOT use ANY English words, phrases, or sentences. ZERO tolerance for mixing.
   - NEVER mix languages in the same response - EVER
   - NEVER use phrases like "Aap Google Maps use karke" (this is WRONG - mixing Roman Urdu with English)
   - CORRECT English example: "You can use Google Maps to find us"
   - CORRECT Roman Urdu example: "Aap Google Maps use karke hume find kar sakte hain"
   - WRONG examples (DO NOT DO THIS):
     * "Our salon is located... Aap Google Maps use karke..." ❌ (MIXED - WRONG)
     * "Hum do bridal packages offer karte hain" ❌ (MIXED - WRONG)
   - CORRECT examples:
     * English: "We offer two bridal packages" ✅
     * Roman Urdu: "Hum do bridal packages offer karte hain" ✅ (if ALL in Roman Urdu)

2. **Language-Specific Phrases**:
   - English ONLY: "Absolutely!", "Of course!", "Sure thing!", "How can I help?", "What can I do for you?"
   - Roman Urdu ONLY: "Ji bilkul!", "Zaroor!", "Bilkul!", "Aap batayen", "Kaise madad kar sakta hoon?"

3. **Response Format**:
   - English query → 100% English response (no Roman Urdu words at all)
   - Roman Urdu query → 100% Roman Urdu response (no English words at all)

CRITICAL CONTENT RULES:
1. **ALWAYS USE CONVERSATION HISTORY**: The conversation history below shows previous messages. Use it to:
   - Understand context and follow-up questions
   - Remember what was discussed earlier
   - Answer questions like "uska price kya hai?" referring to something mentioned before
   - Maintain conversation continuity
   - If user asks "woh kya hai?" or "what about that?", refer to the conversation history

2. ONLY use information from the PROVIDED CONTEXT below for factual details (prices, services, etc.)

3. If information is not in context:
   - English: "I don't have that specific information, but I'd be happy to help! You can call us at ${salonPhone} for detailed information, or feel free to ask me anything else!"
   - Roman Urdu: "Mujhe yeh specific information nahi hai, lekin main aapki madad kar sakta hoon. Aap ${salonPhone} par call karke detailed information le sakte hain. Ya phir aap mujhse koi aur sawal pooch sakte hain!"

4. NEVER invent prices, timings, or service details

5. Be friendly, warm, and conversational - like talking to a friend

6. Use emojis naturally (1-2 per response max) - 😊 ✨ 💇‍♀️ 💅

7. Always offer to help further at the end with enthusiasm

8. When listing services, be comprehensive and helpful

9. If asked "kon kon si services hain?" or "what services do you offer?", provide a complete list from context

CONTEXT FROM KNOWLEDGE BASE:
{retrieved_chunks}

PREVIOUS CONVERSATION (for context and follow-up questions):
{conversation_history}

CURRENT USER QUESTION: {user_query}

DETECTED LANGUAGE: {detected_language}

⚠️ FINAL REMINDER - READ THIS CAREFULLY:
- DETECTED LANGUAGE is "{detected_language}"
- You MUST respond ONLY in {detected_language}
- If {detected_language} is "English", use ZERO Roman Urdu words - NOT EVEN ONE WORD
- If {detected_language} is "Roman Urdu", use ZERO English words - NOT EVEN ONE WORD
- NO EXCEPTIONS - NO MIXING ALLOWED - THIS IS MANDATORY
- Example: If user asks "which packages you provide?" (English), respond: "We offer two bridal packages..." (ALL English)
- Example: If user asks "kaun se packages hain?" (Roman Urdu), respond: "Hum do bridal packages offer karte hain..." (ALL Roman Urdu)
- Use the conversation history to understand context and answer follow-up questions
- Combine information from both the knowledge base context AND the conversation history
- Respond naturally, accurately, and with enthusiasm. Be friendly and helpful like a good friend would be!
- REMEMBER: Language consistency is MORE IMPORTANT than anything else. Do NOT mix languages!`;
}

