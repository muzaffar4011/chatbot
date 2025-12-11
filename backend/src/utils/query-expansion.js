/**
 * Expand query with synonyms and related terms for better search
 * This helps match queries like "kahan pr he" with "location" content
 */

// Common query expansions for salon-related queries
// More comprehensive mappings for better search
const queryExpansions = {
  // Location related - most important for the user's issue
  'kahan': ['location', 'address', 'place', 'where', 'jagah', 'location kya hai', 'address kya hai', 'salon location', 'salon address'],
  'kahan pr': ['location', 'address', 'place', 'where', 'jagah', 'salon location', 'salon address'],
  'kahan par': ['location', 'address', 'place', 'where', 'jagah'],
  'location': ['kahan', 'address', 'jagah', 'place', 'where', 'kahan pr', 'kahan par'],
  'address': ['kahan', 'location', 'jagah', 'place', 'kahan pr'],
  'jagah': ['location', 'address', 'kahan', 'place'],
  'where': ['location', 'address', 'kahan', 'jagah'],
  
  // Price related
  'price': ['cost', 'charge', 'fee', 'rate', 'paisa', 'kitna', 'kiraya', 'pricing'],
  'kitna': ['price', 'cost', 'charge', 'fee', 'rate', 'pricing'],
  'cost': ['price', 'kitna', 'charge', 'fee', 'pricing'],
  'pricing': ['price', 'cost', 'kitna', 'charge'],
  
  // Service related
  'service': ['service kya hai', 'kaunsa', 'kaun si', 'services', 'offerings'],
  'kaun si': ['service', 'services', 'kaunsa', 'offerings'],
  'kaunsa': ['service', 'services', 'kaun si'],
  'services': ['service', 'kaun si', 'kaunsa', 'offerings'],
  
  // Time related
  'time': ['timing', 'waqt', 'samay', 'kab', 'when', 'hours'],
  'timing': ['time', 'waqt', 'samay', 'kab', 'hours'],
  'kab': ['time', 'timing', 'when', 'waqt', 'hours'],
  'hours': ['time', 'timing', 'waqt', 'kab'],
  
  // Contact related
  'phone': ['number', 'contact', 'call', 'mobile', 'phone number'],
  'number': ['phone', 'contact', 'mobile', 'phone number'],
  'contact': ['phone', 'number', 'mobile'],
};

/**
 * Expand query with synonyms and context
 * @param {string} query - Original query
 * @param {Array} conversationHistory - Previous conversation for context
 * @returns {string} - Expanded query
 */
export function expandQuery(query, conversationHistory = []) {
  const lowerQuery = query.toLowerCase().trim();
  
  // Start with original query
  let expandedQuery = query;
  const addedTerms = new Set();
  
  // Add synonyms based on keywords (check for longer phrases first)
  // Sort by length (longest first) to match "kahan pr" before "kahan"
  const sortedKeywords = Object.keys(queryExpansions).sort((a, b) => b.length - a.length);
  
  for (const keyword of sortedKeywords) {
    if (lowerQuery.includes(keyword)) {
      // Add more synonyms for better matching (up to 5)
      const synonyms = queryExpansions[keyword];
      synonyms.slice(0, 5).forEach(syn => {
        const lowerSyn = syn.toLowerCase();
        if (!lowerQuery.includes(lowerSyn) && !addedTerms.has(lowerSyn)) {
          expandedQuery += ` ${syn}`;
          addedTerms.add(lowerSyn);
        }
      });
      // Break after first match to avoid duplicate additions
      break;
    }
  }
  
  // Add context from conversation history if query is very short or ambiguous
  // This helps with follow-up questions like "kahan pr he" after "salon ka naam"
  if ((query.length < 25 || lowerQuery.includes('he') || lowerQuery.includes('hai')) && conversationHistory.length > 0) {
    // Get last 4-6 messages for context
    const recentMessages = conversationHistory.slice(-6);
    const contextText = recentMessages
      .map(msg => msg.content)
      .join(' ')
      .toLowerCase();
    
    // Extract key terms from context
    const contextKeywords = extractKeywords(contextText);
    
    // Add relevant context keywords (especially nouns and important terms)
    // Prioritize terms that might be in the knowledge base
    const importantTerms = contextKeywords
      .filter(word => word.length > 3) // Longer words are usually more meaningful
      .slice(0, 4); // Top 4 context terms
    
    importantTerms.forEach(keyword => {
      if (!lowerQuery.includes(keyword) && !addedTerms.has(keyword)) {
        expandedQuery += ` ${keyword}`;
        addedTerms.add(keyword);
      }
    });
  }
  
  // For very short queries, add common salon-related terms
  if (query.length < 15) {
    const commonTerms = ['salon', 'service', 'information'];
    commonTerms.forEach(term => {
      if (!lowerQuery.includes(term) && !addedTerms.has(term)) {
        expandedQuery += ` ${term}`;
        addedTerms.add(term);
      }
    });
  }
  
  return expandedQuery.trim();
}

/**
 * Extract keywords from text (simple implementation)
 */
function extractKeywords(text) {
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'par', 'hain', 'hai', 'ho', 'he', 'kya',
    'kya', 'kya', 'apka', 'apke', 'aap', 'main', 'mujhe', 'mujhse'
  ]);
  
  // Split and filter
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Return unique words
  return [...new Set(words)];
}

/**
 * Detect intent from query
 */
export function detectIntent(query) {
  const lowerQuery = query.toLowerCase();
  
  const intents = {
    location: ['kahan', 'location', 'address', 'jagah', 'where', 'place'],
    price: ['price', 'kitna', 'cost', 'charge', 'fee', 'rate', 'paisa'],
    service: ['service', 'services', 'kaun si', 'kaunsa', 'what services'],
    timing: ['time', 'timing', 'kab', 'when', 'waqt', 'samay'],
    contact: ['phone', 'number', 'contact', 'call', 'mobile'],
    booking: ['book', 'appointment', 'reserve', 'slot', 'booking']
  };
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return intent;
    }
  }
  
  return 'general';
}

