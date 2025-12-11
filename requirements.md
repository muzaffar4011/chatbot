# PROJECT: Salon AI Assistant with RAG (Retrieval-Augmented Generation)

## 🎯 EXECUTIVE SUMMARY
Build an intelligent bilingual chatbot for a salon that uses RAG technology to provide accurate, contextual answers about services, pricing, bookings, and policies in both English and Roman Urdu.

---

## 📋 SCOPE

### Primary Objective
Create a conversational AI assistant that:
- Understands complete salon operations and services
- Responds in the customer's language (English OR Roman Urdu)
- Retrieves accurate information from salon database
- Provides precise answers without hallucination
- Handles FAQs and detailed service inquiries

### Out of Scope (For v1)
- Multi-turn booking workflow
- Payment processing
- Image analysis of hairstyles
- Voice input/output

---

## 🔧 FUNCTIONAL REQUIREMENTS

### FR1: RAG-Based Knowledge Retrieval ⭐ CRITICAL
**Description**: Chatbot must retrieve information from a structured knowledge base, not rely on pre-training
**Implementation**:
- Vector database (Pinecone, Weaviate, or Chroma) storing salon data
- Embedding model (text-embedding-3-small or multilingual-e5-large) for semantic search
- Retrieval pipeline: Query → Embed → Search → Rank → Generate
- Minimum 3 relevant context chunks per query

**Knowledge Base Coverage**:
1. **Services Catalog**
   - Service names (English + Roman Urdu)
   - Detailed descriptions
   - Duration (e.g., "1 hour", "45 minutes")
   - Pricing (exact PKR amounts)
   - Service categories (Hair, Skin, Nails, Bridal, etc.)
   - Stylist specializations

2. **Salon Information**
   - Location address (full detail with landmarks)
   - Operating hours (daily schedule)
   - Contact information (phone, WhatsApp, email)
   - Social media links
   - Parking availability
   - Amenities (WiFi, refreshments, etc.)

3. **Policies & Procedures**
   - Booking/appointment process
   - Cancellation policy (timeframe, fees)
   - Payment methods accepted
   - Walk-in availability
   - Group booking policies
   - Rescheduling rules

4. **Staff Information**
   - Stylist names and specialties
   - Experience levels
   - Availability schedules
   - Customer reviews/ratings (if available)

5. **Promotions & Packages**
   - Current offers and discounts
   - Seasonal packages
   - Loyalty programs
   - Bridal packages
   - Bundle deals

6. **FAQs**
   - "Pehli dafa aa rahe hain?" (First time visiting?)
   - "Advance booking zaruri hai?" (Is advance booking required?)
   - "Payment ka tareeqa?" (Payment methods?)
   - Product recommendations
   - Aftercare instructions

### FR2: Bilingual Language Detection & Response ⭐ CRITICAL
**Description**: Automatically detect customer's language and respond accordingly

**Language Detection Logic**:
```
IF message contains Roman Urdu patterns (hai, hain, kya, aap, mere, ka, ki):
    → Respond in Roman Urdu
ELSE IF message is English:
    → Respond in English
ELSE (ambiguous):
    → Default to language of previous message in conversation
```

**Roman Urdu Guidelines**:
- Use common spellings: "aap", "mera", "kya", "hai", "hain", "karein"
- Natural conversational tone: "Ji bilkul", "Zaroor", "Aap batayen"
- Avoid overly formal Urdu: Use street-level conversational style
- Mix English technical terms when needed: "Hair cut", "Highlights", "Facial"

**Quality Checks**:
- No language mixing within single sentence (unless technical term)
- Consistent language throughout response
- Proper transliteration standards for Roman Urdu

### FR3: Real-Time Streaming Responses
**Description**: Token-by-token display for natural conversation feel
**Performance Target**: 
- First token latency: <1.5 seconds
- Token generation: 30-50 tokens/second
- Use Server-Sent Events (SSE) or WebSocket

### FR4: Session-Based Conversation Memory
**Description**: Maintain context within chat session
**Implementation**:
- Store last 10 message pairs (user + assistant)
- Session expires after 30 minutes of inactivity
- No persistent storage (privacy-first approach)
- Clear memory on page refresh or explicit "New Chat" action

