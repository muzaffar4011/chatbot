/**
 * Advanced Intent Understanding System
 * Understands user queries even with misspellings, informal language, and context
 */

/**
 * Comprehensive intent patterns with variations
 */
const INTENT_PATTERNS = {
  // Price related - very comprehensive
  price: {
    keywords: [
      // English
      'price', 'cost', 'charge', 'fee', 'rate', 'pricing', 'charges', 'fees', 'rates',
      'how much', 'what price', 'what cost', 'how much does', 'how much is',
      'price of', 'cost of', 'charge for', 'fee for',
      // Roman Urdu
      'kitna', 'kitne', 'kitni', 'price kya', 'cost kya', 'charge kya',
      'kitna hai', 'kitne hain', 'kitni hai', 'kitna lagta', 'kitna hota',
      'price batao', 'price bata', 'price batayein', 'price kya hai',
      'prices batao', 'prices bata', 'prices batayein', 'prices kya hain',
      'kitna paisa', 'kitna kharcha', 'kiraya', 'paisa', 'kharcha',
      // Informal - very important
      'price?', 'cost?', 'kitna?', 'kitne?', 'paisa?', 'kharcha?',
      'price chal rahi', 'price chal raha', 'price chal rahe',
      'prices chal rahi', 'prices chal raha', 'prices chal rahe',
      'kya price', 'kya cost', 'kya charge', 'kya prices',
      'chal rahi', 'chal raha', 'chal rahe', 'current price', 'current prices'
    ],
    context: ['package', 'service', 'services', 'haircut', 'facial', 'manicure', 'pedicure', 'batao', 'bata', 'batayein']
  },

  // Service related
  service: {
    keywords: [
      // English
      'service', 'services', 'what services', 'which services', 'what do you offer',
      'offerings', 'what offerings', 'what do you provide', 'what can i get',
      'what treatments', 'what packages', 'what options',
      // Roman Urdu
      'kaun si', 'kaunse', 'kaunsa', 'kaunsi', 'kon si', 'konse', 'konsa', 'konsi',
      'services kya', 'services kya hain', 'kaun si services', 'kon kon si services',
      'services batao', 'services bata', 'services batayein',
      'kya services', 'kya services hain', 'kya offer karte', 'kya provide karte',
      // Informal
      'services?', 'service?', 'kaun si?', 'kon si?', 'kya services?',
      'services hen', 'services hain', 'services hai'
    ],
    context: ['salon', 'offer', 'provide', 'available', 'hain', 'hen']
  },

  // Location related
  location: {
    keywords: [
      // English
      'location', 'address', 'where', 'where is', 'where are you', 'where are you located',
      'place', 'address of', 'location of', 'where can i find', 'where do you',
      // Roman Urdu
      'kahan', 'kahan pr', 'kahan par', 'kahan hai', 'kahan hain', 'kahan he',
      'address kya', 'address kya hai', 'location kya', 'location kya hai',
      'jagah', 'jagah kya', 'jagah kya hai', 'kahan located', 'kahan situated',
      // Informal
      'kahan?', 'where?', 'address?', 'location?', 'jagah?',
      'kahan pr he', 'kahan par he', 'kahan pr hai', 'kahan par hai'
    ],
    context: ['salon', 'shop', 'store', 'located', 'situated', 'find', 'reach']
  },

  // Timing related
  timing: {
    keywords: [
      // English
      'time', 'timing', 'timings', 'hours', 'when', 'when are you open', 'when do you open',
      'opening hours', 'closing time', 'operating hours', 'business hours',
      'what time', 'what hours', 'what timing',
      // Roman Urdu
      'kab', 'kab tak', 'kab se', 'kab open', 'kab close', 'kab khulta', 'kab band hota',
      'timing kya', 'timing kya hai', 'time kya', 'time kya hai',
      'waqt', 'samay', 'ghante', 'hours kya', 'hours kya hain',
      // Informal
      'timing?', 'time?', 'kab?', 'when?', 'hours?',
      'kab khulta hai', 'kab band hota hai', 'kab tak khula'
    ],
    context: ['open', 'close', 'available', 'operating', 'khulta', 'band']
  },

  // Contact related
  contact: {
    keywords: [
      // English
      'phone', 'number', 'contact', 'call', 'mobile', 'phone number', 'contact number',
      'what is your phone', 'what is your number', 'how to contact', 'how can i contact',
      // Roman Urdu
      'phone kya', 'phone kya hai', 'number kya', 'number kya hai',
      'contact kya', 'contact kya hai', 'kaise contact', 'kaise call',
      'phone number', 'mobile number', 'contact number',
      // Informal
      'phone?', 'number?', 'contact?', 'call?',
      'phone batao', 'number batao', 'contact batao'
    ],
    context: ['call', 'contact', 'reach', 'phone', 'number']
  },

  // Package related
  package: {
    keywords: [
      // English
      'package', 'packages', 'what packages', 'which packages', 'package details',
      'package price', 'package cost', 'package information',
      // Roman Urdu
      'package kya', 'packages kya', 'package kya hai', 'packages kya hain',
      'kaun se packages', 'kon se packages', 'package batao', 'packages batao',
      'package price', 'package cost', 'package ka price',
      // Informal
      'package?', 'packages?', 'kaun se?', 'kon se?'
    ],
    context: ['price', 'cost', 'includes', 'services', 'bridal', 'groom', 'membership']
  },

  // Staff related
  staff: {
    keywords: [
      // English
      'staff', 'stylist', 'barber', 'beauty expert', 'who works', 'who is your',
      'staff members', 'team members', 'employees',
      // Roman Urdu
      'staff kya', 'staff kya hai', 'kaun kaun', 'kon kon', 'kaun hai', 'kon hai',
      'staff batao', 'stylist batao', 'kaun kaun se staff',
      // Informal
      'staff?', 'kaun?', 'kon?', 'stylist?'
    ],
    context: ['stylist', 'barber', 'expert', 'staff', 'team']
  },

  // Booking related
  booking: {
    keywords: [
      // English
      'book', 'booking', 'appointment', 'reserve', 'reservation', 'slot',
      'how to book', 'how can i book', 'can i book', 'book an appointment',
      // Roman Urdu
      'book karo', 'booking karo', 'appointment lo', 'slot lo',
      'kaise book', 'kaise booking', 'book kar sakte', 'booking kar sakte',
      // Informal
      'book?', 'booking?', 'appointment?', 'slot?'
    ],
    context: ['appointment', 'slot', 'reserve', 'book', 'available']
  },

  // Discount related
  discount: {
    keywords: [
      // English
      'discount', 'discounts', 'offer', 'offers', 'promotion', 'promotions',
      'special offer', 'any discount', 'any offer', 'discount available',
      // Roman Urdu
      'discount kya', 'discount kya hai', 'offer kya', 'offer kya hai',
      'kaun se discount', 'kon se discount', 'discount milta', 'offer milta',
      // Informal
      'discount?', 'offer?', 'promotion?'
    ],
    context: ['discount', 'offer', 'promotion', 'special', 'available']
  }
};

