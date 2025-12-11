/**
 * Detects if a message is in Roman Urdu or English
 * @param {string} message - User message
 * @returns {string} - 'ur' for Roman Urdu, 'en' for English
 */
export function detectLanguage(message) {
  if (!message || typeof message !== 'string') {
    return 'en'; // Default to English
  }

  const text = message.toLowerCase().trim();

  // Roman Urdu patterns (common words and structures)
  const romanUrduPatterns = [
    /\b(hai|hain|ho|hoon|hoon|hain|hoga|hogi|honge)\b/i,
    /\b(kya|ka|ki|ke|kaun|kis|kisi|kuch|kab|kahan|kaise|kyun)\b/i,
    /\b(aap|tum|mera|meri|mere|hamara|hamari|hamare|tera|teri|tere)\b/i,
    /\b(se|par|mein|ko|ne|ka|ki|ke|se|tak|bhi|bhi|to|ya|aur|lekin|magar)\b/i,
    /\b(chahta|chahti|chahte|karna|karni|karne|kar|kar|gaya|gayi|gaye|liya|liyi|liye)\b/i,
    /\b(zaroor|bilkul|shayad|yahan|wahan|abhi|pehle|baad|aaj|kal|parson)\b/i,
    /\b(na|nahi|nahin|mat|kabhi|hamesha|sabse|bahut|zyada|kam|accha|bura)\b/i,
  ];

  // Count matches
  let urduScore = 0;
  for (const pattern of romanUrduPatterns) {
    if (pattern.test(text)) {
      urduScore++;
    }
  }

  // If 2+ patterns match, likely Roman Urdu
  if (urduScore >= 2) {
    return 'ur';
  }

  // Check for English patterns (common English words)
  const englishPatterns = [
    /\b(what|when|where|who|why|how|is|are|was|were|do|does|did|can|could|will|would|should)\b/i,
    /\b(the|a|an|and|or|but|if|then|else|this|that|these|those)\b/i,
    /\b(please|thank|thanks|hello|hi|yes|no|ok|okay|sure|maybe)\b/i,
  ];

  let englishScore = 0;
  for (const pattern of englishPatterns) {
    if (pattern.test(text)) {
      englishScore++;
    }
  }

  // If more English patterns, return English
  if (englishScore > urduScore) {
    return 'en';
  }

  // Default based on score
  return urduScore >= 1 ? 'ur' : 'en';
}

/**
 * Get language from conversation history if current message is ambiguous
 * @param {Array} conversationHistory - Previous messages
 * @returns {string} - Detected language
 */
export function getLanguageFromHistory(conversationHistory) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return 'en';
  }

  // Check last few user messages
  const recentMessages = conversationHistory
    .filter(msg => msg.role === 'user')
    .slice(-3)
    .map(msg => msg.content);

  if (recentMessages.length === 0) {
    return 'en';
  }

  // Detect language for each recent message
  const languages = recentMessages.map(detectLanguage);
  
  // Return most common language
  const urCount = languages.filter(l => l === 'ur').length;
  const enCount = languages.filter(l => l === 'en').length;
  
  return urCount >= enCount ? 'ur' : 'en';
}

