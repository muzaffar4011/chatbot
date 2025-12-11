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
  // More comprehensive English detection
  const englishPatterns = [
    // Question words
    /\b(what|when|where|who|why|how|which|whose|whom)\b/i,
    // Verbs
    /\b(is|are|was|were|am|be|been|being|do|does|did|done|have|has|had|will|would|should|could|can|may|might|must|shall)\b/i,
    // Pronouns and determiners
    /\b(the|a|an|and|or|but|if|then|else|this|that|these|those|they|them|their|there)\b/i,
    // Common words
    /\b(please|thank|thanks|hello|hi|yes|no|ok|okay|sure|maybe|you|your|yours|yourself|you're|you've|you'll)\b/i,
    // Salon-related English words
    /\b(name|location|address|price|cost|service|services|package|packages|provide|provides|offer|offers|have|has|get|got)\b/i,
  ];

  let englishScore = 0;
  for (const pattern of englishPatterns) {
    if (pattern.test(text)) {
      englishScore++;
    }
  }

  // Strong English indicators - if found, prioritize English
  const strongEnglishIndicators = /\b(which|what|where|who|why|how|you|your|provide|offers|packages|services)\b/i.test(text);
  
  // If strong English indicators found, return English immediately
  if (strongEnglishIndicators && englishScore > 0) {
    return 'en';
  }

  // If English patterns found and more than or equal to Urdu, return English
  if (englishScore > 0 && englishScore >= urduScore) {
    return 'en';
  }

  // If Urdu patterns found, return Urdu
  if (urduScore >= 1) {
    return 'ur';
  }

  // Default to English if no clear pattern
  return 'en';
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