/**
 * Normalize query - handle misspellings and variations
 */
function normalizeQuery(query) {
  let normalized = query.toLowerCase().trim();
  
  // Common misspellings and variations
  const replacements = {
    // Service variations
    'servis': 'service',
    'servises': 'services',
    'servic': 'service',
    // Price variations
    'pric': 'price',
    'prices': 'price',
    'prize': 'price',
    // Location variations
    'locatin': 'location',
    'adress': 'address',
    'addres': 'address',
    // Timing variations
    'timimg': 'timing',
    'timings': 'timing',
    // Contact variations
    'fone': 'phone',
    'phne': 'phone',
    'mobail': 'mobile',
    // Package variations
    'pakage': 'package',
    'packge': 'package',
    // Staff variations
    'staf': 'staff',
    'stylis': 'stylist',
    // Common word variations
    'kaun': 'kon',
    'kaunsi': 'konsi',
    'kaunse': 'konse',
    'hain': 'hen',
    'hai': 'he',
    // Remove extra spaces
    '  ': ' '
  };
  
  for (const [wrong, correct] of Object.entries(replacements)) {
    normalized = normalized.replace(new RegExp(wrong, 'gi'), correct);
  }
  
  return normalized;
}

/**
 * Detect user intent with high accuracy
 */
export function detectUserIntent(query, conversationHistory = []) {
  const normalizedQuery = normalizeQuery(query);
  const lowerQuery = normalizedQuery.toLowerCase();
  
  // Score each intent
  const intentScores = {};
  
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    
    // Check keywords
    for (const keyword of pattern.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        // Longer keywords get higher score
        score += keyword.length;
      }
    }
    
    // Check context words (boost score if present)
    for (const contextWord of pattern.context) {
      if (lowerQuery.includes(contextWord.toLowerCase())) {
        score += 2;
      }
    }
    
    // Check conversation history for context
    if (conversationHistory.length > 0) {
      const recentContext = conversationHistory
        .slice(-4)
        .map(msg => msg.content.toLowerCase())
        .join(' ');
      
      for (const keyword of pattern.keywords) {
        if (recentContext.includes(keyword.toLowerCase())) {
          score += 1; // Boost from context
        }
      }
    }
    
    if (score > 0) {
      intentScores[intent] = score;
    }
  }
  
  // Return intent with highest score
  if (Object.keys(intentScores).length === 0) {
    return 'general';
  }
  
  const sortedIntents = Object.entries(intentScores)
    .sort((a, b) => b[1] - a[1]);
  
  return sortedIntents[0][0]; // Return top intent
}

