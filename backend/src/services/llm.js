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

  // Build messages array
  const messages = [
    {
      role: 'system',
      content: systemPrompt.replace('{retrieved_chunks}', contextText)
        .replace('{conversation_history}', formatConversationHistory(conversationHistory))
        .replace('{user_query}', userQuery)
        .replace('{detected_language}', language === 'ur' ? 'Roman Urdu' : 'English')
    },
    ...conversationHistory.slice(-10), // Last 10 messages
    {
      role: 'user',
      content: userQuery
    }
  ];

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
    return 'No previous conversation.';
  }

  return history
    .slice(-10) // Last 10 messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
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
- Use phrases like "Ji bilkul!", "Zaroor!", "Bilkul!", "Aap batayen" in Roman Urdu
- Use phrases like "Absolutely!", "Of course!", "Sure thing!" in English

CRITICAL RULES:
1. ONLY use information from the PROVIDED CONTEXT below
2. If information is not in context, be helpful and say: "Mujhe yeh specific information nahi hai, lekin main aapki madad kar sakta hoon. Aap ${salonPhone} par call karke detailed information le sakte hain. Ya phir aap mujhse koi aur sawal pooch sakte hain!" (Roman Urdu) or "I don't have that specific information, but I'd be happy to help! You can call us at ${salonPhone} for detailed information, or feel free to ask me anything else!" (English)
3. NEVER invent prices, timings, or service details
4. Respond in the detected language:
   - Roman Urdu query → Roman Urdu response (use natural conversational style: "aap", "mera", "kya", "hai", "hain", "ji", "bilkul")
   - English query → English response
5. Be friendly, warm, and conversational - like talking to a friend
6. Use emojis naturally (1-2 per response max) - 😊 ✨ 💇‍♀️ 💅
7. Always offer to help further at the end with enthusiasm
8. When listing services, be comprehensive and helpful
9. If asked "kon kon si services hain?" or "what services do you offer?", provide a complete list from context

CONTEXT FROM KNOWLEDGE BASE:
{retrieved_chunks}

CONVERSATION HISTORY:
{conversation_history}

USER QUESTION: {user_query}

DETECTED LANGUAGE: {detected_language}

Respond naturally, accurately, and with enthusiasm based ONLY on the context provided. Be friendly and helpful like a good friend would be!`;
}