**Context Usage**:
- Reference previous questions: "Aapne abhi highlights ke baare mein pucha tha..."
- Remember user preferences mentioned: "Jaise aapne bataya tha aap short hair prefer karte hain..."
- Avoid repeating information already provided

### FR5: Accurate Information Retrieval (No Hallucination)
**Description**: Only provide information from knowledge base

**Guardrails**:
1. If information not found in database: 
   - English: "I don't have that specific information. Please call us at [PHONE] for accurate details."
   - Roman Urdu: "Mujhe yeh specific information nahi hai. Behtar hoga aap hamare number par call karein: [PHONE]"

2. Never invent:
   - Prices
   - Service durations
   - Staff names
   - Operating hours
   - Policies

3. Citation system: Include confidence score internally
   - High confidence (>0.8): Provide direct answer
   - Medium confidence (0.5-0.8): Provide answer with "Usually..." qualifier
   - Low confidence (<0.5): Redirect to human contact

### FR6: Contextual Follow-Up Handling
**Examples**:

**Scenario 1: Price Inquiry**
```
User: "Hair cut ki price kya hai?"
Bot: "Hair cut ka price PKR 1,500 hai. Duration 45 minutes hai. Aap kab appointment lena chahenge?"

User: "Highlights ka bhi batao"
Bot: "Highlights ka price PKR 4,500 se start hota hai (full head). Duration 2-3 hours hai. Kya aap hair cut ke saath highlights bhi karwana chahte hain? Combo package mein discount mil sakta hai."
```

**Scenario 2: Booking Inquiry**
```
User: "I want to book an appointment"
Bot: "Sure! What service would you like to book? We offer haircuts, coloring, facials, and more. You can also call us at [PHONE] or WhatsApp [NUMBER] to confirm your booking."

User: "Facial"
Bot: "Great choice! We have several facial options:
- Basic Facial: PKR 2,000 (45 min)
- Gold Facial: PKR 3,500 (60 min)
- Diamond Facial: PKR 5,000 (75 min)

Which one interests you? I can help you with booking details."
```

### FR7: Graceful Off-Topic Handling
**Description**: Politely redirect unrelated queries

**Examples**:
```
User: "What's the weather today?"
Bot (English): "I'm specialized in helping with salon services and appointments. How can I assist you with our services today?"

Bot (Roman Urdu): "Main salon ki services ke baare mein madad kar sakta hoon. Aap humari kaunsi service ke baare mein janna chahte hain?"
```

**Off-Topic Categories**:
- Weather, news, general knowledge
- Other businesses/competitors
- Personal advice unrelated to salon
- Technical issues with website (redirect to support)

---

## 🎨 NON-FUNCTIONAL REQUIREMENTS

### NFR1: Performance Benchmarks
| Metric | Target | Measurement |
|--------|--------|-------------|
| First Token Latency | <1.5s | 95th percentile |
| Full Response Time | <5s | Average for 100-word response |
| RAG Retrieval Time | <500ms | Vector search + ranking |
| Uptime | 99.5% | Monthly |
| Concurrent Users | 50+ | Without degradation |

### NFR2: UI/UX Requirements

**Chat Widget Design**:
- Position: Bottom-right corner (fixed)
- Collapsed size: 60x60px circular button with salon logo
- Expanded size: 380px width × 600px height (desktop)
- Mobile: Full screen overlay (100vw × 100vh minus header)

**Visual Elements**:
- Typing indicator (3 animated dots)
- Message timestamps (subtle, gray)
- User messages: Right-aligned, brand primary color
- Bot messages: Left-aligned, neutral gray background
- Smooth scroll to newest message
- "Powered by AI" disclaimer at bottom

**Accessibility (WCAG 2.1 AA)**:
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader compatible (ARIA labels)
- Color contrast ratio ≥4.5:1
- Focus indicators visible
- Alt text for any images/icons
- Text resizing up to 200% without breaking layout

**Responsive Breakpoints**:
- Mobile: 320px - 767px (full screen mode)
- Tablet: 768px - 1024px (450px width chat)
- Desktop: 1025px+ (380px width chat)

