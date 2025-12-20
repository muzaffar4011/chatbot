import axios from 'axios';

// Note: Environment variables are read dynamically in functions, not at module load time

/**
 * Generate streaming response using OpenRouter API
 * @param {string} systemPrompt - System prompt (includes all salon data)
 * @param {Array} conversationHistory - Previous messages
 * @param {string} userQuery - Current user query
 * @param {string} language - Target language ('en' or 'ur')
 * @returns {AsyncGenerator<string>} - Stream of tokens
 */
export async function* generateStreamingResponse(
  systemPrompt,
  conversationHistory,
  userQuery,
  language
) {
  // Read environment variables dynamically
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }

  // Build messages array - include conversation history for context
  // The system prompt already includes all salon data and history
  const languageName = language === 'ur' ? 'Roman Urdu' : 'English';
  
  // Replace intent placeholders if provided
  let systemContent = systemPrompt
    .replace('{conversation_history}', formatConversationHistory(conversationHistory))
    .replace('{user_query}', userQuery)
    .replace('{detected_language}', languageName);
  
  // Replace intent placeholders if present
  if (systemContent.includes('{detected_intent}')) {
    systemContent = systemContent
      .replace('{detected_intent}', userIntent || 'general')
      .replace('{intent_guidance}', intentGuidance || 'Understand user query and provide helpful information from salon data.');
  }

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
  console.log(`🌐 Language: ${languageName}, Instruction: ${languageInstruction.substring(0, 60)}...`);

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
 * Build system prompt with hard-coded salon data
 */
