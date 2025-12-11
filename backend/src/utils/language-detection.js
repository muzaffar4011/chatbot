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
    /\b(hai|hain|ho|hoon|hoon|hain|hoga|hogi|honge|hen)\b/i,
    /\b(kya|ka|ki|ke|kaun|kaunsi|kaunse|kon|konsi|konse|kis|kisi|kuch|kab|kahan|kaise|kyun)\b/i,
    /\b(aap|apke|apka|apki|apne|tum|mera|meri|mere|hamara|hamari|hamare|tera|teri|tere)\b/i,
    /\b(se|par|mein|ko|ne|ka|ki|ke|se|tak|bhi|bhi|to|ya|aur|lekin|magar|pass)\b/i,
    /\b(chahta|chahti|chahte|karna|karni|karne|kar|kar|gaya|gayi|gaye|liya|liyi|liye)\b/i,
    /\b(zaroor|bilkul|shayad|yahan|wahan|abhi|pehle|baad|aaj|kal|parson)\b/i,
    /\b(na|nahi|nahin|mat|kabhi|hamesha|sabse|bahut|zyada|kam|accha|bura)\b/i,
  ];

  // Count matches - give more weight to Roman Urdu patterns
  let urduScore = 0;
  let urduWordCount = 0;
  for (const pattern of romanUrduPatterns) {
    if (pattern.test(text)) {
      urduScore++;
      // Count actual matches (more weight)
      const matches = text.match(pattern);
      if (matches) urduWordCount += matches.length;
    }
  }

  // Strong Roman Urdu indicators (high priority)
  const strongUrduIndicators = /\b(apke|apka|apki|apne|mera|meri|mere|hamara|hamari|hamare|kaun|kaunsi|kaunse|kon|konsi|konse|kya|kahan|kaise|kyun|mujhe|tumhe|hame|hen|hain|hai|ho|hoon|hoga|hogi)\b/i.test(text);
  
  // If strong Roman Urdu indicators found AND multiple Urdu words, prioritize Urdu
  if (strongUrduIndicators && urduScore >= 2) {
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
    
  ];

  let englishScore = 0;
  let englishWordCount = 0;
  for (const pattern of englishPatterns) {
    if (pattern.test(text)) {
      englishScore++;
      const matches = text.match(pattern);
      if (matches) englishWordCount += matches.length;
    }
  }

  // Strong English indicators - but only if sentence structure is English
  const strongEnglishQuestionWords = /\b(which|what|where|who|why|how)\b/i.test(text);
  const strongEnglishStructure = /\b(you|your|provide|offers)\b/i.test(text);
  
  // If strong English question words found AND sentence structure is English (not Roman Urdu structure)
  // Roman Urdu structure: "apke pass kon kon si services hen" - has "apke", "kon", "hen"
  // English structure: "which services you provide" - has "which", "you", "provide"
  const hasUrduStructure = /\b(apke|apka|apki|mera|meri|mere|hamara|hamari|hamare|kaun|kaunsi|kaunse|kon|konsi|konse|mujhe|tumhe|hame)\b/i.test(text);
  const hasUrduVerb = /\b(hen|hain|hai|ho|hoon|hoga|hogi|honge)\b/i.test(text);
  
  // If sentence has Roman Urdu structure (apke/mera/hamara + kon/kaun + hen/hain), prioritize Urdu
  // Check for "apke pass" or "apka" or "apki" + "kon/kaun" + "hen/hain"
  const hasUrduPossessive = /\b(apke|apka|apki|apne|mera|meri|mere|hamara|hamari|hamare)\b/i.test(text);
  const hasUrduQuestionWord = /\b(kaun|kaunsi|kaunse|kon|konsi|konse|kya|kahan|kaise)\b/i.test(text);
  
  // If has Urdu possessive + Urdu question word + Urdu verb, definitely Urdu
  if (hasUrduPossessive && hasUrduQuestionWord && hasUrduVerb) {
    return 'ur';
  }
  
  // If has Urdu structure and Urdu verb, prioritize Urdu
  if (hasUrduStructure && (hasUrduVerb || urduScore >= 2)) {
    return 'ur';
  }
  
  // If strong English question words AND English structure (not Urdu structure), return English
  if (strongEnglishQuestionWords && strongEnglishStructure && !hasUrduStructure) {
    return 'en';
  }

  // Compare word counts - if more Urdu words than English, prioritize Urdu
  if (urduWordCount > englishWordCount && urduScore >= 1) {
    return 'ur';
  }

  // If English patterns found and more than Urdu, return English
  if (englishWordCount > urduWordCount && englishScore > 0) {
    return 'en';
  }

  // If Urdu patterns found (even if equal), prioritize Urdu (Roman Urdu often mixes English words)
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