### NFR3: Bilingual Text Rendering
- Font support for Roman Urdu: Use "Noto Sans" or "Roboto"
- Proper spacing for both scripts
- RTL not needed (Roman Urdu uses LTR)
- Emoji support for enhanced engagement 💇‍♀️✨💅

### NFR4: Security & Privacy
- No storage of personal data (names, phone numbers)
- Session data encrypted in transit (HTTPS only)
- Rate limiting: 20 messages per session
- Input sanitization (prevent XSS, SQL injection)
- No logging of conversation content (only metadata)

---

## 🏗️ TECHNICAL ARCHITECTURE

### Tech Stack Recommendation

**Frontend**:
- Framework: React 18+ with TypeScript
- Styling: Tailwind CSS
- State Management: Zustand or React Context
- HTTP Client: Axios with streaming support

**Backend**:
- Runtime: Node.js 20+ or Python 3.11+
- Framework: Express.js / FastAPI
- LLM: OpenAI GPT-4-turbo or Anthropic Claude 3 Sonnet
- Embeddings: OpenAI text-embedding-3-small

**RAG Infrastructure**:
- Vector Database: 
  - **Option 1**: Pinecone (managed, easy setup)
  - **Option 2**: Weaviate (open-source, self-hosted)
  - **Option 3**: Chroma (lightweight, embedded)
- Document Processing: LangChain or LlamaIndex
- Chunking Strategy: 300-500 tokens per chunk with 50-token overlap

**Hosting**:
- Frontend: Vercel / Netlify
- Backend: Railway / Render / AWS Lambda
- Vector DB: Pinecone Cloud / Self-hosted

### RAG Pipeline Architecture

```
┌─────────────────────────────────────────────────────┐
│  1. USER QUERY                                      │
│     "Hair cut ki price kya hai?"                    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  2. LANGUAGE DETECTION                              │
│     → Detected: Roman Urdu                          │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  3. QUERY EMBEDDING                                 │
│     → Convert to vector [0.23, -0.45, 0.78, ...]    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  4. VECTOR SEARCH (Top 5 chunks)                    │
│     ✓ "Haircut: PKR 1,500, Duration 45 min"         │
│     ✓ "Services: Cut, Color, Style"                 │
│     ✓ "Booking: Walk-in or call ahead"              │
│     ✓ "Payment: Cash, Card, JazzCash"               │
│     ✓ "Operating Hours: 10 AM - 8 PM"               │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  5. CONTEXT RANKING & FILTERING                     │
│     → Keep top 3 most relevant chunks               │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  6. PROMPT CONSTRUCTION                             │
│     System: You are salon chatbot...                │
│     Context: [3 relevant chunks]                    │
│     History: [Last 4 messages]                      │
│     User Query: "Hair cut ki price kya hai?"        │
│     Instruction: Respond in Roman Urdu              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  7. LLM GENERATION (Streaming)                      │
│     → "Hair cut ka price PKR 1,500 hai..."          │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  8. RESPONSE TO USER (Token by token)               │
└─────────────────────────────────────────────────────┘
```

### System Prompt Template

```markdown
You are a helpful AI assistant for [SALON_NAME], a premium salon in [LOCATION].

CRITICAL RULES:
1. ONLY use information from the PROVIDED CONTEXT below
2. If information is not in context, say: "Mujhe yeh information nahi hai. Aap [PHONE] par call kar sakte hain."
3. NEVER invent prices, timings, or service details
4. Detect language and respond accordingly:
   - Roman Urdu query → Roman Urdu response
   - English query → English response
5. Be friendly, professional, and concise
6. Use emojis sparingly (1-2 per response max)
7. Always offer to help further at the end

CONTEXT FROM KNOWLEDGE BASE:
{retrieved_chunks}

CONVERSATION HISTORY:
{conversation_history}

USER QUESTION: {user_query}

DETECTED LANGUAGE: {detected_language}

Respond naturally and accurately based ONLY on the context provided.
```

---

## 📊 KNOWLEDGE BASE STRUCTURE

### Data Schema Example

