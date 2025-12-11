import { initializeVectorDB, addDocuments, getCollectionStats } from '../services/vector-db.js';
import { QdrantClient } from '@qdrant/js-client-rest';
import { generateEmbeddings } from '../services/embeddings.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from backend directory
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Debug: Check if API key is loaded
if (!process.env.OPENROUTER_API_KEY) {
  console.error('❌ OPENROUTER_API_KEY not found!');
  console.error(`   Looking for .env file at: ${envPath}`);
  console.error('   Make sure you have created backend/.env with OPENROUTER_API_KEY');
  process.exit(1);
}

/**
 * Sample knowledge base data
 * In production, this would come from a database or CMS
 */
const knowledgeBase = [
  // Services - Hair
  {
    id: 'service_haircut_001',
    category: 'hair',
    type: 'service',
    content_en: 'Haircut: Professional haircut by experienced stylists. Duration: 45 minutes. Price: PKR 1,500. Includes wash and blow dry. Available for men and women.',
    content_ur: 'Hair cut: Tajarbakaar stylists ke zariye professional hair cut. Duration: 45 minutes. Price: PKR 1,500. Wash aur blow dry shamil hai. Men aur women dono ke liye available hai.',
    metadata: {
      service_name: 'Haircut',
      price: 1500,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'hair',
      keywords: ['hair', 'cut', 'trim', 'style', 'haircut']
    }
  },
  {
    id: 'service_highlights_001',
    category: 'hair',
    type: 'service',
    content_en: 'Highlights: Full head highlights service. Duration: 2-3 hours. Price: PKR 4,500 (starts from). Includes color consultation, application, and styling.',
    content_ur: 'Highlights: Full head highlights service. Duration: 2-3 hours. Price: PKR 4,500 se start hota hai. Color consultation, application aur styling shamil hai.',
    metadata: {
      service_name: 'Highlights',
      price: 4500,
      currency: 'PKR',
      duration_minutes: 150,
      category: 'hair',
      keywords: ['highlights', 'color', 'hair color', 'dye']
    }
  },
  {
    id: 'service_hair_color_001',
    category: 'hair',
    type: 'service',
    content_en: 'Hair Coloring: Complete hair coloring service. Duration: 2-3 hours. Price: PKR 3,500 (starts from). Multiple color options available.',
    content_ur: 'Hair Coloring: Complete hair coloring service. Duration: 2-3 hours. Price: PKR 3,500 se start hota hai. Multiple color options available hain.',
    metadata: {
      service_name: 'Hair Coloring',
      price: 3500,
      currency: 'PKR',
      duration_minutes: 150,
      category: 'hair',
      keywords: ['color', 'coloring', 'dye', 'hair dye']
    }
  },
  
  // Services - Facial
  {
    id: 'service_facial_basic_001',
    category: 'skin',
    type: 'service',
    content_en: 'Basic Facial: Deep cleansing facial treatment. Duration: 45 minutes. Price: PKR 2,000. Includes cleansing, exfoliation, mask, and moisturizing.',
    content_ur: 'Basic Facial: Deep cleansing facial treatment. Duration: 45 minutes. Price: PKR 2,000. Cleansing, exfoliation, mask aur moisturizing shamil hai.',
    metadata: {
      service_name: 'Basic Facial',
      price: 2000,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'skin',
      keywords: ['facial', 'skin', 'cleansing', 'basic']
    }
  },
  {
    id: 'service_facial_gold_001',
    category: 'skin',
    type: 'service',
    content_en: 'Gold Facial: Premium facial with gold dust massage. Duration: 60 minutes. Price: PKR 3,500. Includes deep cleansing, gold dust massage for circulation, gold mask for skin brightening, and moisturizing treatment. Most popular facial, especially before weddings.',
    content_ur: 'Gold Facial: Premium facial with gold dust massage. Duration: 60 minutes. Price: PKR 3,500. Deep cleansing, gold dust massage (circulation ke liye), gold mask (skin brightening), aur moisturizing treatment shamil hai. Sabse popular facial hai, especially shadiyon se pehle.',
    metadata: {
      service_name: 'Gold Facial',
      price: 3500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'skin',
      keywords: ['facial', 'gold', 'premium', 'massage', 'brightening']
    }
  },
  {
    id: 'service_facial_diamond_001',
    category: 'skin',
    type: 'service',
    content_en: 'Diamond Facial: Luxury facial treatment with diamond particles. Duration: 75 minutes. Price: PKR 5,000. Includes deep cleansing, diamond exfoliation, diamond mask, and premium moisturizing treatment.',
    content_ur: 'Diamond Facial: Luxury facial treatment with diamond particles. Duration: 75 minutes. Price: PKR 5,000. Deep cleansing, diamond exfoliation, diamond mask, aur premium moisturizing treatment shamil hai.',
    metadata: {
      service_name: 'Diamond Facial',
      price: 5000,
      currency: 'PKR',
      duration_minutes: 75,
      category: 'skin',
      keywords: ['facial', 'diamond', 'luxury', 'premium']
    }
  },

  // Bridal Packages
  {
    id: 'package_bridal_premium_001',
    category: 'bridal',
    type: 'package',
    content_en: 'Premium Bridal Package: Complete bridal package including makeup, hair styling, draping, and touch-ups. Price: PKR 25,000. Trial session included. Perfect for weddings and special events. This is our most comprehensive bridal package with all services included.',
    content_ur: 'Premium Bridal Package: Complete bridal package including makeup, hair styling, draping, aur touch-ups. Price: PKR 25,000. Trial session bhi included hai. Shaadiyon aur special events ke liye perfect hai. Yeh hamara sabse comprehensive bridal package hai jisme sab services shamil hain.',
    metadata: {
      service_name: 'Premium Bridal Package',
      price: 25000,
      currency: 'PKR',
      category: 'bridal',
      keywords: ['bridal', 'wedding', 'makeup', 'package', 'premium', 'bridal package', 'bridal ka package', 'poora package', 'complete package', 'bridal poora', 'bridal complete', 'package bataen', 'package batao']
    }
  },
  {
    id: 'package_bridal_standard_001',
    category: 'bridal',
    type: 'package',
    content_en: 'Standard Bridal Package: Bridal package with makeup, hair styling, and touch-ups. Price: PKR 18,000. Trial session included. This package includes all essential bridal services at an affordable price.',
    content_ur: 'Standard Bridal Package: Bridal package with makeup, hair styling, aur touch-ups. Price: PKR 18,000. Trial session included hai. Is package mein sab essential bridal services shamil hain affordable price par.',
    metadata: {
      service_name: 'Standard Bridal Package',
      price: 18000,
      currency: 'PKR',
      category: 'bridal',
      keywords: ['bridal', 'wedding', 'makeup', 'package', 'standard', 'bridal package', 'bridal ka package', 'package bataen', 'package batao']
    }
  },

  // Policies
  {
    id: 'policy_cancellation_001',
    category: 'policy',
    type: 'information',
    content_en: 'Cancellation Policy: Appointments can be cancelled up to 2 hours before scheduled time without charges. Late cancellations (less than 2 hours notice) will incur 50% service fee. No-show (without notice) will incur full service fee. For emergencies, please call us to discuss.',
    content_ur: 'Cancellation Policy: Appointment ko 2 ghante pehle cancel kar sakte hain bina kisi charge ke. Late cancellation (2 ghante se kam notice) par 50% service fee lagega. No-show (bina bataye na aana) par full service fee lagega. Emergencies ke liye hamare number par call karke baat kar sakte hain.',
    metadata: {
      policy_type: 'cancellation',
      advance_notice_hours: 2,
      late_fee_percentage: 50,
      keywords: ['cancellation', 'cancel', 'policy', 'refund']
    }
  },
  {
    id: 'policy_booking_001',
    category: 'policy',
    type: 'information',
    content_en: 'Booking Process: You can book appointments by calling us, WhatsApp, or walk-in (subject to availability). For weekend slots, advance booking is recommended. We accept bookings for all services including haircuts, facials, coloring, and bridal packages.',
    content_ur: 'Booking Process: Aap call, WhatsApp, ya walk-in (availability ke basis par) se appointment book kar sakte hain. Weekend slots ke liye advance booking recommend hai. Hum sab services ke liye booking accept karte hain including haircuts, facials, coloring, aur bridal packages.',
    metadata: {
      policy_type: 'booking',
      keywords: ['booking', 'appointment', 'book', 'schedule']
    }
  },
  {
    id: 'policy_payment_001',
    category: 'policy',
    type: 'information',
    content_en: 'Payment Methods: We accept cash, credit/debit cards, and mobile payment methods like JazzCash and EasyPaisa. Payment is due at the time of service completion.',
    content_ur: 'Payment Methods: Hum cash, credit/debit cards, aur mobile payment methods accept karte hain jaise JazzCash aur EasyPaisa. Payment service completion par due hai.',
    metadata: {
      policy_type: 'payment',
      keywords: ['payment', 'cash', 'card', 'jazzcash', 'easypaisa']
    }
  },

  // Location & Contact
  {
    id: 'location_001',
    category: 'info',
    type: 'information',
    content_en: 'Location: Shop #45, Main Boulevard, Clifton, Karachi. Near Do Darya. Parking available in basement. Easy to find location with good accessibility.',
    content_ur: 'Location: Shop #45, Main Boulevard, Clifton, Karachi. Do Darya ke qareeb. Basement mein parking available hai. Easy to find location hai with good accessibility.',
    metadata: {
      address_line: 'Shop #45, Main Boulevard',
      area: 'Clifton',
      city: 'Karachi',
      landmark: 'Do Darya',
      parking: true,
      keywords: ['location', 'address', 'gulberg', 'lahore', 'parking']
    }
  },
  {
    id: 'contact_001',
    category: 'info',
    type: 'information',
    content_en: 'Contact Information: Phone: +92-300-1234567, WhatsApp: +92-300-1234567. You can call or message us for bookings, inquiries, or any questions. We are available during operating hours.',
    content_ur: 'Contact Information: Phone: +92-300-1234567, WhatsApp: +92-300-1234567. Aap bookings, inquiries, ya koi sawal ke liye call ya message kar sakte hain. Hum operating hours mein available hain.',
    metadata: {
      phone: '+92-300-1234567',
      whatsapp: '+92-300-1234567',
      keywords: ['contact', 'phone', 'whatsapp', 'call', 'number']
    }
  },
  {
    id: 'hours_001',
    category: 'info',
    type: 'information',
    content_en: 'Operating Hours: Monday to Saturday: 10:00 AM to 8:00 PM. Sunday: 12:00 PM to 6:00 PM. We are closed on public holidays. Walk-ins welcome based on availability.',
    content_ur: 'Operating Hours: Monday se Saturday: 10:00 AM se 8:00 PM tak. Sunday: 12:00 PM se 6:00 PM tak. Public holidays par closed hain. Availability ke basis par walk-ins welcome hain.',
    metadata: {
      monday_saturday: '10:00 AM - 8:00 PM',
      sunday: '12:00 PM - 6:00 PM',
      keywords: ['hours', 'timing', 'open', 'closed', 'schedule']
    }
  },

  // FAQs
  {
    id: 'faq_first_visit_001',
    category: 'faq',
    type: 'information',
    content_en: 'First Time Visit: Welcome! For first-time visitors, we recommend booking in advance to ensure availability. You can call or WhatsApp us to book. We offer consultations to understand your needs and preferences.',
    content_ur: 'Pehli Dafa Visit: Welcome! Pehli dafa visitors ke liye, hum advance booking recommend karte hain availability ensure karne ke liye. Aap call ya WhatsApp se book kar sakte hain. Hum consultations offer karte hain aapki needs aur preferences samajhne ke liye.',
    metadata: {
      faq_type: 'first_visit',
      keywords: ['first', 'visit', 'new', 'customer', 'pehli dafa']
    }
  },
  {
    id: 'faq_advance_booking_001',
    category: 'faq',
    type: 'information',
    content_en: 'Advance Booking: Advance booking is recommended, especially for weekends, bridal services, and popular time slots. You can book by calling or WhatsApp. Walk-ins are accepted based on availability.',
    content_ur: 'Advance Booking: Advance booking recommend hai, especially weekends, bridal services, aur popular time slots ke liye. Aap call ya WhatsApp se book kar sakte hain. Availability ke basis par walk-ins accept kiye jate hain.',
    metadata: {
      faq_type: 'advance_booking',
      keywords: ['advance', 'booking', 'zaruri', 'recommended']
    }
  },

  // Complete Services List with Prices
  {
    id: 'services_list_complete_001',
    category: 'info',
    type: 'information',
    content_en: 'Complete Services List with Prices: HAIR SERVICES - Haircut: PKR 1,500 (45 min), Hair Coloring: PKR 3,500+ (2-3 hours), Highlights: PKR 4,500+ (2-3 hours), Hair Styling: PKR 2,500+ (1-2 hours), Hair Treatment: PKR 3,000+ (1 hour). SKIN SERVICES - Basic Facial: PKR 2,000 (45 min), Gold Facial: PKR 3,500 (60 min), Diamond Facial: PKR 5,000 (75 min). NAIL SERVICES - Manicure: PKR 1,500 (45 min), Pedicure: PKR 2,000 (60 min), Nail Art: PKR 2,500+ (30-45 min), Gel Polish: PKR 2,000 (45 min). BRIDAL SERVICES - Premium Bridal Package: PKR 25,000, Standard Bridal Package: PKR 18,000. All prices are in PKR. All services include professional consultation and care.',
    content_ur: 'Complete Services List with Prices: HAIR SERVICES - Hair cut: PKR 1,500 (45 min), Hair Coloring: PKR 3,500+ se (2-3 hours), Highlights: PKR 4,500+ se (2-3 hours), Hair Styling: PKR 2,500+ se (1-2 hours), Hair Treatment: PKR 3,000+ se (1 hour). SKIN SERVICES - Basic Facial: PKR 2,000 (45 min), Gold Facial: PKR 3,500 (60 min), Diamond Facial: PKR 5,000 (75 min). NAIL SERVICES - Manicure: PKR 1,500 (45 min), Pedicure: PKR 2,000 (60 min), Nail Art: PKR 2,500+ se (30-45 min), Gel Polish: PKR 2,000 (45 min). BRIDAL SERVICES - Premium Bridal Package: PKR 25,000, Standard Bridal Package: PKR 18,000. Sab prices PKR mein hain. Sab services mein professional consultation aur care shamil hai.',
    metadata: {
      service_type: 'complete_list',
      keywords: ['services', 'list', 'all services', 'kon kon si', 'what services', 'services hain', 'prices', 'price list', 'sab services ki list', 'services with prices', 'price', 'cost']
    }
  },
  {
    id: 'services_price_list_001',
    category: 'info',
    type: 'information',
    content_en: 'Complete Price List: HAIR - Haircut PKR 1,500, Hair Coloring PKR 3,500+, Highlights PKR 4,500+, Hair Styling PKR 2,500+, Hair Treatment PKR 3,000+. SKIN - Basic Facial PKR 2,000, Gold Facial PKR 3,500, Diamond Facial PKR 5,000. NAILS - Manicure PKR 1,500, Pedicure PKR 2,000, Nail Art PKR 2,500+, Gel Polish PKR 2,000. BRIDAL - Premium Package PKR 25,000, Standard Package PKR 18,000.',
    content_ur: 'Complete Price List: HAIR - Hair cut PKR 1,500, Hair Coloring PKR 3,500+ se, Highlights PKR 4,500+ se, Hair Styling PKR 2,500+ se, Hair Treatment PKR 3,000+ se. SKIN - Basic Facial PKR 2,000, Gold Facial PKR 3,500, Diamond Facial PKR 5,000. NAILS - Manicure PKR 1,500, Pedicure PKR 2,000, Nail Art PKR 2,500+ se, Gel Polish PKR 2,000. BRIDAL - Premium Package PKR 25,000, Standard Package PKR 18,000.',
    metadata: {
      service_type: 'price_list',
      keywords: ['price', 'prices', 'cost', 'rate', 'charges', 'price list', 'sab services ki price', 'services ki list with prices', 'pricing', 'rates', 'saary services', 'sab services', 'list den', 'bataen', 'batao']
    }
  },
  {
    id: 'services_list_query_001',
    category: 'info',
    type: 'information',
    content_en: 'All Services List with Prices: Here is the complete list of all our services with prices. HAIR SERVICES: Haircut PKR 1,500, Hair Coloring PKR 3,500+, Highlights PKR 4,500+, Hair Styling PKR 2,500+, Hair Treatment PKR 3,000+. SKIN SERVICES: Basic Facial PKR 2,000, Gold Facial PKR 3,500, Diamond Facial PKR 5,000. NAIL SERVICES: Manicure PKR 1,500, Pedicure PKR 2,000, Nail Art PKR 2,500+, Gel Polish PKR 2,000. BRIDAL SERVICES: Premium Bridal Package PKR 25,000, Standard Bridal Package PKR 18,000. All prices in PKR.',
    content_ur: 'Sab Services List with Prices: Yeh hamari sab services ki complete list hai prices ke saath. HAIR SERVICES: Hair cut PKR 1,500, Hair Coloring PKR 3,500+ se, Highlights PKR 4,500+ se, Hair Styling PKR 2,500+ se, Hair Treatment PKR 3,000+ se. SKIN SERVICES: Basic Facial PKR 2,000, Gold Facial PKR 3,500, Diamond Facial PKR 5,000. NAIL SERVICES: Manicure PKR 1,500, Pedicure PKR 2,000, Nail Art PKR 2,500+ se, Gel Polish PKR 2,000. BRIDAL SERVICES: Premium Bridal Package PKR 25,000, Standard Bridal Package PKR 18,000. Sab prices PKR mein hain.',
    metadata: {
      service_type: 'complete_list',
      keywords: ['saary services', 'sab services', 'list den', 'bataen', 'batao', 'services ki list', 'sab services ki list', 'list do', 'services with prices', 'services aur prices', 'services or prices']
    }
  },
  {
    id: 'bridal_package_complete_001',
    category: 'bridal',
    type: 'package',
    content_en: 'Complete Bridal Package Details: We offer two bridal packages. PREMIUM BRIDAL PACKAGE - Price: PKR 25,000. Includes: Complete bridal makeup, hair styling, draping, touch-ups throughout the event, and trial session. Perfect for weddings and special events. STANDARD BRIDAL PACKAGE - Price: PKR 18,000. Includes: Bridal makeup, hair styling, touch-ups, and trial session. Both packages include professional consultation. Trial session helps you decide on the perfect look for your special day.',
    content_ur: 'Complete Bridal Package Details: Hum do bridal packages offer karte hain. PREMIUM BRIDAL PACKAGE - Price: PKR 25,000. Includes: Complete bridal makeup, hair styling, draping, event ke dauran touch-ups, aur trial session. Shaadiyon aur special events ke liye perfect hai. STANDARD BRIDAL PACKAGE - Price: PKR 18,000. Includes: Bridal makeup, hair styling, touch-ups, aur trial session. Dono packages mein professional consultation shamil hai. Trial session aapko apne special day ke liye perfect look decide karne mein madad karti hai.',
    metadata: {
      service_name: 'Bridal Packages',
      keywords: ['bridal', 'bridal package', 'bridal ka package', 'package bataen', 'package batao', 'poora package', 'complete package', 'bridal details', 'wedding package', 'shaadi package', 'bridal poora', 'bridal complete']
    }
  },

  // Additional Hair Services
  {
    id: 'service_hair_styling_001',
    category: 'hair',
    type: 'service',
    content_en: 'Hair Styling: Professional hair styling for special occasions. Duration: 1-2 hours. Price: PKR 2,500 (starts from). Includes wash, styling, and finishing. Perfect for events, parties, and special occasions.',
    content_ur: 'Hair Styling: Special occasions ke liye professional hair styling. Duration: 1-2 hours. Price: PKR 2,500 se start hota hai. Wash, styling, aur finishing shamil hai. Events, parties, aur special occasions ke liye perfect hai.',
    metadata: {
      service_name: 'Hair Styling',
      price: 2500,
      currency: 'PKR',
      duration_minutes: 90,
      category: 'hair',
      keywords: ['styling', 'hair styling', 'style', 'event', 'party']
    }
  },
  {
    id: 'service_hair_treatment_001',
    category: 'hair',
    type: 'service',
    content_en: 'Hair Treatment: Deep conditioning and repair treatment for damaged hair. Duration: 1 hour. Price: PKR 3,000 (starts from). Includes deep conditioning, repair mask, and blow dry. Helps restore hair health and shine.',
    content_ur: 'Hair Treatment: Damaged hair ke liye deep conditioning aur repair treatment. Duration: 1 hour. Price: PKR 3,000 se start hota hai. Deep conditioning, repair mask, aur blow dry shamil hai. Hair ki health aur shine restore karne mein madad karta hai.',
    metadata: {
      service_name: 'Hair Treatment',
      price: 3000,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'hair',
      keywords: ['treatment', 'hair treatment', 'conditioning', 'repair', 'damaged hair']
    }
  },

  // Nail Services
  {
    id: 'service_manicure_001',
    category: 'nails',
    type: 'service',
    content_en: 'Manicure: Complete hand care and nail grooming. Duration: 45 minutes. Price: PKR 1,500. Includes nail shaping, cuticle care, hand massage, and polish. Available in various colors.',
    content_ur: 'Manicure: Complete hand care aur nail grooming. Duration: 45 minutes. Price: PKR 1,500. Nail shaping, cuticle care, hand massage, aur polish shamil hai. Various colors mein available hai.',
    metadata: {
      service_name: 'Manicure',
      price: 1500,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'nails',
      keywords: ['manicure', 'nails', 'hand care', 'nail polish']
    }
  },
  {
    id: 'service_pedicure_001',
    category: 'nails',
    type: 'service',
    content_en: 'Pedicure: Complete foot care and nail grooming. Duration: 60 minutes. Price: PKR 2,000. Includes foot soak, nail shaping, cuticle care, foot massage, and polish. Relaxing and rejuvenating.',
    content_ur: 'Pedicure: Complete foot care aur nail grooming. Duration: 60 minutes. Price: PKR 2,000. Foot soak, nail shaping, cuticle care, foot massage, aur polish shamil hai. Relaxing aur rejuvenating hai.',
    metadata: {
      service_name: 'Pedicure',
      price: 2000,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'nails',
      keywords: ['pedicure', 'foot care', 'feet', 'nail care']
    }
  },
  {
    id: 'service_nail_art_001',
    category: 'nails',
    type: 'service',
    content_en: 'Nail Art: Creative nail designs and patterns. Duration: 30-45 minutes. Price: PKR 2,500 (starts from). Includes base color, design, and top coat. Various designs available. Perfect for special occasions.',
    content_ur: 'Nail Art: Creative nail designs aur patterns. Duration: 30-45 minutes. Price: PKR 2,500 se start hota hai. Base color, design, aur top coat shamil hai. Various designs available hain. Special occasions ke liye perfect hai.',
    metadata: {
      service_name: 'Nail Art',
      price: 2500,
      currency: 'PKR',
      duration_minutes: 40,
      category: 'nails',
      keywords: ['nail art', 'design', 'patterns', 'creative']
    }
  },
  {
    id: 'service_gel_polish_001',
    category: 'nails',
    type: 'service',
    content_en: 'Gel Polish: Long-lasting gel nail polish. Duration: 45 minutes. Price: PKR 2,000. Includes gel application and curing. Lasts 2-3 weeks. Available in many colors.',
    content_ur: 'Gel Polish: Long-lasting gel nail polish. Duration: 45 minutes. Price: PKR 2,000. Gel application aur curing shamil hai. 2-3 weeks tak last karta hai. Many colors mein available hai.',
    metadata: {
      service_name: 'Gel Polish',
      price: 2000,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'nails',
      keywords: ['gel polish', 'gel', 'long lasting', 'nail polish']
    }
  },

  // Additional FAQs
  {
    id: 'faq_all_services_001',
    category: 'faq',
    type: 'information',
    content_en: 'All Services: We offer Hair Services (Haircut, Coloring, Highlights, Styling, Treatment), Skin Services (Basic, Gold, Diamond Facials, Cleanup), Nail Services (Manicure, Pedicure, Nail Art, Gel Polish), and Bridal Services (Complete bridal packages with makeup and styling). All services include professional consultation and care.',
    content_ur: 'Sab Services: Hum Hair Services offer karte hain (Hair cut, Coloring, Highlights, Styling, Treatment), Skin Services (Basic, Gold, Diamond Facials, Cleanup), Nail Services (Manicure, Pedicure, Nail Art, Gel Polish), aur Bridal Services (Complete bridal packages with makeup aur styling). Sab services mein professional consultation aur care shamil hai.',
    metadata: {
      faq_type: 'all_services',
      keywords: ['all services', 'sab services', 'kon kon si', 'what services', 'services list']
    }
  },
  {
    id: 'faq_walk_in_001',
    category: 'faq',
    type: 'information',
    content_en: 'Walk-in Appointments: Yes, we accept walk-in customers based on availability. However, advance booking is recommended especially for weekends and popular time slots. For bridal services and special treatments, advance booking is required.',
    content_ur: 'Walk-in Appointments: Haan, hum availability ke basis par walk-in customers accept karte hain. Lekin advance booking recommend hai especially weekends aur popular time slots ke liye. Bridal services aur special treatments ke liye advance booking zaruri hai.',
    metadata: {
      faq_type: 'walk_in',
      keywords: ['walk in', 'walk-in', 'direct', 'without booking', 'same day']
    }
  },
  {
    id: 'faq_parking_001',
    category: 'faq',
    type: 'information',
    content_en: 'Parking: Yes, we have parking available in the basement. Parking is free for our customers. The salon is easily accessible and located in Clifton, Karachi near Do Darya.',
    content_ur: 'Parking: Haan, humare paas basement mein parking available hai. Customers ke liye parking free hai. Salon easily accessible hai aur Clifton, Karachi mein Do Darya ke qareeb located hai.',
    metadata: {
      faq_type: 'parking',
      keywords: ['parking', 'car', 'vehicle', 'basement']
    }
  },
  {
    id: 'faq_group_booking_001',
    category: 'faq',
    type: 'information',
    content_en: 'Group Bookings: Yes, we accept group bookings for parties, events, and special occasions. Please call us in advance to discuss group packages and availability. We offer special rates for group bookings.',
    content_ur: 'Group Bookings: Haan, hum parties, events, aur special occasions ke liye group bookings accept karte hain. Group packages aur availability ke liye advance mein call karein. Group bookings ke liye special rates offer karte hain.',
    metadata: {
      faq_type: 'group_booking',
      keywords: ['group', 'party', 'event', 'multiple', 'together']
    }
  },
  {
    id: 'faq_products_001',
    category: 'faq',
    type: 'information',
    content_en: 'Products: We use premium, professional-grade products for all our services. We also have a range of hair care, skin care, and nail care products available for purchase. Our staff can recommend products based on your needs.',
    content_ur: 'Products: Hum sab services ke liye premium, professional-grade products use karte hain. Humare paas hair care, skin care, aur nail care products bhi available hain purchase ke liye. Hamare staff aapki needs ke basis par products recommend kar sakte hain.',
    metadata: {
      faq_type: 'products',
      keywords: ['products', 'shampoo', 'conditioner', 'cream', 'buy', 'purchase']
    }
  },
  {
    id: 'faq_gift_vouchers_001',
    category: 'faq',
    type: 'information',
    content_en: 'Gift Vouchers: Yes, we offer gift vouchers for all our services. Gift vouchers are perfect for birthdays, anniversaries, or any special occasion. You can purchase them at the salon or call us for more information.',
    content_ur: 'Gift Vouchers: Haan, hum sab services ke liye gift vouchers offer karte hain. Gift vouchers birthdays, anniversaries, ya kisi bhi special occasion ke liye perfect hain. Aap salon par purchase kar sakte hain ya information ke liye call kar sakte hain.',
    metadata: {
      faq_type: 'gift_voucher',
      keywords: ['gift', 'voucher', 'present', 'gift card']
    }
  },

  // Greetings and General Queries
  {
    id: 'greeting_001',
    category: 'general',
    type: 'information',
    content_en: 'Greeting: Hello! Welcome to our salon! I am your friendly AI assistant. I can help you with information about our services, prices, bookings, location, and policies. Feel free to ask me anything about our salon. How can I assist you today?',
    content_ur: 'Greeting: Hello! Hamare salon mein aapka swagat hai! Main aapka friendly AI assistant hoon. Main aapki services, prices, bookings, location, aur policies ke baare mein madad kar sakta hoon. Aap mujhse salon ke baare mein kuch bhi pooch sakte hain. Main aapki kaise madad kar sakta hoon?',
    metadata: {
      type: 'greeting',
      keywords: ['hello', 'hi', 'hy', 'hey', 'greeting', 'salam', 'assalam', 'namaste', 'start', 'begin']
    }
  },
  {
    id: 'greeting_002',
    category: 'general',
    type: 'information',
    content_en: 'Welcome Message: Hi there! Welcome to our premium salon. I am here to help you with all your queries about our services, pricing, appointments, and more. What would you like to know?',
    content_ur: 'Welcome Message: Hi! Hamare premium salon mein aapka swagat hai. Main yahan hoon aapki sab queries ke liye - services, pricing, appointments, aur bhi bahut kuch. Aap kya janna chahte hain?',
    metadata: {
      type: 'greeting',
      keywords: ['welcome', 'help', 'assist', 'information', 'info', 'madad', 'help chahiye']
    }
  },

  // Detailed Service Information
  {
    id: 'service_haircut_detailed_001',
    category: 'hair',
    type: 'service',
    content_en: 'Haircut Detailed: Professional haircut service by experienced stylists. Price: PKR 1,500. Duration: 45 minutes. Includes: Hair wash, professional cutting, blow dry, and styling. Available for both men and women. Our stylists provide consultation before cutting to understand your preferences. Walk-in available but advance booking recommended for weekends.',
    content_ur: 'Hair cut Detailed: Tajarbakaar stylists ke zariye professional hair cut service. Price: PKR 1,500. Duration: 45 minutes. Includes: Hair wash, professional cutting, blow dry, aur styling. Men aur women dono ke liye available hai. Hamare stylists cutting se pehle consultation dete hain aapki preferences samajhne ke liye. Walk-in available hai lekin weekends ke liye advance booking recommend hai.',
    metadata: {
      service_name: 'Haircut',
      price: 1500,
      keywords: ['haircut', 'hair cut', 'cut', 'trim', 'haircut details', 'haircut service', 'haircut price', 'haircut cost']
    }
  },
  {
    id: 'service_facial_detailed_001',
    category: 'skin',
    type: 'service',
    content_en: 'Facial Services Detailed: We offer three types of facials. Basic Facial: PKR 2,000 (45 min) - Deep cleansing, exfoliation, mask, moisturizing. Gold Facial: PKR 3,500 (60 min) - Premium facial with gold dust massage, gold mask for brightening, most popular. Diamond Facial: PKR 5,000 (75 min) - Luxury treatment with diamond particles, premium moisturizing. All facials include consultation and product recommendations.',
    content_ur: 'Facial Services Detailed: Hum teen types ke facials offer karte hain. Basic Facial: PKR 2,000 (45 min) - Deep cleansing, exfoliation, mask, moisturizing. Gold Facial: PKR 3,500 (60 min) - Premium facial with gold dust massage, gold mask for brightening, sabse popular. Diamond Facial: PKR 5,000 (75 min) - Luxury treatment with diamond particles, premium moisturizing. Sab facials mein consultation aur product recommendations shamil hain.',
    metadata: {
      service_name: 'Facials',
      keywords: ['facial', 'facials', 'skin care', 'facial treatment', 'facial price', 'facial cost', 'facial options']
    }
  },

  // More FAQs
  {
    id: 'faq_timing_001',
    category: 'faq',
    type: 'information',
    content_en: 'Best Time to Visit: Weekdays (Monday to Friday) are usually less crowded. Weekends (Saturday and Sunday) are busier, so advance booking is recommended. Morning slots (10 AM to 2 PM) are generally more available. Evening slots (5 PM to 8 PM) are popular and may require advance booking.',
    content_ur: 'Best Time to Visit: Weekdays (Monday se Friday) usually kam crowded hote hain. Weekends (Saturday aur Sunday) busy hote hain, isliye advance booking recommend hai. Morning slots (10 AM se 2 PM) generally zyada available hote hain. Evening slots (5 PM se 8 PM) popular hain aur advance booking chahiye ho sakti hai.',
    metadata: {
      faq_type: 'timing',
      keywords: ['best time', 'when to come', 'busy time', 'available time', 'timing', 'kab aana', 'best slot', 'time slot']
    }
  },
  {
    id: 'faq_duration_001',
    category: 'faq',
    type: 'information',
    content_en: 'Service Duration: Haircut takes 45 minutes. Hair coloring and highlights take 2-3 hours. Facials take 45-75 minutes depending on type. Manicure takes 45 minutes, Pedicure takes 60 minutes. Hair styling takes 1-2 hours. Please arrive on time for your appointment to avoid delays.',
    content_ur: 'Service Duration: Hair cut 45 minutes ka hai. Hair coloring aur highlights 2-3 hours lete hain. Facials 45-75 minutes lete hain type ke hisaab se. Manicure 45 minutes, Pedicure 60 minutes. Hair styling 1-2 hours leti hai. Appointment ke liye time par pahunchne ka khyal rakhein delays se bachne ke liye.',
    metadata: {
      faq_type: 'duration',
      keywords: ['duration', 'time', 'kitna time', 'how long', 'kitne minutes', 'kitne hours', 'service time', 'treatment time']
    }
  },
  {
    id: 'faq_rescheduling_001',
    category: 'faq',
    type: 'information',
    content_en: 'Rescheduling: Yes, you can reschedule your appointment. Please call us at least 2 hours before your scheduled time to reschedule without any charges. You can reschedule to any available slot. For rescheduling, please call or WhatsApp us.',
    content_ur: 'Rescheduling: Haan, aap apni appointment reschedule kar sakte hain. Reschedule karne ke liye kam se kam 2 ghante pehle call karein bina kisi charge ke. Aap kisi bhi available slot mein reschedule kar sakte hain. Rescheduling ke liye call ya WhatsApp karein.',
    metadata: {
      faq_type: 'rescheduling',
      keywords: ['reschedule', 'change appointment', 'postpone', 'shift', 'badalna', 'change time', 'reschedule appointment']
    }
  },
  {
    id: 'faq_discount_001',
    category: 'faq',
    type: 'information',
    content_en: 'Discounts and Offers: We offer special discounts on combo packages. Hair cut with facial combo available. Group bookings get special rates. Seasonal offers and promotions are announced on our social media. For current offers, please call us or check our social media pages.',
    content_ur: 'Discounts aur Offers: Hum combo packages par special discounts offer karte hain. Hair cut with facial combo available hai. Group bookings par special rates milte hain. Seasonal offers aur promotions hamare social media par announce kiye jate hain. Current offers ke liye call karein ya social media pages check karein.',
    metadata: {
      faq_type: 'discount',
      keywords: ['discount', 'offer', 'promotion', 'deal', 'combo', 'package', 'special', 'sasta', 'discount hai', 'offer hai']
    }
  },
  {
    id: 'faq_children_001',
    category: 'faq',
    type: 'information',
    content_en: 'Children Services: Yes, we provide services for children. Children haircuts are available. We have special rates for children services. Please call us to discuss children services and pricing. Our staff is experienced in working with children.',
    content_ur: 'Children Services: Haan, hum children ke liye services provide karte hain. Children hair cuts available hain. Children services ke liye special rates hain. Children services aur pricing ke liye call karein. Hamare staff children ke saath kaam karne mein tajarbakaar hain.',
    metadata: {
      faq_type: 'children',
      keywords: ['children', 'kids', 'bachon', 'bache', 'child', 'kid service', 'children service']
    }
  },
  {
    id: 'faq_emergency_001',
    category: 'faq',
    type: 'information',
    content_en: 'Emergency Cancellation: We understand emergencies happen. If you have a genuine emergency and need to cancel or reschedule, please call us as soon as possible. We will try to accommodate your situation. For emergencies, charges may be waived on case-by-case basis.',
    content_ur: 'Emergency Cancellation: Hum samajhte hain ke emergencies ho sakti hain. Agar aapke paas genuine emergency hai aur cancel ya reschedule karna hai, jald se jald call karein. Hum aapki situation ko accommodate karne ki koshish karenge. Emergencies ke liye charges case-by-case basis par waive kiye ja sakte hain.',
    metadata: {
      faq_type: 'emergency',
      keywords: ['emergency', 'urgent', 'emergency cancel', 'emergency situation', 'zarurat', 'emergency hai']
    }
  },
  {
    id: 'faq_staff_001',
    category: 'faq',
    type: 'information',
    content_en: 'Staff: We have experienced and professional stylists. All our staff members are trained and certified. Our stylists have years of experience in hair, skin, and nail care. You can request a specific stylist when booking. All staff members are friendly and professional.',
    content_ur: 'Staff: Humare paas tajarbakaar aur professional stylists hain. Hamare sab staff members trained aur certified hain. Hamare stylists ko hair, skin, aur nail care mein years ka experience hai. Booking karte waqt aap specific stylist request kar sakte hain. Sab staff members friendly aur professional hain.',
    metadata: {
      faq_type: 'staff',
      keywords: ['staff', 'stylist', 'stylists', 'staff members', 'workers', 'employees', 'kaun karta hai', 'stylist ka naam']
    }
  },
  {
    id: 'faq_hygiene_001',
    category: 'faq',
    type: 'information',
    content_en: 'Hygiene and Safety: We maintain the highest standards of hygiene and safety. All tools and equipment are sanitized after each use. We use disposable items where possible. Our salon is cleaned regularly. We follow all health and safety protocols. Your safety and hygiene is our priority.',
    content_ur: 'Hygiene aur Safety: Hum hygiene aur safety ke highest standards maintain karte hain. Sab tools aur equipment har use ke baad sanitize kiye jate hain. Hum disposable items use karte hain jahan possible ho. Hamara salon regularly clean hota hai. Hum sab health aur safety protocols follow karte hain. Aapki safety aur hygiene hamari priority hai.',
    metadata: {
      faq_type: 'hygiene',
      keywords: ['hygiene', 'clean', 'safety', 'sanitize', 'cleanliness', 'safai', 'safety measures', 'hygiene standards']
    }
  },
  {
    id: 'faq_wifi_001',
    category: 'faq',
    type: 'information',
    content_en: 'Amenities: We provide free WiFi for our customers. We have comfortable seating areas. Refreshments are available. We have magazines and reading material. The salon is air-conditioned for your comfort. We provide lockers for your belongings.',
    content_ur: 'Amenities: Hum customers ke liye free WiFi provide karte hain. Humare paas comfortable seating areas hain. Refreshments available hain. Humare paas magazines aur reading material hai. Salon air-conditioned hai aapki comfort ke liye. Hum aapke belongings ke liye lockers provide karte hain.',
    metadata: {
      faq_type: 'amenities',
      keywords: ['wifi', 'internet', 'amenities', 'facilities', 'refreshments', 'locker', 'comfort', 'facilities hain']
    }
  },
  {
    id: 'faq_social_media_001',
    category: 'faq',
    type: 'information',
    content_en: 'Social Media: Yes, we are on social media! Follow us on Facebook, Instagram, and other platforms to see our work, get updates on offers, and see customer reviews. You can also message us on social media for inquiries. Our social media handles are updated regularly with new work and offers.',
    content_ur: 'Social Media: Haan, hum social media par hain! Facebook, Instagram, aur other platforms par follow karein hamara kaam dekhne, offers ke updates lene, aur customer reviews dekhne ke liye. Aap social media par inquiries ke liye message bhi kar sakte hain. Hamare social media handles regularly new work aur offers ke saath update hote hain.',
    metadata: {
      faq_type: 'social_media',
      keywords: ['social media', 'facebook', 'instagram', 'follow', 'social', 'page', 'profile', 'social media handle']
    }
  },
  {
    id: 'faq_reviews_001',
    category: 'faq',
    type: 'information',
    content_en: 'Reviews and Feedback: We value your feedback! After your service, you can leave a review on our social media pages or Google. Your feedback helps us improve. We appreciate positive reviews and take negative feedback seriously to improve our services. Thank you for choosing us!',
    content_ur: 'Reviews aur Feedback: Hum aapki feedback ko value karte hain! Service ke baad aap hamare social media pages ya Google par review de sakte hain. Aapki feedback hamari improvement mein madad karti hai. Hum positive reviews appreciate karte hain aur negative feedback ko seriously lete hain apni services improve karne ke liye. Humhe choose karne ke liye shukriya!',
    metadata: {
      faq_type: 'reviews',
      keywords: ['review', 'feedback', 'rating', 'review dena', 'feedback dena', 'rate', 'reviews kya hain']
    }
  },

  // Contact Variations
  {
    id: 'contact_variations_001',
    category: 'info',
    type: 'information',
    content_en: 'Contact Us: You can reach us by phone at +92-300-1234567 or WhatsApp at +92-300-1234567. We are available during operating hours: Monday to Saturday 10 AM to 8 PM, Sunday 12 PM to 6 PM. You can also visit us at Shop #45, Main Boulevard, Clifton, Karachi. For urgent matters, please call us directly.',
    content_ur: 'Contact Us: Aap phone par +92-300-1234567 ya WhatsApp par +92-300-1234567 se humse contact kar sakte hain. Hum operating hours mein available hain: Monday se Saturday 10 AM se 8 PM, Sunday 12 PM se 6 PM. Aap humse Shop #45, Main Boulevard, Clifton, Karachi par bhi mil sakte hain. Urgent matters ke liye directly call karein.',
    metadata: {
      type: 'contact',
      keywords: ['contact', 'call', 'phone', 'whatsapp', 'number', 'reach', 'connect', 'contact karna', 'call karna', 'number chahiye', 'phone number']
    }
  },

  // Location Variations
  {
    id: 'location_variations_001',
    category: 'info',
    type: 'information',
    content_en: 'Location Details: Our salon is located at Shop #45, Main Boulevard, Clifton, Karachi. We are near Do Darya. The location is easily accessible by car, bike, or public transport. We have basement parking available. The area is safe and well-connected. You can use Google Maps to find us easily.',
    content_ur: 'Location Details: Hamara salon Shop #45, Main Boulevard, Clifton, Karachi mein located hai. Hum Do Darya ke qareeb hain. Location car, bike, ya public transport se easily accessible hai. Humare paas basement parking available hai. Area safe aur well-connected hai. Aap Google Maps use karke easily hume find kar sakte hain.',
    metadata: {
      type: 'location',
      keywords: ['location', 'address', 'where', 'kahan', 'address kya hai', 'location kahan hai', 'kahan par hai', 'location details', 'find', 'directions']
    }
  },

  // Operating Hours Variations
  {
    id: 'hours_variations_001',
    category: 'info',
    type: 'information',
    content_en: 'Operating Hours: We are open Monday to Saturday from 10:00 AM to 8:00 PM. On Sunday, we are open from 12:00 PM to 6:00 PM. We are closed on public holidays. Last appointment is usually 1 hour before closing time. Walk-ins are welcome based on availability.',
    content_ur: 'Operating Hours: Hum Monday se Saturday 10:00 AM se 8:00 PM tak open hain. Sunday ko hum 12:00 PM se 6:00 PM tak open hain. Public holidays par closed hain. Last appointment usually closing time se 1 hour pehle hoti hai. Availability ke basis par walk-ins welcome hain.',
    metadata: {
      type: 'hours',
      keywords: ['hours', 'timing', 'open', 'closed', 'kab open', 'kab closed', 'timing kya hai', 'hours kya hain', 'operating hours', 'working hours', 'kab tak open']
    }
  }
];

