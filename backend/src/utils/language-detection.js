/**
 * Detects if a message is in Roman Urdu or English
 * Robust approach: Check first word(s) with comprehensive word lists and patterns
 * @param {string} message - User message
 * @returns {string} - 'ur' for Roman Urdu, 'en' for English
 */
export function detectLanguage(message) {
  if (!message || typeof message !== 'string') {
    return 'en'; // Default to English
  }

  const text = message.toLowerCase().trim();
  
  // Get first 1-3 words for detection (most important)
  const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 3);
  if (words.length === 0) {
    return 'en';
  }
  
  const firstWord = words[0];
  const secondWord = words[1] || '';
  const thirdWord = words[2] || '';

  // Comprehensive Roman Urdu starting words (exact matches - highest priority)
  const romanUrduExactWords = new Set([
    // Questions (most common starters)
    'kya', 'kaun', 'kaunsi', 'kaunse', 'kon', 'konsi', 'konse', 'kahan', 'kaise', 'kyun', 'kab', 'kis', 'kisi', 'kuch',
    // Possessives/Subjects (very common)
    'apke', 'apka', 'apki', 'apne', 'aap', 'mera', 'meri', 'mere', 'mujhe', 'hamara', 'hamari', 'hamare', 'hame', 'tum', 'tumhe',
    // Common starters
    'yahan', 'wahan', 'abhi', 'pehle', 'baad', 'aaj', 'kal', 'parson',
    // Verbs at start
    'batao', 'bata', 'batayein', 'batado', 'batana', 'dekh', 'dekhna', 'kar', 'karo', 'karein', 'karna', 'karne', 'karle',
    // Verbs/States
    'ho', 'hai', 'hain', 'hen', 'hoga', 'hogi', 'honge', 'hota', 'hoti', 'hote',
    // Other common starters
    'zaroor', 'bilkul', 'shayad', 'na', 'nahi', 'nahin', 'mat', 'kabhi', 'hamesha', 'sabse', 'bahut', 'zyada', 'kam', 'accha', 'bura',
    // Greetings/Common
    'salam', 'adaab', 'assalam', 'kese', 'kaise', 'kya', 'kab'
  ]);

  // Comprehensive English starting words (exact matches - highest priority)
  const englishExactWords = new Set([
    // Questions (most common starters)
    'what', 'when', 'where', 'who', 'why', 'how', 'which', 'whose', 'whom',
    // Polite starters (very common)
    'please', 'thank', 'thanks', 'hello', 'hi', 'hey', 'greetings',
    // Responses
    'yes', 'no', 'ok', 'okay', 'sure', 'maybe', 'perhaps', 'probably',
    // Pronouns/Subjects
    'you', 'your', 'yours', 'yourself', 'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours', 'they', 'them', 'their', 'theirs',
    // Verbs at start (very common)
    'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being', 'do', 'does', 'did', 'done', 'have', 'has', 'had', 'having',
    'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall',
    // Action verbs
    'tell', 'give', 'show', 'show', 'send', 'get', 'got', 'take', 'took', 'make', 'made', 'let', 'see', 'saw', 'know', 'knew',
    'want', 'wanted', 'need', 'needed', 'like', 'liked', 'love', 'loved', 'help', 'helped',
    // Articles/Determiners
    'the', 'a', 'an', 'this', 'that', 'these', 'those',
    // Other common starters
    'all', 'some', 'any', 'every', 'each', 'both', 'either', 'neither', 'many', 'much', 'more', 'most', 'few', 'little',
    'here', 'there', 'now', 'then', 'today', 'tomorrow', 'yesterday'
  ]);

  // Step 1: Check first word (highest priority)
  if (romanUrduExactWords.has(firstWord)) {
    return 'ur';
  }
  
  if (englishExactWords.has(firstWord)) {
    return 'en';
  }

  // Step 2: Check if first word starts with common patterns
  // Roman Urdu patterns
  if (firstWord.match(/^(kya|kaun|kaunsi|kaunse|kon|konsi|konse|kahan|kaise|kyun|kab|kis|kisi|kuch|apke|apka|apki|apne|aap|mera|meri|mere|mujhe|hamara|hamari|hamare|hame|tum|tumhe|batao|bata|batayein|batado|dekh|kar|karo|karein|ho|hai|hain|hen|hoga|hogi|zaroor|bilkul|na|nahi|nahin|salam|adaab|kese)/i)) {
    return 'ur';
  }
  
  // English patterns
  if (firstWord.match(/^(what|when|where|who|why|how|which|whose|whom|please|thank|thanks|hello|hi|hey|you|your|i|me|my|we|our|they|them|their|is|are|was|were|am|be|do|does|did|have|has|had|will|would|should|could|can|may|might|must|tell|give|show|send|get|got|take|make|let|see|know|want|need|like|love|help|the|a|an|this|that|these|those|all|some|any|every|each|both|here|there|now|then)/i)) {
    return 'en';
  }

  // Step 3: Check second word if first word is ambiguous
  if (secondWord) {
    if (romanUrduExactWords.has(secondWord)) {
      return 'ur';
    }
    if (englishExactWords.has(secondWord)) {
      return 'en';
    }
  }

  // Step 4: Check for common English phrases at start
  const englishPhrases = [
    'please show', 'please tell', 'please give', 'can you', 'could you', 'will you', 'would you', 'should i',
    'tell me', 'show me', 'give me', 'let me', 'i want', 'i need', 'i like', 'i love', 'i have', 'i am', 'i will',
    'what is', 'what are', 'what do', 'what does', 'where is', 'where are', 'where do', 'which is', 'which are',
    'how much', 'how many', 'how do', 'how does', 'how can', 'how will'
  ];
  
  const firstTwoWords = `${firstWord} ${secondWord}`.trim();
  for (const phrase of englishPhrases) {
    if (firstTwoWords.startsWith(phrase)) {
      return 'en';
    }
  }

  // Step 5: Check for common Roman Urdu phrases at start
  const urduPhrases = [
    'apke pass', 'apka naam', 'apki location', 'mera naam', 'meri madad', 'mujhe batao', 'mujhe chahiye', 'mujhe dekhna',
    'tumhe chahiye', 'hame chahiye', 'kaun si', 'kaun se', 'kon si', 'kon se', 'kya hai', 'kya hain', 'kahan hai', 'kahan hain',
    'kaise hai', 'kaise hain', 'kitna hai', 'kitne hain', 'kab hai', 'kab hain'
  ];
  
  for (const phrase of urduPhrases) {
    if (firstTwoWords.startsWith(phrase) || text.startsWith(phrase)) {
      return 'ur';
    }
  }

  // Step 6: Count Urdu vs English words in first 3 words
  let urduCount = 0;
  let englishCount = 0;
  
  for (const word of words) {
    if (romanUrduExactWords.has(word) || word.match(/^(kya|kaun|kon|apke|apka|mera|mujhe|hamara|batao|kar|ho|hai|hain|hen)/i)) {
      urduCount++;
    }
    if (englishExactWords.has(word) || word.match(/^(what|when|where|which|you|your|please|tell|show|give|is|are|do|does|can|could|will|would|should)/i)) {
      englishCount++;
    }
  }
  
  if (urduCount > englishCount) {
    return 'ur';
  }
  if (englishCount > urduCount) {
    return 'en';
  }

  // Step 7: Default to English (most common case)
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