```json
{
  "documents": [
    {
      "id": "service_001",
      "category": "hair",
      "type": "service",
      "content_en": "Haircut: Professional haircut by experienced stylists. Duration: 45 minutes. Price: PKR 1,500. Includes wash and blow dry.",
      "content_ur": "Hair cut: Tajarbakaar stylists ke zariye professional hair cut. Duration: 45 minutes. Price: PKR 1,500. Wash aur blow dry shamil hai.",
      "metadata": {
        "service_name": "Haircut",
        "price": 1500,
        "currency": "PKR",
        "duration_minutes": 45,
        "category": "hair",
        "keywords": ["hair", "cut", "trim", "style"]
      }
    },
    {
      "id": "policy_001",
      "category": "policy",
      "type": "information",
      "content_en": "Cancellation Policy: Appointments can be cancelled up to 2 hours before scheduled time without charges. Late cancellations will incur 50% service fee.",
      "content_ur": "Cancellation Policy: Appointment ko 2 ghante pehle cancel kar sakte hain bina kisi charge ke. Late cancellation par 50% service fee lagega.",
      "metadata": {
        "policy_type": "cancellation",
        "advance_notice_hours": 2,
        "late_fee_percentage": 50
      }
    },
    {
      "id": "location_001",
      "category": "info",
      "type": "information",
      "content_en": "Location: Shop #45, Main Boulevard, Gulberg III, Lahore. Near Liberty Roundabout. Parking available in basement.",
      "content_ur": "Location: Shop #45, Main Boulevard, Gulberg III, Lahore. Liberty Chowk ke qareeb. Basement mein parking available hai.",
      "metadata": {
        "address_line": "Shop #45, Main Boulevard",
        "area": "Gulberg III",
        "city": "Lahore",
        "landmark": "Liberty Roundabout",
        "parking": true
      }
    }
  ]
}
```

### Document Preparation Checklist

- [ ] All services listed with accurate prices
- [ ] Each service has English + Roman Urdu version
- [ ] Staff bios and specialties documented
- [ ] Complete policy coverage (booking, payment, cancellation)
- [ ] FAQs compiled from actual customer questions
- [ ] Operating hours for each day
- [ ] Contact information verified
- [ ] Current promotions/packages included
- [ ] Review and update quarterly

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: MVP (Week 1-2)
**Goal**: Basic working RAG chatbot with bilingual support

**Deliverables**:
- Vector database setup with sample 50 documents
- Basic RAG pipeline (retrieve → generate)
- Language detection (English vs Roman Urdu)
- Simple chat UI (no styling)
- Core 10 FAQs covered

**Success Metrics**:
- Answers 80% of common questions correctly
- Language detection accuracy >95%
- Response time <3 seconds

### Phase 2: Enhancement (Week 3-4)
**Goal**: Production-ready with full features

**Deliverables**:
- Full knowledge base (200+ documents)
- Polished UI matching salon branding
- Session memory (10 message history)
- Streaming responses
- Mobile responsive design
- Error handling and fallbacks

**Success Metrics**:
- Answers 95% of questions correctly
- Response time <1.5s (first token)
- Zero hallucination rate
- Mobile usability score >90/100

### Phase 3: Optimization (Week 5-6)
**Goal**: Performance and intelligence improvements

**Deliverables**:
- Advanced retrieval (hybrid search: semantic + keyword)
- Conversation flow improvements
- Analytics dashboard (optional)
- A/B testing framework
- Load testing (50+ concurrent users)

**Success Metrics**:
- 99% uptime
- <1s first token latency
- Customer satisfaction >4.5/5

---

## 📈 SUCCESS METRICS & KPIs

### Functional Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Answer Accuracy | >95% | Manual review of 100 random conversations |
| Language Detection | >98% | Automated testing with labeled dataset |
| Retrieval Precision | >85% | Relevance of top 3 retrieved chunks |
| Hallucination Rate | <2% | Fact-check responses against knowledge base |

### Performance Metrics
| Metric | Target | Tool |
|--------|--------|------|
| First Token Latency | <1.5s | Application monitoring |
| Full Response Time | <5s | Frontend timing API |
| RAG Retrieval Time | <500ms | Backend logging |
| Widget Load Time | <1s | Lighthouse |

### User Experience Metrics
| Metric | Target | Collection Method |
|--------|--------|-------------------|
| Deflection Rate | >60% | % of conversations not escalated to human |
| User Satisfaction | >4.2/5 | Thumbs up/down after chat |
| Conversation Length | 3-5 messages avg | Analytics |
| Return Rate | >40% | Users who chat multiple times |