/**
 * Expand query with intent-specific synonyms
 */
export function expandQueryWithIntent(query, intent, conversationHistory = []) {
  const normalizedQuery = normalizeQuery(query);
  let expanded = query;
  const addedTerms = new Set();
  
  // Get intent-specific keywords
  if (INTENT_PATTERNS[intent]) {
    const pattern = INTENT_PATTERNS[intent];
    
    // Add synonyms from the intent pattern
    for (const keyword of pattern.keywords.slice(0, 10)) { // Top 10 keywords
      const lowerKeyword = keyword.toLowerCase();
      if (!normalizedQuery.includes(lowerKeyword) && !addedTerms.has(lowerKeyword)) {
        expanded += ` ${keyword}`;
        addedTerms.add(lowerKeyword);
      }
    }
    
    // Add context words
    for (const contextWord of pattern.context) {
      const lowerContext = contextWord.toLowerCase();
      if (!normalizedQuery.includes(lowerContext) && !addedTerms.has(lowerContext)) {
        expanded += ` ${contextWord}`;
        addedTerms.add(lowerContext);
      }
    }
  }
  
  // Add conversation context for short queries
  if (query.length < 20 && conversationHistory.length > 0) {
    const recentMessages = conversationHistory
      .slice(-4)
      .map(msg => msg.content)
      .join(' ')
      .toLowerCase();
    
    // Extract important nouns and keywords
    const importantWords = recentMessages
      .match(/\b\w{4,}\b/g) || [];
    
    for (const word of importantWords.slice(0, 3)) {
      if (!normalizedQuery.includes(word) && !addedTerms.has(word)) {
        expanded += ` ${word}`;
        addedTerms.add(word);
      }
    }
  }
  
  return expanded.trim();
}

/**
 * Get intent-specific response guidance
 */
export function getIntentGuidance(intent) {
  const guidance = {
    price: 'User is asking about prices. This is CRITICAL - you MUST provide prices from the salon data. If user asks "price batao" or "prices chal rahi" or "kitna lagta", they want to know CURRENT PRICES. Provide: 1) Service prices (all services with prices), 2) Package prices (all packages with prices), 3) Be comprehensive - if user asks for "prices" (plural) or "saare prices", list ALL prices. NEVER say "information nahi hai" for price queries - prices are ALWAYS in salon data.',
    service: 'User is asking about services. List all available services with their details (name, price, duration). Be comprehensive and helpful.',
    location: 'User is asking about location. Provide the complete address, landmark, and how to reach. Include contact information if relevant.',
    timing: 'User is asking about timings. Provide opening hours, closing hours, and days when the salon is open or closed.',
    contact: 'User is asking for contact information. Provide phone number, WhatsApp, email, and Instagram handle.',
    package: 'User is asking about packages. List all packages with their prices, included services, and validity.',
    staff: 'User is asking about staff. List all staff members with their roles, specialties, and experience.',
    booking: 'User is asking about booking. Explain booking methods (phone, WhatsApp, walk-in) and advance booking recommendations.',
    discount: 'User is asking about discounts. List all available discounts with their terms and conditions.',
    general: 'User query is general. Try to understand what they need and provide helpful information from the salon data.'
  };
  
  return guidance[intent] || guidance.general;
}