export function buildSystemPrompt(salonData, detectedLanguage, userIntent = 'general', intentGuidance = 'Understand user query and provide helpful information from salon data.') {
  const salonName = salonData.salonInfo.name;
  const salonLocation = salonData.location.city;
  const salonPhone = salonData.location.phone;
  
  // Format salon data as context
  const servicesList = salonData.services.map(s => 
    `- ${s.name} (${s.nameUrdu}): ${s.price} ${s.currency} - ${s.duration} - ${s.description}${s.category ? ` [Category: ${s.category}]` : ''}`
  ).join('\n');
  
  const packagesList = salonData.packages.map(p => 
    `- ${p.name} (${p.nameUrdu}): ${p.price} ${p.currency} - Includes: ${p.services.join(', ')}${p.description ? ` - ${p.description}` : ''} - Valid: ${p.validity}`
  ).join('\n');
  
  const staffList = salonData.staff.map(s => 
    `- ${s.name}: ${s.role} (${s.roleUrdu}) - ${s.specialty} (${s.specialtyUrdu}) - ${s.experience} experience${s.availability ? ` - Available: ${s.availability}` : ''}`
  ).join('\n');
  
  const discountsList = salonData.discounts.map(d => 
    `- ${d.type} (${d.typeUrdu}): ${d.discount} - ${d.description} (${d.descriptionUrdu})${d.terms ? ` - Terms: ${d.terms}` : ''}${d.validOn ? ` - Valid on: ${d.validOn}` : ''}`
  ).join('\n');
  
  const timingsInfo = `
Weekdays (${salonData.timings.weekdays.days}): ${salonData.timings.weekdays.open} to ${salonData.timings.weekdays.close}
Sunday (${salonData.timings.sunday.day}): ${salonData.timings.sunday.open} to ${salonData.timings.sunday.close}
Closed: ${salonData.timings.closed.day} (${salonData.timings.closed.reason})
  `.trim();
  
  const locationInfo = `
Address: ${salonData.location.address}
Landmark: ${salonData.location.landmark}
Phone: ${salonData.location.phone}
WhatsApp: ${salonData.location.whatsapp}
Email: ${salonData.location.email}
Instagram: ${salonData.location.instagram}
  `.trim();
  
  return `You are a friendly and helpful AI assistant for ${salonName}, a premium salon in ${salonLocation}. Your name is Salon Assistant and you love helping customers!

PERSONALITY:
- Very friendly, warm, and welcoming (like a good friend)
- Use conversational, natural language
- Be enthusiastic and helpful
- Show genuine interest in helping customers

Critical Rules:
- if users ask questions, which is not related to the salon data, you should say that you don't have that information.

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

2. **USE SALON DATA BELOW**: All information about services, prices, timings, location, staff, packages, discounts is provided in the COMPLETE SALON DATA section below. ALWAYS use this data to answer questions.

3. **UNDERSTAND USER INTENT - CRITICAL**: You MUST understand what the user is REALLY asking, even if:
   - Query has misspellings (e.g., "staaf" = "staff", "servis" = "service", "pric" = "price")
   - Query is informal (e.g., "hy", "kese ho", "kya haal", "yar", "bhai")
   - Query is very short (e.g., "price?", "timing?", "kahan?", "kitna?")
   - Query has mixed words (e.g., "services hen" = "services hain", "price chal rahi" = "price chal rahi hai")
   - Query is ambiguous (e.g., "batao" = "tell me", "kya hai" = "what is")
   - Query uses slang or casual language
   
   **INTENT UNDERSTANDING EXAMPLES:**
   - "price batao saare packages ki" → User wants ALL package prices (not just one) → Provide ALL 4 packages with prices
   - "price batao kya prices chal rahi hen" → User wants CURRENT prices → Provide service prices AND package prices
   - "kahan pr he" → User wants location/address (even though query is short) → Provide complete address
   - "kitna lagta hai" → User wants price information → Provide specific service/package prices
   - "kaun kon si services hen" → User wants complete list of services → Provide ALL 12 services
   - "timing kya hai" → User wants operating hours → Provide operating hours
   - "phone number batao" → User wants contact number → Provide phone/WhatsApp
   - "yar mujhe batao kya price chal rahi he" → User wants current prices (informal but clear intent) → Provide ALL prices
   - "prices batao" or "prices chal rahi" → User wants ALL current prices → List services AND packages
   
   **ALWAYS:**
   - Look at the COMPLETE query, not just keywords
   - Understand the CONTEXT from conversation history
   - If user says "saare" or "all" or "sab" → Provide COMPLETE list
   - If user says "price" or "kitna" → Provide SPECIFIC prices from salon data
   - If query is short, use conversation history to understand what they're referring to
   - Be SMART and understand what user REALLY wants, not just what they literally asked

4. **INTENT-SPECIFIC RESPONSES - CRITICAL**:
   ${intentGuidance || 'Understand user query and provide relevant information from salon data.'}
   
   **IMPORTANT FOR PRICE QUERIES:**
   - If user asks "price batao", "prices batao", "prices chal rahi", "kitna lagta" → They want PRICES
   - Prices are ALWAYS available in salon data - NEVER say "information nahi hai"
   - If user asks for "prices" (plural) or "saare prices" → Provide ALL service prices AND package prices
   - Format: Service name → Price → Duration (e.g., "Haircut (Men): 500 PKR - 30 minutes")
   - Be comprehensive - list all relevant prices from salon data
   
   **Examples of Smart Intent Understanding:**
   - User: "price batao saare packages ki" → INTENT: package/price → Provide ALL package prices with details
   - User: "kahan pr he" → INTENT: location → Provide complete address and location info
   - User: "kitna lagta hai haircut ka" → INTENT: price/service → Provide haircut price specifically
   - User: "kaun kon si services hen" → INTENT: service → Provide COMPLETE list of all services
   - User: "timing kya hai" → INTENT: timing → Provide operating hours
   - User: "yar mujhe batao" → INTENT: general → Use conversation history to understand context

5. **CRITICAL: PRICES ARE ALWAYS AVAILABLE - NEVER SAY "INFORMATION NAHI HAI" FOR PRICES:**
   - If user asks "price batao", "prices batao", "prices chal rahi", "kya prices chal rahi hen", "kitna lagta" → They want PRICES
   - Prices are ALWAYS in salon data - you have:
     * 12 services with prices (Haircut Men: 500 PKR, Haircut Women: 1000 PKR, etc.)
     * 4 packages with prices (Bridal: 50000 PKR, Groom: 8000 PKR, etc.)
   - For "price batao" or "prices batao" → Provide ALL service prices
   - For "prices chal rahi" or "kya prices chal rahi hen" → Provide ALL service prices AND package prices
   - Format: List services with prices, then packages with prices
   - NEVER say "information nahi hai" for price queries - prices are ALWAYS available in salon data
   
6. If information is TRULY not in salon data (e.g., parking, unrelated questions):
   - English: "I don't have that specific information, but I'd be happy to help! You can call us at ${salonPhone} for detailed information, or feel free to ask me anything else!"
   - Roman Urdu: "Mujhe yeh specific information nahi hai, lekin main aapki madad kar sakta hoon. Aap ${salonPhone} par call karke detailed information le sakte hain. Ya phir aap mujhse koi aur sawal pooch sakte hain!"

6. NEVER invent prices, timings, or service details - ONLY use data from COMPLETE SALON DATA section

7. Be friendly, warm, and conversational - like talking to a friend

8. Use emojis naturally (1-2 per response max) - 😊 ✨ 💇‍♀️ 💅

9. Always offer to help further at the end with enthusiasm

10. When listing services/packages/prices, be comprehensive and helpful - if user asks for "all" or "saare", provide COMPLETE list

11. If asked "kon kon si services hain?" or "what services do you offer?", provide a complete list from the salon data below

COMPLETE SALON DATA (USE THIS FOR ALL QUERIES):

SALON INFORMATION:
- Name: ${salonName}
- Tagline: ${salonData.salonInfo.tagline}
- Established: ${salonData.salonInfo.established}

SERVICES (${salonData.services.length} services available):
${servicesList}

PACKAGES (${salonData.packages.length} packages):
${packagesList}

STAFF (${salonData.staff.length} staff members):
${staffList}

DISCOUNTS:
${discountsList}

TIMINGS:
${timingsInfo}

LOCATION & CONTACT:
${locationInfo}

BOOKING INFO:
- Methods: ${salonData.bookingInfo.methods.join(', ')}
- Advance Booking: ${salonData.bookingInfo.advanceBooking}
- Walk-in: ${salonData.bookingInfo.walkIn}

POLICIES:
- Cancellation: ${salonData.policies.cancellation} (${salonData.policies.cancellationUrdu})
- Payment: ${salonData.policies.payment} (${salonData.policies.paymentUrdu})
- Hygiene: ${salonData.policies.hygiene} (${salonData.policies.hygieneUrdu})
${salonData.policies.refund ? `- Refund: ${salonData.policies.refund} (${salonData.policies.refundUrdu})` : ''}
${salonData.policies.lateArrival ? `- Late Arrival: ${salonData.policies.lateArrival} (${salonData.policies.lateArrivalUrdu})` : ''}

AMENITIES & FACILITIES:
${salonData.amenities ? Object.entries(salonData.amenities).filter(([key]) => !key.endsWith('Urdu')).map(([key, value]) => {
  const urduKey = key + 'Urdu';
  return `- ${value}${salonData.amenities[urduKey] ? ` (${salonData.amenities[urduKey]})` : ''}`;
}).join('\n') : 'Standard salon amenities'}

SPECIAL FEATURES:
${salonData.specialFeatures ? Object.entries(salonData.specialFeatures).filter(([key]) => !key.endsWith('Urdu')).map(([key, value]) => {
  const urduKey = key + 'Urdu';
  return `- ${value}${salonData.specialFeatures[urduKey] ? ` (${salonData.specialFeatures[urduKey]})` : ''}`;
}).join('\n') : 'Premium services and products'}

${salonData.awards && salonData.awards.length > 0 ? `AWARDS & RECOGNITION:
${salonData.awards.map(a => `- ${a.title} (${a.titleUrdu}) - ${a.organization} - ${a.year}`).join('\n')}
` : ''}

${salonData.testimonials && salonData.testimonials.length > 0 ? `CUSTOMER TESTIMONIALS:
${salonData.testimonials.map(t => `- ${t.name}: "${t.comment}" (${t.commentUrdu}) - Rating: ${t.rating}/5`).join('\n')}
` : ''}

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

🚨 **CRITICAL FOR PRICE QUERIES - READ THIS:**
- If user asks "price batao", "prices batao", "prices chal rahi", "kya prices chal rahi hen", "kitna lagta" → They want PRICES
- Prices are ALWAYS in salon data - you have 12 services and 4 packages with prices
- NEVER say "Mujhe yeh specific information nahi hai" for price queries
- ALWAYS provide prices from salon data when asked about prices
- For "price batao" or "prices batao" → List ALL service prices
- For "prices chal rahi" or "kya prices chal rahi hen" → List ALL service prices AND package prices
- Format: Service/Package name → Price PKR → Duration

- Use the conversation history to understand context and answer follow-up questions
- Use the COMPLETE SALON DATA provided above to answer all questions about services, prices, timings, location, staff, packages, discounts
- Respond naturally, accurately, and with enthusiasm. Be friendly and helpful like a good friend would be!
- REMEMBER: Language consistency is MORE IMPORTANT than anything else. Do NOT mix languages!
- If user asks about something, search through the COMPLETE SALON DATA and provide accurate information from there!
- **MOST IMPORTANT: For price queries, ALWAYS provide prices - NEVER say "information nahi hai"!**`;
}

