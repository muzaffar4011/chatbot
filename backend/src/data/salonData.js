/**
 * Hard-coded Salon Knowledge Base
 * This data is used directly by the LLM without vector search
 */

export const SALON_KNOWLEDGE_BASE = {
  salonInfo: {
    name: "Glam Beauty Salon",
    tagline: "Your Beauty, Our Passion",
    established: "2018"
  },

  services: [
    // Hair Services
    { 
      id: 1, 
      name: "Haircut (Men)", 
      nameUrdu: "Mardana Baal Kaatna",
      price: 500, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Professional men's haircut with styling",
      category: "Hair"
    },
    { 
      id: 2, 
      name: "Haircut (Women)", 
      nameUrdu: "Khawateen Ka Baal Kaatna",
      price: 1000, 
      currency: "PKR", 
      duration: "45 minutes",
      description: "Women's haircut with wash and blow dry",
      category: "Hair"
    },
    { 
      id: 3, 
      name: "Hair Coloring", 
      nameUrdu: "Baalon Ka Rang",
      price: 3000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Full hair coloring with premium products",
      category: "Hair"
    },
    { 
      id: 4, 
      name: "Hair Highlights", 
      nameUrdu: "Hair Highlights",
      price: 4500, 
      currency: "PKR", 
      duration: "2.5 hours",
      description: "Professional hair highlighting with foils",
      category: "Hair"
    },
    { 
      id: 5, 
      name: "Hair Spa Treatment", 
      nameUrdu: "Hair Spa",
      price: 2500, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Deep conditioning and hair repair treatment",
      category: "Hair"
    },
    { 
      id: 6, 
      name: "Hair Straightening", 
      nameUrdu: "Baalon Ko Seedha Karna",
      price: 6000, 
      currency: "PKR", 
      duration: "3 hours",
      description: "Keratin hair straightening treatment",
      category: "Hair"
    },
    { 
      id: 7, 
      name: "Hair Rebonding", 
      nameUrdu: "Hair Rebonding",
      price: 8000, 
      currency: "PKR", 
      duration: "4 hours",
      description: "Complete hair rebonding for silky straight hair",
      category: "Hair"
    },
    { 
      id: 8, 
      name: "Hair Perming", 
      nameUrdu: "Baalon Ko Curly Karna",
      price: 5000, 
      currency: "PKR", 
      duration: "3 hours",
      description: "Professional hair perming for curls",
      category: "Hair"
    },
    { 
      id: 9, 
      name: "Hair Wash & Blow Dry", 
      nameUrdu: "Baal Dhona aur Dry Karna",
      price: 600, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Hair wash with professional blow dry styling",
      category: "Hair"
    },
    { 
      id: 10, 
      name: "Hair Treatment (Anti-Dandruff)", 
      nameUrdu: "Dandruff Treatment",
      price: 2000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Specialized anti-dandruff hair treatment",
      category: "Hair"
    },
    { 
      id: 11, 
      name: "Hair Treatment (Hair Fall)", 
      nameUrdu: "Baal Girne Ka Treatment",
      price: 2500, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Hair fall control treatment",
      category: "Hair"
    },
    { 
      id: 12, 
      name: "Beard Trim & Styling", 
      nameUrdu: "Darhi Ka Styling",
      price: 300, 
      currency: "PKR", 
      duration: "20 minutes",
      description: "Beard trimming and shaping",
      category: "Hair"
    },
    { 
      id: 13, 
      name: "Beard Coloring", 
      nameUrdu: "Darhi Ka Rang",
      price: 800, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Beard coloring service",
      category: "Hair"
    },
    { 
      id: 14, 
      name: "Head Massage", 
      nameUrdu: "Sar Ki Malish",
      price: 500, 
      currency: "PKR", 
      duration: "20 minutes",
      description: "Relaxing head and scalp massage",
      category: "Hair"
    },
    
    // Skin & Facial Services
    { 
      id: 15, 
      name: "Basic Facial", 
      nameUrdu: "Basic Facial",
      price: 1500, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Deep cleansing facial with massage",
      category: "Skin"
    },
    { 
      id: 16, 
      name: "Gold Facial", 
      nameUrdu: "Gold Facial",
      price: 3500, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Luxury gold facial for glowing skin",
      category: "Skin"
    },
    { 
      id: 17, 
      name: "Diamond Facial", 
      nameUrdu: "Diamond Facial",
      price: 5000, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Premium diamond facial treatment",
      category: "Skin"
    },
    { 
      id: 18, 
      name: "Whitening Facial", 
      nameUrdu: "Gora Karne Wala Facial",
      price: 2500, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Skin whitening and brightening facial",
      category: "Skin"
    },
    { 
      id: 19, 
      name: "Anti-Aging Facial", 
      nameUrdu: "Jhuriyon Ka Facial",
      price: 4000, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Anti-aging facial with collagen treatment",
      category: "Skin"
    },
    { 
      id: 20, 
      name: "Acne Treatment", 
      nameUrdu: "Pimples Ka Treatment",
      price: 3000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Specialized acne treatment facial",
      category: "Skin"
    },
    { 
      id: 21, 
      name: "Face Cleanup", 
      nameUrdu: "Chehre Ki Safai",
      price: 1200, 
      currency: "PKR", 
      duration: "45 minutes",
      description: "Basic face cleanup and exfoliation",
      category: "Skin"
    },
    { 
      id: 22, 
      name: "Chemical Peel", 
      nameUrdu: "Chemical Peel",
      price: 4500, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Professional chemical peel treatment",
      category: "Skin"
    },
    { 
      id: 23, 
      name: "Hydra Facial", 
      nameUrdu: "Hydra Facial",
      price: 6000, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Advanced hydra facial with deep hydration",
      category: "Skin"
    },
    
    // Nail Services
    { 
      id: 24, 
      name: "Manicure", 
      nameUrdu: "Manicure",
      price: 800, 
      currency: "PKR", 
      duration: "45 minutes",
      description: "Hand care with nail polish",
      category: "Nails"
    },
    { 
      id: 25, 
      name: "Pedicure", 
      nameUrdu: "Pedicure",
      price: 1000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Foot care with nail polish",
      category: "Nails"
    },
    { 
      id: 26, 
      name: "Gel Manicure", 
      nameUrdu: "Gel Manicure",
      price: 1500, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Long-lasting gel nail polish",
      category: "Nails"
    },
    { 
      id: 27, 
      name: "Gel Pedicure", 
      nameUrdu: "Gel Pedicure",
      price: 1800, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Long-lasting gel pedicure",
      category: "Nails"
    },
    { 
      id: 28, 
      name: "Nail Art", 
      nameUrdu: "Nail Art",
      price: 500, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Creative nail art designs",
      category: "Nails"
    },
    { 
      id: 29, 
      name: "Nail Extension", 
      nameUrdu: "Nail Extension",
      price: 3000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Acrylic or gel nail extensions",
      category: "Nails"
    },
    { 
      id: 30, 
      name: "French Manicure", 
      nameUrdu: "French Manicure",
      price: 1200, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Classic French manicure style",
      category: "Nails"
    },
    
    // Makeup Services
    { 
      id: 31, 
      name: "Bridal Makeup", 
      nameUrdu: "Dulhan Ka Makeup",
      price: 15000, 
      currency: "PKR", 
      duration: "3 hours",
      description: "Complete bridal makeup with hair styling",
      category: "Makeup"
    },
    { 
      id: 32, 
      name: "Party Makeup", 
      nameUrdu: "Party Makeup",
      price: 5000, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Glamorous party makeup",
      category: "Makeup"
    },
    { 
      id: 33, 
      name: "Engagement Makeup", 
      nameUrdu: "Mangni Ka Makeup",
      price: 8000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Elegant engagement makeup",
      category: "Makeup"
    },
    { 
      id: 34, 
      name: "Mehndi Makeup", 
      nameUrdu: "Mehndi Ka Makeup",
      price: 6000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Traditional mehndi function makeup",
      category: "Makeup"
    },
    { 
      id: 35, 
      name: "Natural Makeup", 
      nameUrdu: "Natural Makeup",
      price: 3000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Light and natural everyday makeup",
      category: "Makeup"
    },
    { 
      id: 36, 
      name: "HD Makeup", 
      nameUrdu: "HD Makeup",
      price: 7000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "High definition makeup for photography",
      category: "Makeup"
    },
    
    // Hair Removal Services
    { 
      id: 37, 
      name: "Threading (Face)", 
      nameUrdu: "Chehre Ka Threading",
      price: 200, 
      currency: "PKR", 
      duration: "15 minutes",
      description: "Eyebrow and face threading",
      category: "Hair Removal"
    },
    { 
      id: 38, 
      name: "Threading (Full Face)", 
      nameUrdu: "Pura Chehra Threading",
      price: 500, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Complete face threading",
      category: "Hair Removal"
    },
    { 
      id: 39, 
      name: "Waxing (Full Body)", 
      nameUrdu: "Pura Jism Waxing",
      price: 3500, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Full body waxing service",
      category: "Hair Removal"
    },
    { 
      id: 40, 
      name: "Waxing (Half Body)", 
      nameUrdu: "Aadha Jism Waxing",
      price: 2000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Half body waxing (upper or lower)",
      category: "Hair Removal"
    },
    { 
      id: 41, 
      name: "Waxing (Legs)", 
      nameUrdu: "Paon Ki Waxing",
      price: 1200, 
      currency: "PKR", 
      duration: "45 minutes",
      description: "Full legs waxing",
      category: "Hair Removal"
    },
    { 
      id: 42, 
      name: "Waxing (Arms)", 
      nameUrdu: "Hathon Ki Waxing",
      price: 800, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Full arms waxing",
      category: "Hair Removal"
    },
    { 
      id: 43, 
      name: "Waxing (Underarms)", 
      nameUrdu: "Baghal Ki Waxing",
      price: 500, 
      currency: "PKR", 
      duration: "15 minutes",
      description: "Underarm waxing",
      category: "Hair Removal"
    },
    { 
      id: 44, 
      name: "Waxing (Bikini)", 
      nameUrdu: "Bikini Waxing",
      price: 1500, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Bikini line waxing",
      category: "Hair Removal"
    },
    
    // Spa & Wellness Services
    { 
      id: 45, 
      name: "Moroccan Bath", 
      nameUrdu: "Moroccan Bath",
      price: 4000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Luxury Moroccan bath with scrub and massage",
      category: "Spa"
    },
    { 
      id: 46, 
      name: "Turkish Bath", 
      nameUrdu: "Turkish Bath",
      price: 3500, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Traditional Turkish bath experience",
      category: "Spa"
    },
    { 
      id: 47, 
      name: "Body Scrub", 
      nameUrdu: "Jism Ki Safai",
      price: 2000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Full body exfoliation scrub",
      category: "Spa"
    },
    { 
      id: 48, 
      name: "Body Massage", 
      nameUrdu: "Jism Ki Malish",
      price: 3000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Relaxing full body massage",
      category: "Spa"
    },
    { 
      id: 49, 
      name: "Back Massage", 
      nameUrdu: "Peeth Ki Malish",
      price: 1500, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Therapeutic back massage",
      category: "Spa"
    },
    { 
      id: 50, 
      name: "Aromatherapy", 
      nameUrdu: "Aromatherapy",
      price: 4000, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Aromatherapy massage with essential oils",
      category: "Spa"
    }
  ],

  timings: {
    weekdays: {
      days: "Tuesday to Saturday",
      daysUrdu: "Mangal se Hafta",
      open: "10:00 AM",
      close: "8:00 PM"
    },
    sunday: {
      day: "Sunday",
      dayUrdu: "Itwaar",
      open: "11:00 AM",
      close: "9:00 PM"
    },
    closed: {
      day: "Monday",
      dayUrdu: "Peer",
      reason: "Weekly off"
    }
  },

  location: {
    address: "Shop #12, Badar Commercial Street, DHA Phase 5, Karachi",
    addressUrdu: "Shop #12, Badar Commercial, DHA Phase 5, Karachi",
    landmark: "Near Agha Khan Hospital",
    city: "Karachi",
    phone: "+92-321-1234567",
    whatsapp: "+92-321-1234567",
    email: "info@glamsalon.pk",
    instagram: "@glamsalon.pk"
  },

  staff: [
    { 
      id: 1,
      name: "Sara Khan", 
      nameUrdu: "Sara Khan",
      role: "Senior Hair Stylist", 
      roleUrdu: "Senior Hair Stylist",
      specialty: "Hair Coloring & Styling",
      specialtyUrdu: "Baalon Ka Rang aur Styling",
      experience: "8 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 2,
      name: "Ahmed Ali", 
      nameUrdu: "Ahmed Ali",
      role: "Master Barber", 
      roleUrdu: "Master Barber",
      specialty: "Men's Haircuts & Beard Styling",
      specialtyUrdu: "Mardana Haircut aur Darhi",
      experience: "10 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 3,
      name: "Fatima Noor", 
      nameUrdu: "Fatima Noor",
      role: "Beauty Expert", 
      roleUrdu: "Beauty Expert",
      specialty: "Facials, Makeup & Skincare",
      specialtyUrdu: "Facial, Makeup aur Skin Care",
      experience: "6 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 4,
      name: "Hassan Raza", 
      nameUrdu: "Hassan Raza",
      role: "Junior Stylist", 
      roleUrdu: "Junior Stylist",
      specialty: "Basic Haircuts & Styling",
      specialtyUrdu: "Basic Haircut aur Styling",
      experience: "3 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 5,
      name: "Ayesha Malik", 
      nameUrdu: "Ayesha Malik",
      role: "Bridal Makeup Artist", 
      roleUrdu: "Dulhan Makeup Artist",
      specialty: "Bridal & Party Makeup",
      specialtyUrdu: "Dulhan aur Party Makeup",
      experience: "7 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 6,
      name: "Zainab Sheikh", 
      nameUrdu: "Zainab Sheikh",
      role: "Nail Art Specialist", 
      roleUrdu: "Nail Art Expert",
      specialty: "Nail Art & Gel Extensions",
      specialtyUrdu: "Nail Art aur Gel Extension",
      experience: "5 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 7,
      name: "Bilal Ahmed", 
      nameUrdu: "Bilal Ahmed",
      role: "Senior Barber", 
      roleUrdu: "Senior Barber",
      specialty: "Men's Grooming & Hair Treatments",
      specialtyUrdu: "Mardana Grooming aur Hair Treatment",
      experience: "9 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 8,
      name: "Hina Aslam", 
      nameUrdu: "Hina Aslam",
      role: "Skin Care Specialist", 
      roleUrdu: "Skin Care Expert",
      specialty: "Facials & Skin Treatments",
      specialtyUrdu: "Facial aur Skin Treatment",
      experience: "6 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 9,
      name: "Usman Khan", 
      nameUrdu: "Usman Khan",
      role: "Hair Treatment Expert", 
      roleUrdu: "Hair Treatment Expert",
      specialty: "Hair Spa, Rebonding & Straightening",
      specialtyUrdu: "Hair Spa, Rebonding aur Straightening",
      experience: "8 years",
      availability: "Tuesday to Sunday"
    },
    { 
      id: 10,
      name: "Rabia Ali", 
      nameUrdu: "Rabia Ali",
      role: "Spa Therapist", 
      roleUrdu: "Spa Therapist",
      specialty: "Body Massage & Spa Treatments",
      specialtyUrdu: "Body Massage aur Spa Treatment",
      experience: "4 years",
      availability: "Tuesday to Sunday"
    }
  ],

  packages: [
    { 
      id: 1,
      name: "Bridal Package",
      nameUrdu: "Dulhan Package",
      price: 50000,
      currency: "PKR",
      services: ["Bridal Makeup", "Hair Styling", "Manicure", "Pedicure", "Facial Treatment", "Trial Session"],
      servicesUrdu: ["Dulhan Makeup", "Hair Styling", "Manicure", "Pedicure", "Facial", "Trial"],
      validity: "Valid for wedding day + 1 trial",
      description: "Complete bridal package with all services"
    },
    { 
      id: 2,
      name: "Groom Package",
      nameUrdu: "Dulha Package",
      price: 8000,
      currency: "PKR",
      services: ["Haircut", "Beard Styling", "Facial", "Manicure", "Head Massage"],
      servicesUrdu: ["Haircut", "Darhi Styling", "Facial", "Manicure", "Sar Ki Malish"],
      validity: "Valid for wedding day",
      description: "Complete groom grooming package"
    },
    { 
      id: 3,
      name: "Monthly Membership",
      nameUrdu: "Maahana Membership",
      price: 5000,
      currency: "PKR",
      services: ["2 Haircuts", "1 Facial", "20% off on all other services"],
      servicesUrdu: ["2 Haircut", "1 Facial", "Baqi Services Par 20% Discount"],
      validity: "30 days from purchase",
      description: "Monthly membership with benefits"
    },
    { 
      id: 4,
      name: "Party Makeup Package",
      nameUrdu: "Party Makeup Package",
      price: 8000,
      currency: "PKR",
      services: ["Party Makeup", "Hair Styling", "Threading", "Manicure"],
      servicesUrdu: ["Party Makeup", "Hair Styling", "Threading", "Manicure"],
      validity: "Single use",
      description: "Complete party look package"
    },
    { 
      id: 5,
      name: "Engagement Package",
      nameUrdu: "Mangni Package",
      price: 12000,
      currency: "PKR",
      services: ["Engagement Makeup", "Hair Styling", "Manicure", "Pedicure", "Facial"],
      servicesUrdu: ["Mangni Makeup", "Hair Styling", "Manicure", "Pedicure", "Facial"],
      validity: "Single use",
      description: "Elegant engagement package"
    },
    { 
      id: 6,
      name: "Mehndi Package",
      nameUrdu: "Mehndi Package",
      price: 10000,
      currency: "PKR",
      services: ["Mehndi Makeup", "Hair Styling", "Manicure", "Pedicure", "Threading"],
      servicesUrdu: ["Mehndi Makeup", "Hair Styling", "Manicure", "Pedicure", "Threading"],
      validity: "Single use",
      description: "Traditional mehndi function package"
    },
    { 
      id: 7,
      name: "Hair Care Package",
      nameUrdu: "Baalon Ki Dekhbhal Package",
      price: 4000,
      currency: "PKR",
      services: ["Hair Spa", "Hair Treatment", "Hair Wash & Blow Dry", "Head Massage"],
      servicesUrdu: ["Hair Spa", "Hair Treatment", "Hair Wash aur Blow Dry", "Sar Ki Malish"],
      validity: "30 days from purchase",
      description: "Complete hair care treatment package"
    },
    { 
      id: 8,
      name: "Beauty Package",
      nameUrdu: "Beauty Package",
      price: 3500,
      currency: "PKR",
      services: ["Facial", "Manicure", "Pedicure", "Threading", "Hair Wash"],
      servicesUrdu: ["Facial", "Manicure", "Pedicure", "Threading", "Hair Wash"],
      validity: "30 days from purchase",
      description: "Complete beauty care package"
    },
    { 
      id: 9,
      name: "Spa Package",
      nameUrdu: "Spa Package",
      price: 6000,
      currency: "PKR",
      services: ["Moroccan Bath", "Body Scrub", "Body Massage", "Facial"],
      servicesUrdu: ["Moroccan Bath", "Body Scrub", "Body Massage", "Facial"],
      validity: "30 days from purchase",
      description: "Relaxing spa experience package"
    },
    { 
      id: 10,
      name: "Men's Grooming Package",
      nameUrdu: "Mardana Grooming Package",
      price: 2500,
      currency: "PKR",
      services: ["Haircut", "Beard Styling", "Facial", "Head Massage", "Manicure"],
      servicesUrdu: ["Haircut", "Darhi Styling", "Facial", "Sar Ki Malish", "Manicure"],
      validity: "30 days from purchase",
      description: "Complete men's grooming package"
    }
  ],

  discounts: [
    {
      id: 1,
      type: "First Visit",
      typeUrdu: "Pehli Dafa",
      discount: "10%",
      description: "10% discount on first visit",
      descriptionUrdu: "Pehli baar aane par 10% discount",
      terms: "Valid on all services",
      validOn: "All services"
    },
    {
      id: 2,
      type: "Package Discount",
      typeUrdu: "Package Discount",
      discount: "20%",
      description: "20% off on all packages",
      descriptionUrdu: "Tamam packages par 20% discount",
      terms: "Cannot be combined with other offers",
      validOn: "All packages"
    },
    {
      id: 3,
      type: "Student Discount",
      typeUrdu: "Student Discount",
      discount: "15%",
      description: "15% discount for students",
      descriptionUrdu: "Students ke liye 15% discount",
      terms: "Valid student ID required",
      validOn: "All services"
    },
    {
      id: 4,
      type: "Senior Citizen",
      typeUrdu: "Buzurg Discount",
      discount: "10%",
      description: "10% discount for senior citizens (60+)",
      descriptionUrdu: "60 saal se zyada umr ke liye 10% discount",
      terms: "Age verification required",
      validOn: "All services"
    },
    {
      id: 5,
      type: "Weekday Discount",
      typeUrdu: "Weekday Discount",
      discount: "15%",
      description: "15% discount on Tuesday to Thursday",
      descriptionUrdu: "Mangal se Jumeraat ko 15% discount",
      terms: "Valid Tuesday to Thursday only",
      validOn: "All services"
    },
    {
      id: 6,
      type: "Referral Discount",
      typeUrdu: "Referral Discount",
      discount: "500 PKR",
      description: "500 PKR discount when you refer a friend",
      descriptionUrdu: "Dost ko refer karne par 500 PKR discount",
      terms: "Friend must make a purchase",
      validOn: "All services"
    },
    {
      id: 7,
      type: "Birthday Discount",
      typeUrdu: "Janamdin Discount",
      discount: "20%",
      description: "20% discount on your birthday month",
      descriptionUrdu: "Apne janamdin ke mahine me 20% discount",
      terms: "Valid ID proof required",
      validOn: "All services"
    },
    {
      id: 8,
      type: "Group Discount",
      typeUrdu: "Group Discount",
      discount: "10%",
      description: "10% discount for groups of 3 or more",
      descriptionUrdu: "3 ya zyada logon ke group me 10% discount",
      terms: "Minimum 3 people required",
      validOn: "All services"
    }
  ],

  bookingInfo: {
    methods: ["Phone Call", "WhatsApp", "Walk-in", "Instagram DM"],
    methodsUrdu: ["Phone", "WhatsApp", "Seedha Aana", "Instagram Message"],
    phone: "+92-321-1234567",
    whatsapp: "+92-321-1234567",
    advanceBooking: "Recommended for weekends and packages",
    advanceBookingUrdu: "Weekend aur packages ke liye pehle se booking zaroori",
    walkIn: "Welcome, subject to availability",
    walkInUrdu: "Bina booking bhi aa sakte hain agar khali ho"
  },

  policies: {
    cancellation: "Cancel 2 hours before appointment",
    cancellationUrdu: "Appointment se 2 ghante pehle cancel karein",
    payment: "Cash, Card, and Mobile Banking accepted",
    paymentUrdu: "Cash, Card aur Mobile Banking sab chalta hai",
    hygiene: "Sanitized tools and equipment for every customer",
    hygieneUrdu: "Har customer ke liye saaf equipment",
    refund: "No refunds, but rescheduling allowed with 2 hours notice",
    refundUrdu: "Refund nahi, lekin 2 ghante pehle batane par reschedule kar sakte hain",
    lateArrival: "Late arrival may result in shortened service time",
    lateArrivalUrdu: "Late aane par service time kam ho sakta hai"
  },

  amenities: {
    parking: "Free basement parking available",
    parkingUrdu: "Free basement parking available hai",
    wifi: "Free WiFi for customers",
    wifiUrdu: "Customers ke liye free WiFi",
    waitingArea: "Comfortable waiting area with refreshments",
    waitingAreaUrdu: "Araamda waiting area with refreshments",
    magazines: "Latest fashion and beauty magazines",
    magazinesUrdu: "Latest fashion aur beauty magazines",
    music: "Ambient music for relaxation",
    musicUrdu: "Relaxation ke liye ambient music",
    airConditioning: "Fully air-conditioned salon",
    airConditioningUrdu: "Puri tarah se air-conditioned salon"
  },

  specialFeatures: {
    premiumProducts: "We use only premium international brands",
    premiumProductsUrdu: "Hum sirf premium international brands use karte hain",
    expertStaff: "Certified and experienced professionals",
    expertStaffUrdu: "Certified aur experienced professionals",
    latestTechniques: "Latest techniques and trends in beauty industry",
    latestTechniquesUrdu: "Beauty industry ki latest techniques aur trends",
    personalizedService: "Personalized service for each customer",
    personalizedServiceUrdu: "Har customer ke liye personalized service",
    consultation: "Free consultation before any service",
    consultationUrdu: "Kisi bhi service se pehle free consultation"
  },

  awards: [
    {
      id: 1,
      title: "Best Salon 2023",
      titleUrdu: "Best Salon 2023",
      organization: "Karachi Beauty Awards",
      year: "2023"
    },
    {
      id: 2,
      title: "Excellence in Bridal Services",
      titleUrdu: "Bridal Services me Excellence",
      organization: "Pakistan Beauty Council",
      year: "2022"
    }
  ],

  testimonials: [
    {
      id: 1,
      name: "Ayesha Ahmed",
      comment: "Best salon in Karachi! Amazing service and friendly staff.",
      commentUrdu: "Karachi ka sabse behtar salon! Amazing service aur friendly staff.",
      rating: 5
    },
    {
      id: 2,
      name: "Hassan Ali",
      comment: "Professional haircuts and great value for money.",
      commentUrdu: "Professional haircut aur paison ka behtar value.",
      rating: 5
    }
  ]
};

