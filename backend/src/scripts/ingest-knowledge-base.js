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
  },

  // Hair Treatments - Advanced
  {
    id: 'service_keratin_001',
    category: 'hair',
    type: 'service',
    content_en: 'Keratin Treatment: Smoothing and straightening treatment for frizzy hair. Duration: 3-4 hours. Price: PKR 8,000 (starts from). Results last 3-6 months. Includes hair wash, keratin application, heat styling, and aftercare instructions. Makes hair smooth, shiny, and manageable.',
    content_ur: 'Keratin Treatment: Frizzy hair ke liye smoothing aur straightening treatment. Duration: 3-4 hours. Price: PKR 8,000 se start hota hai. Results 3-6 months tak rehte hain. Hair wash, keratin application, heat styling, aur aftercare instructions shamil hain. Hair smooth, shiny, aur manageable ban jate hain.',
    metadata: {
      service_name: 'Keratin Treatment',
      price: 8000,
      currency: 'PKR',
      duration_minutes: 210,
      category: 'hair',
      keywords: ['keratin', 'smoothing', 'straightening', 'frizz', 'smooth hair', 'brazilian blowout']
    }
  },
  {
    id: 'service_rebonding_001',
    category: 'hair',
    type: 'service',
    content_en: 'Hair Rebonding: Permanent hair straightening treatment. Duration: 4-5 hours. Price: PKR 10,000 (starts from). Long-lasting results. Includes consultation, chemical application, heat treatment, and styling. Perfect for naturally curly or wavy hair.',
    content_ur: 'Hair Rebonding: Permanent hair straightening treatment. Duration: 4-5 hours. Price: PKR 10,000 se start hota hai. Long-lasting results hain. Consultation, chemical application, heat treatment, aur styling shamil hai. Naturally curly ya wavy hair ke liye perfect hai.',
    metadata: {
      service_name: 'Hair Rebonding',
      price: 10000,
      currency: 'PKR',
      duration_minutes: 270,
      category: 'hair',
      keywords: ['rebonding', 'straightening', 'permanent', 'straight hair', 'curly hair treatment']
    }
  },
  {
    id: 'service_protein_treatment_001',
    category: 'hair',
    type: 'service',
    content_en: 'Protein Treatment: Intensive repair treatment for damaged hair. Duration: 60 minutes. Price: PKR 3,500. Strengthens hair, reduces breakage, and adds shine. Includes deep conditioning and protein mask application. Recommended for chemically treated or heat-damaged hair.',
    content_ur: 'Protein Treatment: Damaged hair ke liye intensive repair treatment. Duration: 60 minutes. Price: PKR 3,500. Hair ko strong karta hai, breakage kam karta hai, aur shine add karta hai. Deep conditioning aur protein mask application shamil hai. Chemically treated ya heat-damaged hair ke liye recommend hai.',
    metadata: {
      service_name: 'Protein Treatment',
      price: 3500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'hair',
      keywords: ['protein', 'treatment', 'repair', 'damaged hair', 'strengthen', 'hair repair']
    }
  },
  {
    id: 'service_olaplex_001',
    category: 'hair',
    type: 'service',
    content_en: 'Olaplex Treatment: Bond-building treatment that repairs damaged hair. Duration: 45 minutes. Price: PKR 4,500. Restores hair health from chemical damage, heat styling, and color treatments. Can be added to any color service for extra protection.',
    content_ur: 'Olaplex Treatment: Bond-building treatment jo damaged hair ko repair karta hai. Duration: 45 minutes. Price: PKR 4,500. Chemical damage, heat styling, aur color treatments se hair health restore karta hai. Extra protection ke liye kisi bhi color service mein add kar sakte hain.',
    metadata: {
      service_name: 'Olaplex Treatment',
      price: 4500,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'hair',
      keywords: ['olaplex', 'bond building', 'repair', 'restore', 'damaged hair treatment']
    }
  },
  {
    id: 'service_scalp_treatment_001',
    category: 'hair',
    type: 'service',
    content_en: 'Scalp Treatment: Deep cleansing and nourishing treatment for scalp health. Duration: 45 minutes. Price: PKR 2,500. Addresses dandruff, itchiness, oiliness, and dryness. Includes scalp massage, treatment mask, and recommendations for home care.',
    content_ur: 'Scalp Treatment: Scalp health ke liye deep cleansing aur nourishing treatment. Duration: 45 minutes. Price: PKR 2,500. Dandruff, itchiness, oiliness, aur dryness ka ilaj karta hai. Scalp massage, treatment mask, aur home care recommendations shamil hain.',
    metadata: {
      service_name: 'Scalp Treatment',
      price: 2500,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'hair',
      keywords: ['scalp', 'dandruff', 'scalp treatment', 'itchy scalp', 'dry scalp', 'oily scalp']
    }
  },

  // Hair Coloring - Advanced
  {
    id: 'service_balayage_001',
    category: 'hair',
    type: 'service',
    content_en: 'Balayage: Hand-painted highlights for natural-looking dimension. Duration: 3-4 hours. Price: PKR 6,000 (starts from). Creates a sun-kissed effect with subtle color gradation. Low maintenance, grows out beautifully. Includes consultation, color application, toning, and styling.',
    content_ur: 'Balayage: Natural-looking dimension ke liye hand-painted highlights. Duration: 3-4 hours. Price: PKR 6,000 se start hota hai. Sun-kissed effect create karta hai subtle color gradation ke saath. Low maintenance hai, beautifully grow out hota hai. Consultation, color application, toning, aur styling shamil hai.',
    metadata: {
      service_name: 'Balayage',
      price: 6000,
      currency: 'PKR',
      duration_minutes: 210,
      category: 'hair',
      keywords: ['balayage', 'hand painted', 'highlights', 'natural color', 'sun kissed', 'ombre']
    }
  },
  {
    id: 'service_ombre_001',
    category: 'hair',
    type: 'service',
    content_en: 'Ombre Hair Color: Gradient color from dark roots to lighter ends. Duration: 3-4 hours. Price: PKR 5,500 (starts from). Creates a dramatic yet natural transition. Multiple color options available. Includes bleaching, toning, treatment, and styling.',
    content_ur: 'Ombre Hair Color: Dark roots se lighter ends tak gradient color. Duration: 3-4 hours. Price: PKR 5,500 se start hota hai. Dramatic yet natural transition create karta hai. Multiple color options available hain. Bleaching, toning, treatment, aur styling shamil hai.',
    metadata: {
      service_name: 'Ombre',
      price: 5500,
      currency: 'PKR',
      duration_minutes: 210,
      category: 'hair',
      keywords: ['ombre', 'gradient', 'two tone', 'color transition', 'dark to light']
    }
  },
  {
    id: 'service_root_touch_up_001',
    category: 'hair',
    type: 'service',
    content_en: 'Root Touch-Up: Covers regrowth and gray roots. Duration: 1-1.5 hours. Price: PKR 2,000. Quick service for maintaining your color. Matches existing hair color perfectly. Includes application and styling.',
    content_ur: 'Root Touch-Up: Regrowth aur gray roots ko cover karta hai. Duration: 1-1.5 hours. Price: PKR 2,000. Color maintain karne ke liye quick service. Existing hair color ke saath perfectly match karta hai. Application aur styling shamil hai.',
    metadata: {
      service_name: 'Root Touch-Up',
      price: 2000,
      currency: 'PKR',
      duration_minutes: 75,
      category: 'hair',
      keywords: ['root', 'touch up', 'gray coverage', 'regrowth', 'color maintenance']
    }
  },
  {
    id: 'service_fashion_colors_001',
    category: 'hair',
    type: 'service',
    content_en: 'Fashion Colors: Vibrant colors like purple, blue, pink, green. Duration: 3-4 hours. Price: PKR 7,000 (starts from). Bold and trendy colors. May require pre-lightening. Includes consultation, color application, and styling. Perfect for making a statement.',
    content_ur: 'Fashion Colors: Vibrant colors jaise purple, blue, pink, green. Duration: 3-4 hours. Price: PKR 7,000 se start hota hai. Bold aur trendy colors. Pre-lightening ki zarurat ho sakti hai. Consultation, color application, aur styling shamil hai. Statement banane ke liye perfect hai.',
    metadata: {
      service_name: 'Fashion Colors',
      price: 7000,
      currency: 'PKR',
      duration_minutes: 210,
      category: 'hair',
      keywords: ['fashion color', 'vibrant', 'purple', 'blue', 'pink', 'green', 'trendy color', 'bold color']
    }
  },

  // Skin Treatments - Advanced
  {
    id: 'service_chemical_peel_001',
    category: 'skin',
    type: 'service',
    content_en: 'Chemical Peel: Exfoliating treatment for skin renewal. Duration: 45 minutes. Price: PKR 4,000. Improves skin texture, reduces acne scars, and brightens complexion. Multiple peel types available (glycolic, lactic, salicylic). Includes consultation and aftercare products.',
    content_ur: 'Chemical Peel: Skin renewal ke liye exfoliating treatment. Duration: 45 minutes. Price: PKR 4,000. Skin texture improve karta hai, acne scars kam karta hai, aur complexion bright karta hai. Multiple peel types available hain (glycolic, lactic, salicylic). Consultation aur aftercare products shamil hain.',
    metadata: {
      service_name: 'Chemical Peel',
      price: 4000,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'skin',
      keywords: ['chemical peel', 'peel', 'exfoliation', 'acne scars', 'skin renewal', 'glycolic']
    }
  },
  {
    id: 'service_microdermabrasion_001',
    category: 'skin',
    type: 'service',
    content_en: 'Microdermabrasion: Non-invasive exfoliation treatment. Duration: 60 minutes. Price: PKR 4,500. Removes dead skin cells, reduces fine lines, and improves skin texture. Safe for all skin types. Includes cleansing, treatment, mask, and moisturizing.',
    content_ur: 'Microdermabrasion: Non-invasive exfoliation treatment. Duration: 60 minutes. Price: PKR 4,500. Dead skin cells remove karta hai, fine lines kam karta hai, aur skin texture improve karta hai. Sab skin types ke liye safe hai. Cleansing, treatment, mask, aur moisturizing shamil hai.',
    metadata: {
      service_name: 'Microdermabrasion',
      price: 4500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'skin',
      keywords: ['microdermabrasion', 'exfoliation', 'dead skin', 'fine lines', 'skin texture']
    }
  },
  {
    id: 'service_hydrafacial_001',
    category: 'skin',
    type: 'service',
    content_en: 'HydraFacial: Advanced facial treatment combining cleansing, exfoliation, extraction, hydration, and antioxidant protection. Duration: 60 minutes. Price: PKR 6,000. Suitable for all skin types. Immediate results with no downtime. Most popular facial treatment.',
    content_ur: 'HydraFacial: Advanced facial treatment jo cleansing, exfoliation, extraction, hydration, aur antioxidant protection combine karta hai. Duration: 60 minutes. Price: PKR 6,000. Sab skin types ke liye suitable hai. Immediate results milte hain bina kisi downtime ke. Sabse popular facial treatment hai.',
    metadata: {
      service_name: 'HydraFacial',
      price: 6000,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'skin',
      keywords: ['hydrafacial', 'hydra facial', 'advanced facial', 'deep cleansing', 'hydration']
    }
  },
  {
    id: 'service_oxygen_facial_001',
    category: 'skin',
    type: 'service',
    content_en: 'Oxygen Facial: Rejuvenating facial with oxygen infusion. Duration: 60 minutes. Price: PKR 5,000. Brightens skin, reduces fine lines, and boosts collagen. Includes cleansing, oxygen treatment, serum infusion, and mask. Perfect before special events.',
    content_ur: 'Oxygen Facial: Oxygen infusion ke saath rejuvenating facial. Duration: 60 minutes. Price: PKR 5,000. Skin ko bright karta hai, fine lines kam karta hai, aur collagen boost karta hai. Cleansing, oxygen treatment, serum infusion, aur mask shamil hai. Special events se pehle perfect hai.',
    metadata: {
      service_name: 'Oxygen Facial',
      price: 5000,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'skin',
      keywords: ['oxygen facial', 'oxygen', 'rejuvenation', 'collagen', 'anti aging']
    }
  },
  {
    id: 'service_acne_treatment_001',
    category: 'skin',
    type: 'service',
    content_en: 'Acne Treatment Facial: Specialized treatment for acne-prone skin. Duration: 60 minutes. Price: PKR 3,500. Deep cleansing, extractions, antibacterial mask, and treatment products. Helps prevent future breakouts. Includes home care recommendations.',
    content_ur: 'Acne Treatment Facial: Acne-prone skin ke liye specialized treatment. Duration: 60 minutes. Price: PKR 3,500. Deep cleansing, extractions, antibacterial mask, aur treatment products. Future breakouts prevent karne mein madad karta hai. Home care recommendations shamil hain.',
    metadata: {
      service_name: 'Acne Treatment',
      price: 3500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'skin',
      keywords: ['acne', 'acne treatment', 'pimples', 'breakout', 'acne prone', 'acne facial']
    }
  },
  {
    id: 'service_anti_aging_facial_001',
    category: 'skin',
    type: 'service',
    content_en: 'Anti-Aging Facial: Advanced treatment targeting wrinkles and fine lines. Duration: 75 minutes. Price: PKR 5,500. Includes collagen mask, peptide serum, facial massage, and LED therapy. Improves skin firmness and elasticity. Recommended monthly.',
    content_ur: 'Anti-Aging Facial: Wrinkles aur fine lines target karne wala advanced treatment. Duration: 75 minutes. Price: PKR 5,500. Collagen mask, peptide serum, facial massage, aur LED therapy shamil hai. Skin firmness aur elasticity improve karta hai. Monthly recommend hai.',
    metadata: {
      service_name: 'Anti-Aging Facial',
      price: 5500,
      currency: 'PKR',
      duration_minutes: 75,
      category: 'skin',
      keywords: ['anti aging', 'wrinkles', 'fine lines', 'aging', 'collagen', 'firmness']
    }
  },
  {
    id: 'service_brightening_facial_001',
    category: 'skin',
    type: 'service',
    content_en: 'Brightening Facial: Skin brightening and pigmentation treatment. Duration: 60 minutes. Price: PKR 4,000. Reduces dark spots, evens skin tone, and adds radiance. Includes vitamin C serum, brightening mask, and sun protection. Great for dull skin.',
    content_ur: 'Brightening Facial: Skin brightening aur pigmentation treatment. Duration: 60 minutes. Price: PKR 4,000. Dark spots kam karta hai, skin tone even karta hai, aur radiance add karta hai. Vitamin C serum, brightening mask, aur sun protection shamil hai. Dull skin ke liye great hai.',
    metadata: {
      service_name: 'Brightening Facial',
      price: 4000,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'skin',
      keywords: ['brightening', 'dark spots', 'pigmentation', 'skin tone', 'radiance', 'dull skin']
    }
  },

  // Body Treatments
  {
    id: 'service_waxing_full_body_001',
    category: 'body',
    type: 'service',
    content_en: 'Full Body Waxing: Complete body hair removal. Duration: 90 minutes. Price: PKR 4,000. Includes arms, legs, underarms, and back. Smooth results lasting 3-4 weeks. We use premium wax suitable for sensitive skin.',
    content_ur: 'Full Body Waxing: Complete body hair removal. Duration: 90 minutes. Price: PKR 4,000. Arms, legs, underarms, aur back shamil hai. Smooth results 3-4 weeks tak rehte hain. Hum sensitive skin ke liye suitable premium wax use karte hain.',
    metadata: {
      service_name: 'Full Body Waxing',
      price: 4000,
      currency: 'PKR',
      duration_minutes: 90,
      category: 'body',
      keywords: ['waxing', 'full body', 'hair removal', 'body wax', 'wax']
    }
  },
  {
    id: 'service_waxing_half_arms_001',
    category: 'body',
    type: 'service',
    content_en: 'Half Arms Waxing: Hair removal for lower arms. Duration: 15 minutes. Price: PKR 500. Quick and effective. Suitable for all skin types.',
    content_ur: 'Half Arms Waxing: Lower arms ke liye hair removal. Duration: 15 minutes. Price: PKR 500. Quick aur effective. Sab skin types ke liye suitable hai.',
    metadata: {
      service_name: 'Half Arms Waxing',
      price: 500,
      currency: 'PKR',
      duration_minutes: 15,
      category: 'body',
      keywords: ['half arms', 'arms waxing', 'lower arms', 'wax']
    }
  },
  {
    id: 'service_waxing_full_arms_001',
    category: 'body',
    type: 'service',
    content_en: 'Full Arms Waxing: Complete arm hair removal. Duration: 25 minutes. Price: PKR 800. Includes upper and lower arms. Smooth finish.',
    content_ur: 'Full Arms Waxing: Complete arm hair removal. Duration: 25 minutes. Price: PKR 800. Upper aur lower arms shamil hain. Smooth finish.',
    metadata: {
      service_name: 'Full Arms Waxing',
      price: 800,
      currency: 'PKR',
      duration_minutes: 25,
      category: 'body',
      keywords: ['full arms', 'arms waxing', 'complete arms', 'wax']
    }
  },
  {
    id: 'service_waxing_half_legs_001',
    category: 'body',
    type: 'service',
    content_en: 'Half Legs Waxing: Hair removal for lower legs. Duration: 20 minutes. Price: PKR 800. Quick service for lower legs only.',
    content_ur: 'Half Legs Waxing: Lower legs ke liye hair removal. Duration: 20 minutes. Price: PKR 800. Sirf lower legs ke liye quick service.',
    metadata: {
      service_name: 'Half Legs Waxing',
      price: 800,
      currency: 'PKR',
      duration_minutes: 20,
      category: 'body',
      keywords: ['half legs', 'legs waxing', 'lower legs', 'wax']
    }
  },
  {
    id: 'service_waxing_full_legs_001',
    category: 'body',
    type: 'service',
    content_en: 'Full Legs Waxing: Complete leg hair removal. Duration: 35 minutes. Price: PKR 1,500. Includes upper and lower legs. Silky smooth results.',
    content_ur: 'Full Legs Waxing: Complete leg hair removal. Duration: 35 minutes. Price: PKR 1,500. Upper aur lower legs shamil hain. Silky smooth results.',
    metadata: {
      service_name: 'Full Legs Waxing',
      price: 1500,
      currency: 'PKR',
      duration_minutes: 35,
      category: 'body',
      keywords: ['full legs', 'legs waxing', 'complete legs', 'wax']
    }
  },
  {
    id: 'service_waxing_underarms_001',
    category: 'body',
    type: 'service',
    content_en: 'Underarms Waxing: Quick underarm hair removal. Duration: 10 minutes. Price: PKR 400. Gentle on sensitive skin. Results last 2-3 weeks.',
    content_ur: 'Underarms Waxing: Quick underarm hair removal. Duration: 10 minutes. Price: PKR 400. Sensitive skin par gentle. Results 2-3 weeks tak rehte hain.',
    metadata: {
      service_name: 'Underarms Waxing',
      price: 400,
      currency: 'PKR',
      duration_minutes: 10,
      category: 'body',
      keywords: ['underarms', 'underarm waxing', 'armpits', 'wax']
    }
  },
  {
    id: 'service_waxing_bikini_001',
    category: 'body',
    type: 'service',
    content_en: 'Bikini Waxing: Bikini line hair removal. Duration: 20 minutes. Price: PKR 1,000. Professional and comfortable service in private room. Sensitive skin friendly.',
    content_ur: 'Bikini Waxing: Bikini line hair removal. Duration: 20 minutes. Price: PKR 1,000. Private room mein professional aur comfortable service. Sensitive skin ke liye friendly.',
    metadata: {
      service_name: 'Bikini Waxing',
      price: 1000,
      currency: 'PKR',
      duration_minutes: 20,
      category: 'body',
      keywords: ['bikini', 'bikini waxing', 'bikini line', 'wax']
    }
  },
  {
    id: 'service_upper_lip_threading_001',
    category: 'body',
    type: 'service',
    content_en: 'Upper Lip Threading: Precise hair removal for upper lip. Duration: 5 minutes. Price: PKR 150. Quick and clean. Expert threading technique.',
    content_ur: 'Upper Lip Threading: Upper lip ke liye precise hair removal. Duration: 5 minutes. Price: PKR 150. Quick aur clean. Expert threading technique.',
    metadata: {
      service_name: 'Upper Lip Threading',
      price: 150,
      currency: 'PKR',
      duration_minutes: 5,
      category: 'body',
      keywords: ['upper lip', 'threading', 'lip hair', 'face threading']
    }
  },
  {
    id: 'service_eyebrow_threading_001',
    category: 'body',
    type: 'service',
    content_en: 'Eyebrow Threading: Perfect eyebrow shaping. Duration: 10 minutes. Price: PKR 250. Expert shaping to suit your face. Clean and precise technique.',
    content_ur: 'Eyebrow Threading: Perfect eyebrow shaping. Duration: 10 minutes. Price: PKR 250. Aapke face ke mutabiq expert shaping. Clean aur precise technique.',
    metadata: {
      service_name: 'Eyebrow Threading',
      price: 250,
      currency: 'PKR',
      duration_minutes: 10,
      category: 'body',
      keywords: ['eyebrow', 'threading', 'brow', 'eyebrow shaping', 'face threading']
    }
  },
  {
    id: 'service_full_face_threading_001',
    category: 'body',
    type: 'service',
    content_en: 'Full Face Threading: Complete facial hair removal. Duration: 20 minutes. Price: PKR 500. Includes eyebrows, upper lip, chin, and sides. Smooth and hair-free face.',
    content_ur: 'Full Face Threading: Complete facial hair removal. Duration: 20 minutes. Price: PKR 500. Eyebrows, upper lip, chin, aur sides shamil hain. Smooth aur hair-free face.',
    metadata: {
      service_name: 'Full Face Threading',
      price: 500,
      currency: 'PKR',
      duration_minutes: 20,
      category: 'body',
      keywords: ['full face', 'face threading', 'threading', 'facial hair', 'face hair removal']
    }
  },

  // Makeup Services
  {
    id: 'service_party_makeup_001',
    category: 'makeup',
    type: 'service',
    content_en: 'Party Makeup: Glamorous makeup for parties and events. Duration: 60 minutes. Price: PKR 3,500. Includes foundation, eyes, lips, and setting. Long-lasting formula. Perfect for birthdays, dinners, and celebrations.',
    content_ur: 'Party Makeup: Parties aur events ke liye glamorous makeup. Duration: 60 minutes. Price: PKR 3,500. Foundation, eyes, lips, aur setting shamil hai. Long-lasting formula. Birthdays, dinners, aur celebrations ke liye perfect hai.',
    metadata: {
      service_name: 'Party Makeup',
      price: 3500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'makeup',
      keywords: ['party makeup', 'makeup', 'party', 'event makeup', 'glamorous makeup']
    }
  },
  {
    id: 'service_engagement_makeup_001',
    category: 'makeup',
    type: 'service',
    content_en: 'Engagement Makeup: Special makeup for engagement ceremonies. Duration: 90 minutes. Price: PKR 8,000. Includes airbrush foundation, detailed eye makeup, contouring, highlighting, and false lashes. Trial session available. Long-lasting for photo shoots.',
    content_ur: 'Engagement Makeup: Engagement ceremonies ke liye special makeup. Duration: 90 minutes. Price: PKR 8,000. Airbrush foundation, detailed eye makeup, contouring, highlighting, aur false lashes shamil hain. Trial session available hai. Photo shoots ke liye long-lasting.',
    metadata: {
      service_name: 'Engagement Makeup',
      price: 8000,
      currency: 'PKR',
      duration_minutes: 90,
      category: 'makeup',
      keywords: ['engagement', 'engagement makeup', 'makeup', 'ceremony', 'special occasion']
    }
  },
  // Continuing from previous data with EXTENSIVE additions...

  // Mehendi/Henna Services
  {
    id: 'service_mehendi_makeup_001',
    category: 'makeup',
    type: 'service',
    content_en: 'Mehendi Makeup: Traditional makeup for mehendi events. Duration: 75 minutes. Price: PKR 5,000. Bright and colorful look. Includes hair styling and accessories placement. Perfect for mehendi function.',
    content_ur: 'Mehendi Makeup: Mehendi events ke liye traditional makeup. Duration: 75 minutes. Price: PKR 5,000. Bright aur colorful look. Hair styling aur accessories placement shamil hai. Mehendi function ke liye perfect hai.',
    metadata: {
      service_name: 'Mehendi Makeup',
      price: 5000,
      currency: 'PKR',
      duration_minutes: 75,
      category: 'makeup',
      keywords: ['mehendi', 'mehendi makeup', 'henna', 'mehndi', 'mehandi', 'traditional makeup']
    }
  },
  {
    id: 'service_bridal_mehndi_001',
    category: 'bridal',
    type: 'service',
    content_en: 'Bridal Mehndi Application: Intricate bridal henna designs. Duration: 3-4 hours. Price: PKR 5,000 (starts from). Traditional and modern designs available. Expert artists. Includes both hands full coverage, feet optional at extra cost.',
    content_ur: 'Bridal Mehndi Application: Intricate bridal henna designs. Duration: 3-4 hours. Price: PKR 5,000 se start hota hai. Traditional aur modern designs available hain. Expert artists. Dono hands full coverage shamil hai, feet optional extra cost par.',
    metadata: {
      service_name: 'Bridal Mehndi',
      price: 5000,
      currency: 'PKR',
      duration_minutes: 210,
      category: 'bridal',
      keywords: ['mehndi', 'mehendi', 'henna', 'bridal henna', 'bridal mehndi', 'henna design', 'mehandi']
    }
  },
  {
    id: 'service_simple_mehndi_001',
    category: 'body',
    type: 'service',
    content_en: 'Simple Mehndi: Basic henna designs for hands. Duration: 1 hour. Price: PKR 1,500. Simple yet beautiful patterns. Perfect for parties and events. Quick application.',
    content_ur: 'Simple Mehndi: Hands ke liye basic henna designs. Duration: 1 hour. Price: PKR 1,500. Simple yet beautiful patterns. Parties aur events ke liye perfect. Quick application.',
    metadata: {
      service_name: 'Simple Mehndi',
      price: 1500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'body',
      keywords: ['simple mehndi', 'mehndi', 'henna', 'basic henna', 'mehendi simple']
    }
  },
  {
    id: 'service_arabic_mehndi_001',
    category: 'body',
    type: 'service',
    content_en: 'Arabic Mehndi: Elegant Arabic henna patterns. Duration: 2 hours. Price: PKR 3,000. Bold and flowing designs. Popular choice for special occasions. Includes both hands.',
    content_ur: 'Arabic Mehndi: Elegant Arabic henna patterns. Duration: 2 hours. Price: PKR 3,000. Bold aur flowing designs. Special occasions ke liye popular choice. Dono hands shamil hain.',
    metadata: {
      service_name: 'Arabic Mehndi',
      price: 3000,
      currency: 'PKR',
      duration_minutes: 120,
      category: 'body',
      keywords: ['arabic mehndi', 'arabic henna', 'mehndi', 'henna', 'arabic design', 'arabic mehendi']
    }
  },

  // Spa & Massage Services
  {
    id: 'service_body_massage_001',
    category: 'spa',
    type: 'service',
    content_en: 'Full Body Massage: Relaxing therapeutic massage. Duration: 60 minutes. Price: PKR 3,500. Relieves stress and muscle tension. Uses premium oils. Professional therapist. Available for women only.',
    content_ur: 'Full Body Massage: Relaxing therapeutic massage. Duration: 60 minutes. Price: PKR 3,500. Stress aur muscle tension relieve karta hai. Premium oils use hote hain. Professional therapist. Sirf women ke liye available hai.',
    metadata: {
      service_name: 'Body Massage',
      price: 3500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'spa',
      keywords: ['massage', 'body massage', 'spa', 'relaxation', 'therapeutic massage', 'full body massage']
    }
  },
  {
    id: 'service_head_massage_001',
    category: 'spa',
    type: 'service',
    content_en: 'Head and Shoulder Massage: Targeted relief for upper body tension. Duration: 30 minutes. Price: PKR 1,500. Reduces headaches and stress. Promotes hair growth. Great for office workers.',
    content_ur: 'Head and Shoulder Massage: Upper body tension ke liye targeted relief. Duration: 30 minutes. Price: PKR 1,500. Headaches aur stress kam karta hai. Hair growth promote karta hai. Office workers ke liye great hai.',
    metadata: {
      service_name: 'Head Massage',
      price: 1500,
      currency: 'PKR',
      duration_minutes: 30,
      category: 'spa',
      keywords: ['head massage', 'shoulder massage', 'scalp massage', 'massage', 'relaxation']
    }
  },
  {
    id: 'service_foot_massage_001',
    category: 'spa',
    type: 'service',
    content_en: 'Foot Massage: Relaxing foot and leg massage. Duration: 30 minutes. Price: PKR 1,200. Improves circulation and relieves tired feet. Can be added to pedicure service.',
    content_ur: 'Foot Massage: Relaxing foot aur leg massage. Duration: 30 minutes. Price: PKR 1,200. Circulation improve karta hai aur tired feet relieve karta hai. Pedicure service mein add kar sakte hain.',
    metadata: {
      service_name: 'Foot Massage',
      price: 1200,
      currency: 'PKR',
      duration_minutes: 30,
      category: 'spa',
      keywords: ['foot massage', 'feet massage', 'leg massage', 'massage', 'relaxation']
    }
  },
  {
    id: 'service_body_scrub_001',
    category: 'spa',
    type: 'service',
    content_en: 'Body Scrub: Exfoliating body treatment. Duration: 45 minutes. Price: PKR 3,000. Removes dead skin cells and brightens skin. Multiple scrub options (coffee, sugar, salt). Includes moisturizing treatment.',
    content_ur: 'Body Scrub: Exfoliating body treatment. Duration: 45 minutes. Price: PKR 3,000. Dead skin cells remove karta hai aur skin brighten karta hai. Multiple scrub options (coffee, sugar, salt). Moisturizing treatment shamil hai.',
    metadata: {
      service_name: 'Body Scrub',
      price: 3000,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'spa',
      keywords: ['body scrub', 'scrub', 'exfoliation', 'body treatment', 'spa treatment']
    }
  },
  {
    id: 'service_body_polishing_001',
    category: 'spa',
    type: 'service',
    content_en: 'Body Polishing: Complete skin brightening treatment. Duration: 90 minutes. Price: PKR 5,000. Full body exfoliation and mask application. Whitening and brightening effect. Perfect for brides-to-be. Popular before weddings.',
    content_ur: 'Body Polishing: Complete skin brightening treatment. Duration: 90 minutes. Price: PKR 5,000. Full body exfoliation aur mask application. Whitening aur brightening effect. Brides-to-be ke liye perfect. Shaadiyon se pehle popular.',
    metadata: {
      service_name: 'Body Polishing',
      price: 5000,
      currency: 'PKR',
      duration_minutes: 90,
      category: 'spa',
      keywords: ['body polishing', 'polishing', 'whitening', 'brightening', 'bridal polishing', 'skin brightening']
    }
  },

  // Combo Packages
  {
    id: 'package_haircut_facial_001',
    category: 'packages',
    type: 'package',
    content_en: 'Haircut + Facial Combo: Value package combining haircut and basic facial. Price: PKR 3,200 (Save PKR 300). Duration: 90 minutes. Popular combination. Great for monthly maintenance.',
    content_ur: 'Haircut + Facial Combo: Haircut aur basic facial ka value package. Price: PKR 3,200 (PKR 300 bachaen). Duration: 90 minutes. Popular combination. Monthly maintenance ke liye great.',
    metadata: {
      service_name: 'Haircut Facial Combo',
      price: 3200,
      currency: 'PKR',
      category: 'packages',
      keywords: ['combo', 'package', 'haircut facial', 'combo deal', 'discount package', 'combo offer']
    }
  },
  {
    id: 'package_mani_pedi_001',
    category: 'packages',
    type: 'package',
    content_en: 'Manicure + Pedicure Combo: Complete hand and foot care package. Price: PKR 3,200 (Save PKR 300). Duration: 105 minutes. Popular combo. Nail care essentials.',
    content_ur: 'Manicure + Pedicure Combo: Complete hand aur foot care package. Price: PKR 3,200 (PKR 300 bachaen). Duration: 105 minutes. Popular combo. Nail care essentials.',
    metadata: {
      service_name: 'Mani Pedi Combo',
      price: 3200,
      currency: 'PKR',
      category: 'packages',
      keywords: ['manicure pedicure', 'mani pedi', 'combo', 'package', 'nails combo', 'nail care package']
    }
  },
  {
    id: 'package_party_ready_001',
    category: 'packages',
    type: 'package',
    content_en: 'Party Ready Package: Complete party preparation. Price: PKR 6,500. Includes hair styling, party makeup, and manicure. Duration: 3 hours. Get ready for any event.',
    content_ur: 'Party Ready Package: Complete party preparation. Price: PKR 6,500. Hair styling, party makeup, aur manicure shamil hai. Duration: 3 hours. Kisi bhi event ke liye ready ho jaen.',
    metadata: {
      service_name: 'Party Ready Package',
      price: 6500,
      currency: 'PKR',
      category: 'packages',
      keywords: ['party package', 'party ready', 'event package', 'combo', 'makeup package']
    }
  },
  {
    id: 'package_bridal_trial_001',
    category: 'bridal',
    type: 'package',
    content_en: 'Bridal Trial Session: Complete trial before your big day. Price: PKR 5,000. Includes makeup trial, hair styling trial, and consultation. Duration: 2 hours. Help you choose perfect look. Book at least 1 week before wedding.',
    content_ur: 'Bridal Trial Session: Apne big day se pehle complete trial. Price: PKR 5,000. Makeup trial, hair styling trial, aur consultation shamil hai. Duration: 2 hours. Perfect look choose karne mein madad. Wedding se kam se kam 1 week pehle book karein.',
    metadata: {
      service_name: 'Bridal Trial',
      price: 5000,
      currency: 'PKR',
      category: 'bridal',
      keywords: ['bridal trial', 'trial', 'makeup trial', 'bridal test', 'bridal rehearsal']
    }
  },

  // Specialty Queries
  {
    id: 'query_hair_fall_001',
    category: 'faq',
    type: 'information',
    content_en: 'Hair Fall Treatment: We offer specialized treatments for hair fall including protein treatments, scalp treatments, and hair spa. Recommended: Protein Treatment (PKR 3,500) or Hair Treatment (PKR 3,000). Our stylists can assess your hair and recommend best treatment. Regular treatments show best results.',
    content_ur: 'Hair Fall Treatment: Hum hair fall ke liye specialized treatments offer karte hain including protein treatments, scalp treatments, aur hair spa. Recommend: Protein Treatment (PKR 3,500) ya Hair Treatment (PKR 3,000). Hamare stylists aapke hair ko assess karke best treatment recommend kar sakte hain. Regular treatments se best results milte hain.',
    metadata: {
      faq_type: 'hair_fall',
      keywords: ['hair fall', 'hair loss', 'falling hair', 'hair treatment', 'hair thinning', 'baal girna', 'baal jharna']
    }
  },
  {
    id: 'query_skin_problems_001',
    category: 'faq',
    type: 'information',
    content_en: 'Skin Problems Solutions: We address various skin concerns. For acne: Acne Treatment Facial (PKR 3,500). For pigmentation: Brightening Facial (PKR 4,000) or Chemical Peel (PKR 4,000). For aging: Anti-Aging Facial (PKR 5,500). For dull skin: HydraFacial (PKR 6,000). Book consultation for personalized treatment plan.',
    content_ur: 'Skin Problems Solutions: Hum alag alag skin concerns address karte hain. Acne ke liye: Acne Treatment Facial (PKR 3,500). Pigmentation ke liye: Brightening Facial (PKR 4,000) ya Chemical Peel (PKR 4,000). Aging ke liye: Anti-Aging Facial (PKR 5,500). Dull skin ke liye: HydraFacial (PKR 6,000). Personalized treatment plan ke liye consultation book karein.',
    metadata: {
      faq_type: 'skin_problems',
      keywords: ['skin problem', 'acne', 'pimples', 'dark spots', 'pigmentation', 'skin issues', 'skin ki problem']
    }
  },
  {
    id: 'query_wedding_prep_001',
    category: 'faq',
    type: 'information',
    content_en: 'Wedding Preparation Guide: Start 3 months before wedding. Month 1-2: Monthly facials (Gold/Diamond), hair treatments. Month 3: Body polishing, keratin treatment if needed. 2 weeks before: Bridal trial session. 1 week before: Final facial, waxing. Day before: Manicure, pedicure. Wedding day: Full bridal package. We offer complete wedding preparation packages.',
    content_ur: 'Wedding Preparation Guide: Wedding se 3 months pehle start karein. Month 1-2: Monthly facials (Gold/Diamond), hair treatments. Month 3: Body polishing, keratin treatment agar zarurat ho. 2 weeks pehle: Bridal trial session. 1 week pehle: Final facial, waxing. Day before: Manicure, pedicure. Wedding day: Full bridal package. Hum complete wedding preparation packages offer karte hain.',
    metadata: {
      faq_type: 'wedding_prep',
      keywords: ['wedding preparation', 'shaadi ki tayari', 'bridal prep', 'wedding planning', 'bridal preparation', 'shaadi', 'wedding']
    }
  },
  {
    id: 'query_hair_damage_001',
    category: 'faq',
    type: 'information',
    content_en: 'Damaged Hair Solutions: For chemically damaged hair: Olaplex Treatment (PKR 4,500) or Protein Treatment (PKR 3,500). For heat damaged hair: Hair Treatment (PKR 3,000) with deep conditioning. For dry hair: Hair Spa or deep conditioning treatments. Regular treatments every 2-3 weeks recommended. Avoid further chemical treatments until hair recovers.',
    content_ur: 'Damaged Hair Solutions: Chemically damaged hair ke liye: Olaplex Treatment (PKR 4,500) ya Protein Treatment (PKR 3,500). Heat damaged hair ke liye: Hair Treatment (PKR 3,000) with deep conditioning. Dry hair ke liye: Hair Spa ya deep conditioning treatments. Regular treatments har 2-3 weeks mein recommend hain. Hair recover hone tak chemical treatments avoid karein.',
    metadata: {
      faq_type: 'damaged_hair',
      keywords: ['damaged hair', 'dry hair', 'rough hair', 'hair damage', 'kharab baal', 'sukhe baal']
    }
  },
  {
    id: 'query_makeup_looks_001',
    category: 'faq',
    type: 'information',
    content_en: 'Makeup Looks Available: We create various looks. Natural/Everyday Makeup (PKR 2,500), Glam Makeup (PKR 3,500), Smokey Eye Makeup (PKR 3,500), Bold Lips Makeup (PKR 3,000), Traditional/Eastern Makeup (PKR 4,000), Western Makeup (PKR 4,000), Engagement Makeup (PKR 8,000), Bridal Makeup (packages start PKR 18,000). All looks customizable based on preference.',
    content_ur: 'Makeup Looks Available: Hum alag alag looks create karte hain. Natural/Everyday Makeup (PKR 2,500), Glam Makeup (PKR 3,500), Smokey Eye Makeup (PKR 3,500), Bold Lips Makeup (PKR 3,000), Traditional/Eastern Makeup (PKR 4,000), Western Makeup (PKR 4,000), Engagement Makeup (PKR 8,000), Bridal Makeup (packages PKR 18,000 se start). Sab looks preference ke mutabiq customizable hain.',
    metadata: {
      faq_type: 'makeup_looks',
      keywords: ['makeup looks', 'makeup types', 'makeup styles', 'kaisi makeup', 'makeup options', 'makeup ka style']
    }
  },

  // Seasonal & Special Services
  {
    id: 'service_summer_special_001',
    category: 'seasonal',
    type: 'information',
    content_en: 'Summer Specials: Summer skin needs extra care. We recommend: Hydrating Facials, Body Scrubs for tan removal, Whitening treatments, Full body waxing, Pedicures for open-toe season. Special summer packages available. Ask about current offers.',
    content_ur: 'Summer Specials: Summer mein skin ko extra care chahiye. Hum recommend karte hain: Hydrating Facials, tan removal ke liye Body Scrubs, Whitening treatments, Full body waxing, open-toe season ke liye Pedicures. Special summer packages available hain. Current offers ke baare mein puchein.',
    metadata: {
      type: 'seasonal',
      keywords: ['summer', 'summer special', 'summer care', 'garmiyon', 'summer treatment', 'summer packages']
    }
  },
  {
    id: 'service_winter_special_001',
    category: 'seasonal',
    type: 'information',
    content_en: 'Winter Specials: Winter requires moisturizing care. Recommended: Deep conditioning hair treatments, Hydrating facials, Body moisturizing treatments, Hand and foot care packages. We use special moisturizing products in winter. Special winter packages available.',
    content_ur: 'Winter Specials: Winter mein moisturizing care zaruri hai. Recommend: Deep conditioning hair treatments, Hydrating facials, Body moisturizing treatments, Hand aur foot care packages. Winter mein hum special moisturizing products use karte hain. Special winter packages available hain.',
    metadata: {
      type: 'seasonal',
      keywords: ['winter', 'winter special', 'winter care', 'sardi', 'winter treatment', 'winter packages']
    }
  },
  {
    id: 'service_eid_special_001',
    category: 'seasonal',
    type: 'information',
    content_en: 'Eid Specials: Get ready for Eid! Popular services: Henna/Mehndi application, Party makeup, Hair styling, Manicure & Pedicure, Threading services. Special Eid packages available. Book early as slots fill up quickly before Eid. Advance booking strongly recommended.',
    content_ur: 'Eid Specials: Eid ke liye ready ho jaen! Popular services: Henna/Mehndi application, Party makeup, Hair styling, Manicure & Pedicure, Threading services. Special Eid packages available hain. Jaldi book karein kyunke Eid se pehle slots jaldi bhar jate hain. Advance booking strongly recommend hai.',
    metadata: {
      type: 'seasonal',
      keywords: ['eid', 'eid special', 'eid makeup', 'eid preparation', 'eid ki tayari', 'eid packages']
    }
  },

  // Age-Specific Services
  {
    id: 'service_teen_facial_001',
    category: 'skin',
    type: 'service',
    content_en: 'Teen Facial: Gentle facial for teenagers. Duration: 45 minutes. Price: PKR 1,800. Addresses teen skin concerns like acne and oiliness. Includes cleansing, gentle exfoliation, and oil-free products. Perfect for ages 13-19.',
    content_ur: 'Teen Facial: Teenagers ke liye gentle facial. Duration: 45 minutes. Price: PKR 1,800. Teen skin concerns jaise acne aur oiliness address karta hai. Cleansing, gentle exfoliation, aur oil-free products shamil hain. Ages 13-19 ke liye perfect.',
    metadata: {
      service_name: 'Teen Facial',
      price: 1800,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'skin',
      keywords: ['teen facial', 'teenage', 'teen skin', 'young skin', 'teenage facial']
    }
  },
  {
    id: 'service_kids_haircut_001',
    category: 'hair',
    type: 'service',
    content_en: 'Kids Haircut: Haircut for children. Duration: 30 minutes. Price: PKR 800. Patient and experienced stylists. Fun and comfortable environment. For children ages 3-12.',
    content_ur: 'Kids Haircut: Bachon ke liye haircut. Duration: 30 minutes. Price: PKR 800. Patient aur experienced stylists. Fun aur comfortable environment. Ages 3-12 ke bachon ke liye.',
    metadata: {
      service_name: 'Kids Haircut',
      price: 800,
      currency: 'PKR',
      duration_minutes: 30,
      category: 'hair',
      keywords: ['kids', 'children', 'child haircut', 'bachon', 'kids haircut', 'children haircut']
    }
  },

  // Specific Problem Solutions
  {
    id: 'solution_oily_skin_001',
    category: 'faq',
    type: 'information',
    content_en: 'Oily Skin Solutions: For oily skin we recommend: Regular facials with clay masks, Oil-control treatments, Acne treatment facial if needed. Recommended facials: Basic Facial (PKR 2,000) or HydraFacial (PKR 6,000). Monthly treatments help control oil. Use oil-free products.',
    content_ur: 'Oily Skin Solutions: Oily skin ke liye hum recommend karte hain: Clay masks ke saath regular facials, Oil-control treatments, Acne treatment facial agar zarurat ho. Recommend facials: Basic Facial (PKR 2,000) ya HydraFacial (PKR 6,000). Monthly treatments oil control mein madad karti hain. Oil-free products use karein.',
    metadata: {
      faq_type: 'oily_skin',
      keywords: ['oily skin', 'oil control', 'oily face', 'greasy skin', 'oily skin treatment', 'chikni skin']
    }
  },
  {
    id: 'solution_dry_skin_001',
    category: 'faq',
    type: 'information',
    content_en: 'Dry Skin Solutions: For dry skin: Hydrating facials, Moisturizing treatments, Avoid harsh products. Recommended: HydraFacial (PKR 6,000), Gold Facial (PKR 3,500), or Oxygen Facial (PKR 5,000). Regular moisturizing essential. Drink plenty of water.',
    content_ur: 'Dry Skin Solutions: Dry skin ke liye: Hydrating facials, Moisturizing treatments, Harsh products se bachein. Recommend: HydraFacial (PKR 6,000), Gold Facial (PKR 3,500), ya Oxygen Facial (PKR 5,000). Regular moisturizing zaruri hai. Bohot paani piyen.',
    metadata: {
      faq_type: 'dry_skin',
      keywords: ['dry skin', 'dry face', 'dehydrated skin', 'dry skin treatment', 'sukhi skin', 'khushk skin']
    }
  },
  {
    id: 'solution_sensitive_skin_001',
    category: 'faq',
    type: 'information',
    content_en: 'Sensitive Skin Care: We use gentle, hypoallergenic products for sensitive skin. Recommended: Basic Facial with gentle products, Avoid chemical peels initially. Always inform staff about skin sensitivity. Patch test available on request.',
    content_ur: 'Sensitive Skin Care: Hum sensitive skin ke liye gentle, hypoallergenic products use karte hain. Recommend: Gentle products ke saath Basic Facial, Initially chemical peels avoid karein. Hamesha staff ko skin sensitivity ke baare mein batana. Request par patch test available hai.',
    metadata: {
      faq_type: 'sensitive_skin',
      keywords: ['sensitive skin', 'sensitive face', 'allergic skin', 'sensitive skin care', 'nazuk skin']
    }
  },

  // More Detailed FAQs
  {
    id: 'faq_loyalty_program_001',
    category: 'faq',
    type: 'information',
    content_en: 'Loyalty Program: Yes! We offer loyalty rewards. Get a free service after 10 paid services. Special birthday discounts for members. Exclusive access to new services and products. Ask at reception about joining our loyalty program.',
    content_ur: 'Loyalty Program: Haan! Hum loyalty rewards offer karte hain. 10 paid services ke baad ek free service milti hai. Members ke liye special birthday discounts. Naye services aur products tak exclusive access. Loyalty program join karne ke liye reception par puchein.',
    metadata: {
      faq_type: 'loyalty',
      keywords: ['loyalty', 'rewards', 'membership', 'discount', 'free service', 'loyalty program']
    }
  },
  {
    id: 'faq_consultation_001',
    category: 'faq',
    type: 'information',
    content_en: 'Free Consultation: Yes, we provide free consultation for all services. Our experts will assess your needs and recommend best treatments. Consultation includes skin/hair analysis and personalized recommendations. No obligation to book. Walk-ins welcome for consultation.',
    content_ur: 'Free Consultation: Haan, hum sab services ke liye free consultation provide karte hain. Hamare experts aapki needs assess karke best treatments recommend karenge. Consultation mein skin/hair analysis aur personalized recommendations shamil hain. Book karne ki koi majboori nahi. Consultation ke liye walk-ins welcome hain.',
    metadata: {
      faq_type: 'consultation',
      keywords: ['consultation', 'free consultation', 'advice', 'expert opinion', 'mashwara', 'salah']
    }
  },
  {
    id: 'faq_bring_items_001',
    category: 'faq',
    type: 'information',
    content_en: 'What to Bring: You don not need to bring anything. We provide all products, tools, and equipment. For bridal services, bring outfit and jewelry for trial if you want to see complete look. Bring photo references if you have specific style in mind.',
    content_ur: 'Kya Lana Hai: Aapko kuch bhi lana zaruri nahi hai. Hum sab products, tools, aur equipment provide karte hain. Bridal services ke liye, trial mein complete look dekhne ke liye outfit aur jewelry la sakte hain. Agar specific style chaho toh photo references la sakte hain.',
    metadata: {
      faq_type: 'what_to_bring',
      keywords: ['what to bring', 'kya lana', 'items needed', 'kya chahiye', 'bring items']
    }
  },
  {
    id: 'faq_male_services_001',
    category: 'faq',
    type: 'information',
    content_en: 'Male Services: We are a women-only salon. We provide services exclusively for female clients. We apologize for any inconvenience. Male customers can explore male salons and barber shops nearby.',
    content_ur: 'Male Services: Hum ek women-only salon hain. Hum exclusively female clients ke liye services provide karte hain. Kisi bhi inconvenience ke liye sorry. Male customers qareeb ke male salons aur barber shops explore kar sakte hain.',
    metadata: {
      faq_type: 'male_services',
      keywords: ['male', 'men', 'boys', 'mard', 'male services', 'men services']
    }
  },
  {
    id: 'faq_pregnancy_services_001',
    category: 'faq',
    type: 'information',
    content_en: 'Pregnancy Safe Services: Many services are safe during pregnancy. Safe: Manicure, Pedicure, Basic Facial, Haircut. Consult doctor before: Hair coloring, Chemical treatments, Certain massages. Please inform staff if you are pregnant. We will use pregnancy-safe products.',
    content_ur: 'Pregnancy Safe Services: Pregnancy mein bohot si services safe hain. Safe: Manicure, Pedicure, Basic Facial, Haircut. Doctor se consult karein pehle: Hair coloring, Chemical treatments, Certain massages. Agar aap pregnant hain toh staff ko zaroor batana. Hum pregnancy-safe products use karenge.',
    metadata: {
      faq_type: 'pregnancy',
      keywords: ['pregnancy', 'pregnant', 'safe services', 'pregnancy services', 'hamal', 'expecting']
    }
  },

  // Price Range Queries
  {
    id: 'query_cheap_services_001',
    category: 'faq',
    type: 'information',
    content_en: 'Budget-Friendly Services: Our most affordable services are: Upper Lip Threading PKR 150, Eyebrow Threading PKR 250, Underarms Waxing PKR 400, Half Arms Waxing PKR 500, Kids Haircut PKR 800, Haircut PKR 1,500, Foot Massage PKR 1,200, Basic Facial PKR 2,000. We maintain quality even in budget services.',
    content_ur: 'Budget-Friendly Services: Hamari sabse affordable services hain: Upper Lip Threading PKR 150, Eyebrow Threading PKR 250, Underarms Waxing PKR 400, Half Arms Waxing PKR 500, Kids Haircut PKR 800, Haircut PKR 1,500, Foot Massage PKR 1,200, Basic Facial PKR 2,000. Budget services mein bhi quality maintain karte hain.',
    metadata: {
      faq_type: 'budget',
      keywords: ['cheap', 'affordable', 'budget', 'sasta', 'low price', 'economical', 'kam keemat']
    }
  },
  {
    id: 'query_premium_services_001',
    category: 'faq',
    type: 'information',
    content_en: 'Premium Luxury Services: Our premium offerings include: Premium Bridal Package PKR 25,000, Rebonding PKR 10,000+, Keratin Treatment PKR 8,000+, Engagement Makeup PKR 8,000, Fashion Colors PKR 7,000+, HydraFacial PKR 6,000, Balayage PKR 6,000+, Diamond Facial PKR 5,000. These use top-tier products and techniques.',
    content_ur: 'Premium Luxury Services: Hamari premium offerings: Premium Bridal Package PKR 25,000, Rebonding PKR 10,000+, Keratin Treatment PKR 8,000+, Engagement Makeup PKR 8,000, Fashion Colors PKR 7,000+, HydraFacial PKR 6,000, Balayage PKR 6,000+, Diamond Facial PKR 5,000. In mein top-tier products aur techniques use hote hain.',
    metadata: {
      faq_type: 'premium',
      keywords: ['premium', 'luxury', 'expensive', 'high end', 'best services', 'top services', 'mehengi']
    }
  },

  // Specific Time-Related Queries
  {
    id: 'query_quick_services_001',
    category: 'faq',
    type: 'information',
    content_en: 'Quick Services (Under 30 minutes): Upper Lip Threading 5 min, Eyebrow Threading 10 min, Underarms Waxing 10 min, Half Arms Waxing 15 min, Half Legs Waxing 20 min, Foot Massage 30 min, Kids Haircut 30 min. Perfect for when you are short on time.',
    content_ur: 'Quick Services (30 minutes se kam): Upper Lip Threading 5 min, Eyebrow Threading 10 min, Underarms Waxing 10 min, Half Arms Waxing 15 min, Half Legs Waxing 20 min, Foot Massage 30 min, Kids Haircut 30 min. Jab aapke paas kam time ho toh perfect.',
    metadata: {
      faq_type: 'quick_services',
      keywords: ['quick', 'fast', 'short time', 'jaldi', 'kam time', 'quick service', 'express']
    }
  },
  {
    id: 'query_long_services_001',
    category: 'faq',
    type: 'information',
    content_en: 'Longer Duration Services (2+ hours): Bridal Mehndi 3-4 hours, Rebonding 4-5 hours, Keratin 3-4 hours, Hair Coloring 2-3 hours, Highlights 2-3 hours, Balayage 3-4 hours, Fashion Colors 3-4 hours, Ombre 3-4 hours, Party Ready Package 3 hours. Please plan accordingly.',
    content_ur: 'Long Duration Services (2+ hours): Bridal Mehndi 3-4 hours, Rebonding 4-5 hours, Keratin 3-4 hours, Hair Coloring 2-3 hours, Highlights 2-3 hours, Balayage 3-4 hours, Fashion Colors 3-4 hours, Ombre 3-4 hours, Party Ready Package 3 hours. Accordingly plan karein.',
    metadata: {
      faq_type: 'long_services',
      keywords: ['long', 'time consuming', 'hours', 'zyada time', 'lamba time', 'long duration']
    }
  },

  // Service Frequency Recommendations
  {
    id: 'query_how_often_facial_001',
    category: 'faq',
    type: 'information',
    content_en: 'Facial Frequency: For best results, get facials monthly. For specific concerns (acne, aging), bi-weekly treatments initially, then monthly maintenance. For brides: Weekly facials 2 months before wedding. Regular facials maintain healthy skin and prevent problems.',
    content_ur: 'Facial Frequency: Best results ke liye, monthly facials lein. Specific concerns (acne, aging) ke liye, initially bi-weekly treatments, phir monthly maintenance. Brides ke liye: Wedding se 2 months pehle weekly facials. Regular facials healthy skin maintain karti hain aur problems prevent karti hain.',
    metadata: {
      faq_type: 'frequency',
      keywords: ['how often', 'kitni bar', 'frequency', 'kitne din baad', 'when to repeat', 'kitni dafa']
    }
  },
  {
    id: 'query_how_often_waxing_001',
    category: 'faq',
    type: 'information',
    content_en: 'Waxing Frequency: Full body waxing every 3-4 weeks. Threading every 2-3 weeks. Bikini waxing every 4 weeks. Results vary based on individual hair growth. Regular waxing reduces hair growth over time.',
    content_ur: 'Waxing Frequency: Full body waxing har 3-4 weeks mein. Threading har 2-3 weeks mein. Bikini waxing har 4 weeks mein. Results individual hair growth par depend karte hain. Regular waxing se time ke saath hair growth kam hota hai.',
    metadata: {
      faq_type: 'frequency',
      keywords: ['waxing frequency', 'kitni bar waxing', 'threading frequency', 'how often wax']
    }
  },
  {
    id: 'query_how_often_haircut_001',
    category: 'faq',
    type: 'information',
    content_en: 'Haircut Frequency: For maintaining length: Every 6-8 weeks to trim split ends. For maintaining style: Every 4-6 weeks. For short hairstyles: Every 3-4 weeks. Regular trims keep hair healthy and styled.',
    content_ur: 'Haircut Frequency: Length maintain karne ke liye: Har 6-8 weeks mein split ends trim karein. Style maintain karne ke liye: Har 4-6 weeks. Short hairstyles ke liye: Har 3-4 weeks. Regular trims se hair healthy aur styled rehte hain.',
    metadata: {
      faq_type: 'frequency',
      keywords: ['haircut frequency', 'kitni bar haircut', 'how often haircut', 'trim frequency']
    }
  },

  // Product-Related Queries
  {
    id: 'query_products_used_001',
    category: 'faq',
    type: 'information',
    content_en: 'Products We Use: We use premium professional brands including L Oreal Professional, Wella, Schwarzkopf, Kerastase for hair. For skincare: Dermalogica, The Ordinary, local premium brands. For makeup: MAC, Huda Beauty, Anastasia Beverly Hills. All products are authentic and imported.',
    content_ur: 'Products We Use: Hum premium professional brands use karte hain jaise L Oreal Professional, Wella, Schwarzkopf, Kerastase hair ke liye. Skincare ke liye: Dermalogica, The Ordinary, local premium brands. Makeup ke liye: MAC, Huda Beauty, Anastasia Beverly Hills. Sab products authentic aur imported hain.',
    metadata: {
      faq_type: 'products',
      keywords: ['products', 'brands', 'kaunse products', 'which products', 'products used', 'brands used']
    }
  },
  {
    id: 'query_product_purchase_001',
    category: 'faq',
    type: 'information',
    content_en: 'Buy Products: Yes, professional products available for purchase. Hair care products PKR 1,500 - 5,000. Skin care products PKR 800 - 4,000. Styling products PKR 1,200 - 3,500. Get 10% discount on products when you get service. Staff can recommend products for your needs.',
    content_ur: 'Buy Products: Haan, professional products purchase ke liye available hain. Hair care products PKR 1,500 - 5,000. Skin care products PKR 800 - 4,000. Styling products PKR 1,200 - 3,500. Service lene par products par 10% discount milta hai. Staff aapki needs ke liye products recommend kar sakte hain.',
    metadata: {
      faq_type: 'buy_products',
      keywords: ['buy products', 'purchase', 'products kharidna', 'products lena', 'products available']
    }
  },

  // Appointment & Booking Details
  {
    id: 'query_same_day_booking_001',
    category: 'faq',
    type: 'information',
    content_en: 'Same Day Appointments: Yes, same day appointments available based on availability. Call us early in the day for better chances. Weekdays usually have better availability than weekends. For quick services (threading, waxing), walk-ins usually accommodated.',
    content_ur: 'Same Day Appointments: Haan, availability ke basis par same day appointments available hain. Better chances ke liye din mein jaldi call karein. Weekdays par weekends se better availability hoti hai. Quick services (threading, waxing) ke liye, walk-ins usually accommodate ho jate hain.',
    metadata: {
      faq_type: 'same_day',
      keywords: ['same day', 'today', 'aaj', 'immediate', 'right now', 'abhi', 'today appointment']
    }
  },
  {
    id: 'query_group_appointment_001',
    category: 'faq',
    type: 'information',
    content_en: 'Group Appointments: We welcome group bookings! Perfect for bridal parties, birthdays, girls day out. Special group rates available for 3+ people. Advance booking required for groups. We can arrange simultaneous services. Call to discuss group packages and timing.',
    content_ur: 'Group Appointments: Hum group bookings welcome karte hain! Bridal parties, birthdays, girls day out ke liye perfect. 3+ log hone par special group rates available hain. Groups ke liye advance booking zaruri hai. Hum simultaneous services arrange kar sakte hain. Group packages aur timing discuss karne ke liye call karein.',
    metadata: {
      faq_type: 'group',
      keywords: ['group', 'together', 'friends', 'group booking', 'saath mein', 'together appointment']
    }
  },
  {
    id: 'query_waiting_time_001',
    category: 'faq',
    type: 'information',
    content_en: 'Waiting Time: With appointment: Minimal to no waiting. Walk-ins: 15-45 minutes depending on day and time. Weekdays mornings have shortest wait. Weekend evenings busiest. We have comfortable waiting area with WiFi and refreshments.',
    content_ur: 'Waiting Time: Appointment ke saath: Minimal ya no waiting. Walk-ins: 15-45 minutes depending din aur time par. Weekdays mornings mein sabse kam wait. Weekend evenings sabse busy. Humare paas WiFi aur refreshments ke saath comfortable waiting area hai.',
    metadata: {
      faq_type: 'waiting',
      keywords: ['waiting time', 'wait', 'intezar', 'kitna intezar', 'how long wait', 'waiting period']
    }
  },

  // Staff & Expertise
  {
    id: 'query_staff_expertise_001',
    category: 'faq',
    type: 'information',
    content_en: 'Staff Expertise: All our staff are certified professionals. Hair stylists: 5-10 years experience. Makeup artists: Certified from top institutes. Beauticians: Trained in latest techniques. Regular training on new trends and products. Multilingual staff (Urdu, English).',
    content_ur: 'Staff Expertise: Hamare sab staff certified professionals hain. Hair stylists: 5-10 years experience. Makeup artists: Top institutes se certified. Beauticians: Latest techniques mein trained. Naye trends aur products par regular training. Multilingual staff (Urdu, English).',
    metadata: {
      faq_type: 'expertise',
      keywords: ['staff', 'expert', 'qualification', 'experience', 'tajurba', 'certified', 'professional']
    }
  },
  {
    id: 'query_favorite_stylist_001',
    category: 'faq',
    type: 'information',
    content_en: 'Request Specific Stylist: Yes, you can request your favorite stylist when booking. Subject to availability. Regular clients often develop preference. We try to assign same stylist for consistency. Mention preference when calling.',
    content_ur: 'Request Specific Stylist: Haan, booking karte waqt aap apni favorite stylist request kar sakte hain. Availability ke mutabiq. Regular clients ko aksar preference ho jati hai. Consistency ke liye hum same stylist assign karne ki koshish karte hain. Call karte waqt preference mention karein.',
    metadata: {
      faq_type: 'stylist_request',
      keywords: ['favorite stylist', 'specific stylist', 'request stylist', 'same person', 'particular stylist']
    }
  },

  // Special Occasions Services
  {
    id: 'service_photoshoot_makeup_001',
    category: 'makeup',
    type: 'service',
    content_en: 'Photoshoot Makeup: Professional makeup for photoshoots. Duration: 90 minutes. Price: PKR 5,000. HD makeup that looks perfect on camera. Includes contouring, highlighting, and touch-up kit. Perfect for portfolio shoots, fashion shoots.',
    content_ur: 'Photoshoot Makeup: Photoshoots ke liye professional makeup. Duration: 90 minutes. Price: PKR 5,000. HD makeup jo camera par perfect lagta hai. Contouring, highlighting, aur touch-up kit shamil hai. Portfolio shoots, fashion shoots ke liye perfect.',
    metadata: {
      service_name: 'Photoshoot Makeup',
      price: 5000,
      currency: 'PKR',
      duration_minutes: 90,
      category: 'makeup',
      keywords: ['photoshoot', 'photo shoot', 'camera makeup', 'photography', 'hd makeup']
    }
  },
  {
    id: 'service_reception_makeup_001',
    category: 'makeup',
    type: 'service',
    content_en: 'Reception Makeup: Elegant makeup for wedding receptions. Duration: 75 minutes. Price: PKR 6,000. Glamorous yet sophisticated look. Long-lasting formula for entire event. Includes hair styling.',
    content_ur: 'Reception Makeup: Wedding receptions ke liye elegant makeup. Duration: 75 minutes. Price: PKR 6,000. Glamorous yet sophisticated look. Puri event ke liye long-lasting formula. Hair styling shamil hai.',
    metadata: {
      service_name: 'Reception Makeup',
      price: 6000,
      currency: 'PKR',
      duration_minutes: 75,
      category: 'makeup',
      keywords: ['reception', 'wedding reception', 'walima', 'reception makeup', 'valima']
    }
  },

  // Hair Styling Variations
  {
    id: 'service_bun_styling_001',
    category: 'hair',
    type: 'service',
    content_en: 'Bun Styling: Elegant bun hairstyles. Duration: 45 minutes. Price: PKR 2,000. Various styles: Sleek bun, Messy bun, Braided bun. Perfect for formal events and weddings.',
    content_ur: 'Bun Styling: Elegant bun hairstyles. Duration: 45 minutes. Price: PKR 2,000. Various styles: Sleek bun, Messy bun, Braided bun. Formal events aur weddings ke liye perfect.',
    metadata: {
      service_name: 'Bun Styling',
      price: 2000,
      currency: 'PKR',
      duration_minutes: 45,
      category: 'hair',
      keywords: ['bun', 'hair bun', 'updo', 'bun style', 'jura']
    }
  },
  {
    id: 'service_curls_001',
    category: 'hair',
    type: 'service',
    content_en: 'Curls Styling: Beautiful curls and waves. Duration: 60 minutes. Price: PKR 2,500. Soft waves or tight curls available. Long-lasting with heat styling. Perfect for parties.',
    content_ur: 'Curls Styling: Beautiful curls aur waves. Duration: 60 minutes. Price: PKR 2,500. Soft waves ya tight curls available. Heat styling se long-lasting. Parties ke liye perfect.',
    metadata: {
      service_name: 'Curls Styling',
      price: 2500,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'hair',
      keywords: ['curls', 'waves', 'curly hair', 'wavy hair', 'ghunghrali baal']
    }
  },
  {
    id: 'service_blowdry_001',
    category: 'hair',
    type: 'service',
    content_en: 'Blowdry & Styling: Professional blowdry for smooth finish. Duration: 30 minutes. Price: PKR 1,000. Smooth, voluminous result. Good for daily styling.',
    content_ur: 'Blowdry & Styling: Smooth finish ke liye professional blowdry. Duration: 30 minutes. Price: PKR 1,000. Smooth, voluminous result. Daily styling ke liye acha.',
    metadata: {
      service_name: 'Blowdry',
      price: 1000,
      currency: 'PKR',
      duration_minutes: 30,
      category: 'hair',
      keywords: ['blowdry', 'blow dry', 'styling', 'hair dry', 'smooth hair']
    }
  },
  {
    id: 'service_braids_001',
    category: 'hair',
    type: 'service',
    content_en: 'Braids Styling: Various braided hairstyles. Duration: 60 minutes. Price: PKR 2,200. French braids, Dutch braids, Fishtail, Crown braids. Creative and trendy styles.',
    content_ur: 'Braids Styling: Various braided hairstyles. Duration: 60 minutes. Price: PKR 2,200. French braids, Dutch braids, Fishtail, Crown braids. Creative aur trendy styles.',
    metadata: {
      service_name: 'Braids',
      price: 2200,
      currency: 'PKR',
      duration_minutes: 60,
      category: 'hair',
      keywords: ['braids', 'braid', 'braided hair', 'choti', 'plait']
    }
  },

  // More Specific Service Details
  {
    id: 'service_hair_spa_001',
    category: 'hair',
    type: 'service',
    content_en: 'Hair Spa Treatment: Luxurious relaxing hair treatment. Duration: 90 minutes. Price: PKR 3,500. Includes scalp massage, steam treatment, deep conditioning mask, and blow dry. Nourishes hair deeply. Recommended monthly.',
    content_ur: 'Hair Spa Treatment: Luxurious relaxing hair treatment. Duration: 90 minutes. Price: PKR 3,500. Scalp massage, steam treatment, deep conditioning mask, aur blow dry shamil hai. Hair ko deeply nourish karta hai. Monthly recommend hai.',
    metadata: {
      service_name: 'Hair Spa',
      price: 3500,
      currency: 'PKR',
      duration_minutes: 90,
      category: 'hair',
      keywords: ['hair spa', 'spa', 'hair treatment', 'relaxing', 'deep conditioning']
    }
  },
  {
    id: 'service_cleanup_001',
    category: 'skin',
    type: 'service',
    content_en: 'Face Cleanup: Quick refreshing facial. Duration: 30 minutes. Price: PKR 1,500. Basic cleansing, scrub, and mask. Perfect for maintenance between facials. Good for quick refresh.',
    content_ur: 'Face Cleanup: Quick refreshing facial. Duration: 30 minutes. Price: PKR 1,500. Basic cleansing, scrub, aur mask. Facials ke beech maintenance ke liye perfect. Quick refresh ke liye acha.',
    metadata: {
      service_name: 'Cleanup',
      price: 1500,
      currency: 'PKR',
      duration_minutes: 30,
      category: 'skin',
      keywords: ['cleanup', 'clean up', 'face cleanup', 'quick facial', 'basic facial']
    }
  },

  // Technology & Modern Services
  {
    id: 'service_laser_hair_001',
    category: 'body',
    type: 'information',
    content_en: 'Laser Hair Removal: Currently not available. We specialize in traditional waxing and threading services. For laser hair removal, we can recommend specialized clinics nearby.',
    content_ur: 'Laser Hair Removal: Currently available nahi hai. Hum traditional waxing aur threading services mein specialize karte hain. Laser hair removal ke liye, hum qareeb specialized clinics recommend kar sakte hain.',
    metadata: {
      service_name: 'Laser',
      keywords: ['laser', 'laser hair removal', 'permanent hair removal', 'laser treatment']
    }
  },

  // Common Urdu Queries
  {
    id: 'urdu_query_001',
    category: 'general',
    type: 'information',
    content_en: 'Common Questions: How can I help you today? You can ask about: Services and prices (Kaunsi services hain aur kya price hai), Booking appointments (Appointment kaise book karein), Timing and location (Timing kya hai aur kahan hain), Special packages (Koi special packages hain), Wedding preparation (Shaadi ki tayari), Any specific service details (Koi specific service ki details).',
    content_ur: 'Common Questions: Main aaj aapki kaise madad kar sakta hoon? Aap pooch sakte hain: Services aur prices (Kaunsi services hain aur kya price hai), Appointments book karna (Appointment kaise book karein), Timing aur location (Timing kya hai aur kahan hain), Special packages (Koi special packages hain), Shaadi ki tayari (Wedding preparation), Koi bhi specific service ki details.',
    metadata: {
      type: 'help',
      keywords: ['help', 'madad', 'kya services', 'batao', 'bataen', 'konsi', 'kaunsi', 'kya kya']
    }
  },

  // Crisis/Problem Handling
  {
    id: 'query_hair_disaster_001',
    category: 'faq',
    type: 'information',
    content_en: 'Hair Emergency/Disaster: If you had a bad hair color or treatment elsewhere, we can help fix it! Color correction available. Damage repair treatments available. Consultation to assess damage and plan correction. Please call immediately so we can schedule urgent appointment.',
    content_ur: 'Hair Emergency/Disaster: Agar kahin aur se aapko bad hair color ya treatment mila hai, hum fix karne mein madad kar sakte hain! Color correction available hai. Damage repair treatments available hain. Damage assess karne aur correction plan karne ke liye consultation. Urgent appointment schedule karne ke liye turant call karein.',
    metadata: {
      faq_type: 'emergency',
      keywords: ['hair disaster', 'bad haircut', 'wrong color', 'fix hair', 'hair problem', 'emergency', 'kharab ho gaye']
    }
  },

  // Comparison Queries
  {
    id: 'compare_facials_001',
    category: 'faq',
    type: 'information',
    content_en: 'Facial Comparison: Basic Facial (PKR 2,000): Best for regular maintenance, all skin types. Gold Facial (PKR 3,500): Best for brightening, pre-wedding, special occasions. Diamond Facial (PKR 5,000): Most luxurious, anti-aging benefits. HydraFacial (PKR 6,000): Most advanced technology, immediate results, all skin concerns. Choose based on budget and needs.',
    content_ur: 'Facial Comparison: Basic Facial (PKR 2,000): Regular maintenance ke liye best, sab skin types. Gold Facial (PKR 3,500): Brightening ke liye best, pre-wedding, special occasions. Diamond Facial (PKR 5,000): Sabse luxurious, anti-aging benefits. HydraFacial (PKR 6,000): Most advanced technology, immediate results, sab skin concerns. Budget aur needs ke mutabiq choose karein.',
    metadata: {
      faq_type: 'comparison',
      keywords: ['compare', 'difference', 'which is better', 'konsi acha', 'fark', 'comparison', 'versus']
    }
  },

  // Final closing data
  {
    id: 'closing_001',
    category: 'general',
    type: 'information',
    content_en: 'Thank You Message: Thank you for your interest! We look forward to serving you. For bookings call +92-300-1234567 or WhatsApp. Visit us at Shop #45, Main Boulevard, Clifton, Karachi. Open Monday-Saturday 10AM-8PM, Sunday 12PM-6PM. See you soon!',
    content_ur: 'Thank You Message: Aapki dilchaspi ka shukriya! Hum aapki service karne ke liye intezar kar rahe hain. Bookings ke liye +92-300-1234567 par call ya WhatsApp karein. Shop #45, Main Boulevard, Clifton, Karachi par aayen. Monday-Saturday 10AM-8PM, Sunday 12PM-6PM open hain. Jaldi milenge!',
    metadata: {
      type: 'closing',
      keywords: ['thank you', 'thanks', 'shukriya', 'dhanyavaad', 'goodbye', 'bye', 'khuda hafiz']
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