---

## 📚 DELIVERABLES CHECKLIST

### 1. Chat Widget Component ✅
- [ ] React component with TypeScript
- [ ] Expandable/collapsible interface
- [ ] Message history display
- [ ] Input box with send button
- [ ] Typing indicator
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Loading states
- [ ] Error boundaries

### 2. Backend API ✅
- [ ] `/api/chat` endpoint (POST)
- [ ] Streaming response support (SSE)
- [ ] Rate limiting middleware
- [ ] CORS configuration
- [ ] Input validation
- [ ] Error handling
- [ ] Logging (structured)
- [ ] Health check endpoint

### 3. RAG System ✅
- [ ] Vector database deployed
- [ ] Embedding pipeline setup
- [ ] Document ingestion script
- [ ] Retrieval function (top-k search)
- [ ] Prompt template system
- [ ] LLM integration (OpenAI/Anthropic)
- [ ] Context window management
- [ ] Fallback responses

### 4. Knowledge Base ✅
- [ ] Services catalog (complete)
- [ ] Pricing table
- [ ] Policies document
- [ ] Staff information
- [ ] FAQs (50+ entries)
- [ ] Location/contact info
- [ ] Current promotions
- [ ] Both languages covered
- [ ] Update procedures documented

### 5. Documentation ✅
- [ ] System architecture diagram
- [ ] API documentation (OpenAPI spec)
- [ ] Deployment guide
- [ ] Knowledge base update guide
- [ ] Troubleshooting playbook
- [ ] User testing report
- [ ] Performance benchmarks
- [ ] Maintenance schedule

### 6. Testing Suite ✅
- [ ] Unit tests (backend functions)
- [ ] Integration tests (API endpoints)
- [ ] E2E tests (user flows)
- [ ] Language detection tests
- [ ] RAG accuracy tests
- [ ] Load testing results
- [ ] Accessibility audit report

### 7. Deployment Package ✅
- [ ] Frontend build (production)
- [ ] Backend containerized (Docker)
- [ ] Environment variables documented
- [ ] Database migration scripts
- [ ] CI/CD pipeline configured
- [ ] Monitoring setup (logs, metrics)
- [ ] Backup strategy
- [ ] Rollback procedure

---

## 🎯 EXAMPLE CONVERSATIONS (Test Cases)

### Test Case 1: Service Inquiry (Roman Urdu)
```
User: "Facial ke liye kya options hain?"

Bot: "Humari 3 facial options hain:

💎 Diamond Facial - PKR 5,000 (75 minutes)
🌟 Gold Facial - PKR 3,500 (60 minutes)
💆‍♀️ Basic Facial - PKR 2,000 (45 minutes)

Teeno mein deep cleansing, massage aur mask included hai. Kaunsa try karna pasand karenge?"

User: "Gold wali ki details batao"

Bot: "Gold Facial mein yeh sab shamil hai:
• Deep cleansing
• Gold dust massage (circulation ke liye)
• Gold mask (skin brightening)
• Moisturizing treatment

Duration: 60 minutes
Price: PKR 3,500

Yeh humare sabse popular facial hai, especially shadiyon se pehle! Appointment ke liye aap [PHONE] par call kar sakte hain. 📞"
```

### Test Case 2: Booking Inquiry (English)
```
User: "How do I book an appointment?"

Bot: "You can book an appointment in 3 easy ways:

📱 Call us: [PHONE_NUMBER]
💬 WhatsApp: [WHATSAPP_NUMBER]
🏪 Walk-in: We accept walk-ins based on availability

For weekend slots, advance booking is recommended as we get quite busy! Which service are you interested in?"

User: "Can I book online through this chat?"

Bot: "I can help you with all the details about our services, but to confirm a booking, please call or WhatsApp us at [NUMBER]. This ensures we can check real-time availability and give you the perfect time slot! 

Would you like me to explain any of our services first?"
```