/**
 * Main ingestion function
 */
async function ingestKnowledgeBase() {
  try {
    console.log('🚀 Starting knowledge base ingestion...');

    // Initialize vector database
    await initializeVectorDB();

    // Check if collection already has data
    const stats = await getCollectionStats();
    if (stats.count > 0) {
      console.log(`⚠️  Collection already has ${stats.count} documents.`);
      console.log('   Clearing existing collection to re-ingest with updated data...');
      
      // Delete and recreate collection
      try {
        const url = process.env.QDRANT_URL || 'http://localhost:6333';
        const apiKey = process.env.QDRANT_API_KEY;
        const clientConfig = { url };
        if (apiKey) clientConfig.apiKey = apiKey;
        
        const client = new QdrantClient(clientConfig);
        const collectionName = 'salon_knowledge_base';
        
        await client.deleteCollection(collectionName);
        console.log('   ✅ Old collection deleted');
        
        // Recreate collection
        const vectorSize = 1536;
        await client.createCollection(collectionName, {
          vectors: {
            size: vectorSize,
            distance: 'Cosine'
          }
        });
        console.log('   ✅ New collection created');
      } catch (error) {
        console.error('   ❌ Error clearing collection:', error.message);
        process.exit(1);
      }
    }

    // Prepare documents (combine English and Urdu content for better retrieval)
    const documents = knowledgeBase.map(doc => ({
      id: doc.id,
      content: `${doc.content_en}\n\n${doc.content_ur}`, // Combine both languages
      metadata: {
        ...doc.metadata,
        category: doc.category,
        type: doc.type,
        content_en: doc.content_en,
        content_ur: doc.content_ur
      }
    }));

    console.log(`📝 Generating embeddings for ${documents.length} documents...`);
    
    // Generate embeddings
    const contents = documents.map(doc => doc.content);
    const embeddings = await generateEmbeddings(contents);

    console.log('💾 Adding documents to vector database...');
    
    // Add to vector database
    await addDocuments(documents, embeddings);

    // Verify
    const finalStats = await getCollectionStats();
    console.log(`✅ Successfully ingested ${finalStats.count} documents!`);
    console.log('🎉 Knowledge base is ready to use!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error ingesting knowledge base:', error);
    process.exit(1);
  }
}

// Run ingestion
ingestKnowledgeBase();