### Test Case 3: Policy Question (Mixed Context)
```
User: "Agar main cancel karna chahun to kya hoga?"

Bot: "Cancellation policy yeh hai:

✅ 2 ghante pehle cancel karein: No charges
⚠️ 2 ghante se kam notice: 50% service fee lagega
❌ No-show (bina bataye na aana): Full service fee

Agar koi emergency ho to hamare number par call karke baat kar sakte hain. Hum samajhte hain ke kabhi kabhi unexpected situations aa jati hain.

Aur koi sawal?"
```

### Test Case 4: Off-Topic Handling
```
User: "What's the weather like today?"

Bot: "Main salon ki services ke baare mein help kar sakta hoon. Aap humari kaunsi service ke baare mein janna chahte hain? Haircut, facial, bridal package, ya kuch aur?"
```

### Test Case 5: Contextual Follow-up
```
User: "Bridal makeup ka package hai?"

Bot: "Ji bilkul! Humare paas complete bridal packages hain:

💍 Premium Bridal Package - PKR 25,000
✨ Standard Bridal Package - PKR 18,000

Dono mein makeup, hair styling, draping aur touch-ups shamil hain. Trial session bhi included hai.

Aap ki shaadi kab hai? Main accordingly suggest kar sakta hoon."

User: "Next month"

Bot: "Zabardast! 1 mahine pehle perfect timing hai. Main recommend karun ga ke aap:

1. Abhi se facial routine start karein (monthly)
2. 2 hafte pehle bridal trial book karein
3. Ek din pehle final touch-ups

Kya aap chahenge ke main facial packages bhi bataun jo bridal glow ke liye best hain?"
```

---

## 🔐 SECURITY & COMPLIANCE

### Data Privacy
- No PII (Personally Identifiable Information) storage
- Session data purged after 30 minutes
- GDPR-compliant (if serving EU users)
- Explicit consent for data processing
- Clear privacy policy linked in chat

### Input Sanitization
```javascript
// Prevent malicious inputs
- HTML tag stripping
- SQL injection prevention
- XSS attack mitigation
- Command injection blocking
- File path traversal protection
```

### Rate Limiting
- 20 messages per session
- 100 requests per IP per hour
- Exponential backoff on rate limit hits

---

## 💡 OPTIMIZATION TIPS

### Retrieval Quality
1. **Chunk Size**: 300-500 tokens works best for salon FAQs
2. **Overlap**: 50-token overlap prevents context loss
3. **Metadata Filtering**: Use category filters (hair, skin, nails) before vector search
4. **Hybrid Search**: Combine semantic + keyword matching for better precision
5. **Reranking**: Use cross-encoder model for top-3 final ranking

### Response Quality
1. **Temperature**: 0.3-0.5 for factual responses
2. **Max Tokens**: 200-300 (salon answers should be concise)
3. **Few-Shot Examples**: Include 3-5 example Q&A pairs in prompt
4. **Citation**: Reference specific services/prices from context
5. **Fallback**: Always have a "contact us" fallback

### Cost Optimization
- Cache common queries (Redis)
- Batch embedding generation
- Use cheaper models for language detection (regex first)
- Implement CDN for frontend assets
- Compress API responses

---

## 📞 SUPPORT & ESCALATION

### When to Escalate to Human
- Complex booking modifications
- Complaints or negative feedback
- Payment disputes
- Medical/allergy concerns
- Special requests (group bookings, events)

### Handoff Message Templates
**English**: "This request needs special attention. I've notified our team, and someone will reach out to you shortly at [PHONE]. Is there anything else I can help with?"

**Roman Urdu**: "Yeh request ke liye humari team se baat karna behtar hoga. Main ne team ko notify kar diya hai, wo jald aap se [PHONE] par contact karenge. Aur kuch help chahiye?"

---

## 🎓 TRAINING & ITERATION

### Continuous Improvement Loop
1. **Weekly**: Review 50 random conversations
2. **Monthly**: Update knowledge base with new FAQs
3. **Quarterly**: Retrain embeddings if major service changes
4. **Ongoing**: A/B test prompt variations

### Quality Metrics to Track
- Answer accuracy rate
- Language detection accuracy
- Retrieval precision
- User satisfaction scores
- Conversation completion rate

---

This specification provides a complete blueprint for building a production-ready, bilingual RAG chatbot for your salon. Implement phase by phase and iterate based on real user feedback! 🚀