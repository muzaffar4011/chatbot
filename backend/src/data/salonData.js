export const SALON_KNOWLEDGE_BASE = {
  salonInfo: {
    name: "Glam Beauty Salon",
    tagline: "Your Beauty, Our Passion",
    established: "2018",
    foundedBy: "Ayesha Mahmood",
    awards: [
      "Best Salon in Karachi 2022 - Style Awards",
      "Customer Choice Award 2023",
      "Excellence in Beauty Services 2021"
    ],
    certifications: [
      "ISO 9001:2015 Certified",
      "Halal Certified Products",
      "Safety & Hygiene Certified"
    ],
    socialMedia: {
      facebook: "facebook.com/glamsalon.pk",
      instagram: "@glamsalon.pk",
      tiktok: "@glamsalon.official",
      youtube: "Glam Beauty Salon Karachi"
    }
  },

  services: [
    { 
      id: 1, 
      name: "Haircut (Men)", 
      nameUrdu: "Mardana Baal Kaatna",
      price: 500, 
      currency: "PKR", 
      duration: "30 minutes",
      description: "Professional men's haircut with styling",
      includes: ["Consultation", "Wash", "Cut", "Styling", "Head massage"],
      productsUsed: ["L'Oréal Professional", "American Crew"],
      popularWith: "Working professionals, students"
    },
    { 
      id: 2, 
      name: "Haircut (Women)", 
      nameUrdu: "Khawateen Ka Baal Kaatna",
      price: 1000, 
      currency: "PKR", 
      duration: "45 minutes",
      description: "Women's haircut with wash and blow dry",
      includes: ["Consultation", "Wash", "Cut", "Blow dry", "Styling"],
      productsUsed: ["Schwarzkopf", "Kerastase"],
      styles: ["Bob cut", "Layers", "Bangs", "Trim", "Split ends treatment"]
    },
    { 
      id: 3, 
      name: "Hair Coloring", 
      nameUrdu: "Baalon Ka Rang",
      price: 3000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Full hair coloring with premium products",
      includes: ["Consultation", "Strand test", "Application", "Wash", "Conditioning", "Blow dry"],
      types: ["Full color", "Root touch-up", "Highlights", "Balayage", "Ombre", "Lowlights"],
      productsUsed: ["Wella Koleston", "L'Oréal Majirel", "Schwarzkopf Igora"],
      priceRange: "3000-8000 PKR depending on length and technique"
    },
    { 
      id: 4, 
      name: "Beard Trim & Styling", 
      nameUrdu: "Darhi Ka Styling",
      price: 300, 
      currency: "PKR", 
      duration: "20 minutes",
      description: "Beard trimming and shaping",
      includes: ["Trimming", "Shaping", "Line-up", "Hot towel", "Aftershave"],
      styles: ["Full beard", "Goatee", "Stubble", "Designer beard"]
    },
    { 
      id: 5, 
      name: "Facial Treatment", 
      nameUrdu: "Facial Treatment",
      price: 1500, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Deep cleansing facial with massage",
      types: ["Whitening facial", "Anti-aging", "Acne treatment", "Hydrating", "Gold facial"],
      includes: ["Cleansing", "Steaming", "Scrub", "Extraction", "Mask", "Massage", "Moisturizer"],
      productsUsed: ["Dermalogica", "The Body Shop", "Garnier"],
      priceRange: "1500-3500 PKR depending on type"
    },
    { 
      id: 6, 
      name: "Manicure", 
      nameUrdu: "Manicure",
      price: 800, 
      currency: "PKR", 
      duration: "45 minutes",
      description: "Hand care with nail polish",
      types: ["Regular manicure", "Gel manicure", "French manicure", "Spa manicure"],
      includes: ["Nail shaping", "Cuticle care", "Hand scrub", "Massage", "Polish"],
      productsUsed: ["OPI", "Essie", "CND"]
    },
    { 
      id: 7, 
      name: "Pedicure", 
      nameUrdu: "Pedicure",
      price: 1000, 
      currency: "PKR", 
      duration: "1 hour",
      description: "Foot care with nail polish",
      types: ["Regular pedicure", "Gel pedicure", "French pedicure", "Spa pedicure"],
      includes: ["Foot soak", "Nail shaping", "Cuticle care", "Scrub", "Callus removal", "Massage", "Polish"],
      productsUsed: ["OPI", "Essie", "The Body Shop"]
    },
    { 
      id: 8, 
      name: "Hair Spa Treatment", 
      nameUrdu: "Hair Spa",
      price: 2500, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Deep conditioning and hair repair treatment",
      includes: ["Consultation", "Oil massage", "Steam", "Hair mask", "Wash", "Serum", "Blow dry"],
      benefits: ["Repairs damaged hair", "Reduces frizz", "Adds shine", "Strengthens hair"],
      productsUsed: ["Kerastase", "Moroccanoil", "L'Oréal Professional"]
    },
    { 
      id: 9, 
      name: "Bridal Makeup", 
      nameUrdu: "Dulhan Ka Makeup",
      price: 15000, 
      currency: "PKR", 
      duration: "3 hours",
      description: "Complete bridal makeup with hair styling",
      includes: ["Consultation", "Skin prep", "Foundation", "Eye makeup", "Contouring", "Lips", "Hair styling", "Dupatta setting"],
      styles: ["Traditional bridal", "Modern bridal", "Minimalist bridal", "Glamorous bridal"],
      productsUsed: ["MAC", "Huda Beauty", "Anastasia Beverly Hills", "Charlotte Tilbury"],
      additionalServices: ["Trial makeup (3000 PKR)", "Touch-up kit", "Photography-ready makeup"]
    },
    { 
      id: 10, 
      name: "Threading (Face)", 
      nameUrdu: "Chehre Ka Threading",
      price: 200, 
      currency: "PKR", 
      duration: "15 minutes",
      description: "Eyebrow and face threading",
      areas: ["Eyebrows", "Upper lip", "Forehead", "Chin", "Sideburns", "Full face"],
      priceBreakdown: {
        eyebrows: 150,
        upperLip: 100,
        fullFace: 200,
        chin: 100
      }
    },
    { 
      id: 11, 
      name: "Waxing (Full Body)", 
      nameUrdu: "Pura Jism Waxing",
      price: 3500, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Full body waxing service",
      types: ["Hot wax", "Cold wax", "Chocolate wax", "Rica wax"],
      areas: ["Full arms", "Full legs", "Underarms", "Bikini line", "Stomach", "Back"],
      priceBreakdown: {
        fullArms: 600,
        fullLegs: 800,
        halfArms: 400,
        halfLegs: 500,
        underarms: 300,
        bikiniLine: 500
      }
    },
    { 
      id: 12, 
      name: "Moroccan Bath", 
      nameUrdu: "Moroccan Bath",
      price: 4000, 
      currency: "PKR", 
      duration: "2 hours",
      description: "Luxury Moroccan bath with scrub and massage",
      includes: ["Steam room", "Black soap application", "Body scrub", "Clay mask", "Full body massage", "Moisturizer"],
      benefits: ["Deep cleansing", "Skin exfoliation", "Relaxation", "Improved circulation"]
    },
    { 
      id: 13, 
      name: "Keratin Treatment", 
      nameUrdu: "Keratin Treatment",
      price: 8000, 
      currency: "PKR", 
      duration: "3 hours",
      description: "Professional keratin smoothing treatment",
      includes: ["Deep cleansing", "Keratin application", "Heat sealing", "Blow dry", "Flat iron"],
      benefits: ["Frizz-free hair for 3-6 months", "Smooth & shiny", "Manageable hair"],
      productsUsed: ["Brazilian Blowout", "Global Keratin"],
      aftercare: ["Sulfate-free shampoo required", "No washing for 72 hours"]
    },
    { 
      id: 14, 
      name: "Mehndi Application", 
      nameUrdu: "Mehndi Lagana",
      price: 1500, 
      currency: "PKR", 
      duration: "1-2 hours",
      description: "Traditional and modern mehndi designs",
      types: ["Bridal mehndi", "Party mehndi", "Arabic design", "Pakistani design", "Simple patterns"],
      priceRange: "500-5000 PKR depending on design complexity",
      includes: ["Consultation", "Design application", "Aftercare tips"]
    },
    { 
      id: 15, 
      name: "Party Makeup", 
      nameUrdu: "Party Makeup",
      price: 3500, 
      currency: "PKR", 
      duration: "1.5 hours",
      description: "Glamorous makeup for events and parties",
      includes: ["Skin prep", "Makeup application", "Hair styling", "False lashes"],
      styles: ["Smokey eye", "Glam look", "Natural glam", "Bold lips"],
      productsUsed: ["MAC", "Urban Decay", "NARS", "Benefit"]
    },
    {
      id: 16,
      name: "Hair Extensions",
      nameUrdu: "Baalon Ki Extension",
      price: 5000,
      currency: "PKR",
      duration: "2-3 hours",
      description: "Clip-in and bonded hair extensions",
      types: ["Clip-in extensions", "Tape-in", "Micro ring", "Bonded extensions"],
      lengths: ["12 inch", "16 inch", "20 inch", "24 inch"],
      priceRange: "5000-20000 PKR depending on length and type"
    },
    {
      id: 17,
      name: "Scalp Treatment",
      nameUrdu: "Khopri Ka Ilaaj",
      price: 2000,
      currency: "PKR",
      duration: "1 hour",
      description: "Treatment for dandruff, hair fall, and scalp issues",
      includes: ["Scalp analysis", "Treatment mask", "Massage", "Steaming"],
      treats: ["Dandruff", "Hair fall", "Dry scalp", "Oily scalp", "Itching"]
    },
    {
      id: 18,
      name: "Eyebrow Tinting",
      nameUrdu: "Brow Tinting",
      price: 800,
      currency: "PKR",
      duration: "30 minutes",
      description: "Semi-permanent eyebrow coloring",
      colors: ["Black", "Dark brown", "Light brown", "Auburn"],
      lasts: "3-4 weeks"
    },
    {
      id: 19,
      name: "Eyelash Extensions",
      nameUrdu: "Palkon Ki Extension",
      price: 3000,
      currency: "PKR",
      duration: "2 hours",
      description: "Individual lash extensions application",
      types: ["Classic", "Volume", "Hybrid", "Mega volume"],
      lasts: "3-4 weeks",
      includes: ["Consultation", "Application", "Aftercare kit"]
    },
    {
      id: 20,
      name: "Body Polishing",
      nameUrdu: "Body Polishing",
      price: 3500,
      currency: "PKR",
      duration: "1.5 hours",
      description: "Full body scrub and whitening treatment",
      includes: ["Exfoliation", "Whitening mask", "Massage", "Moisturizer"],
      productsUsed: ["Fruit scrubs", "Organic ingredients", "Whitening creams"]
    }
  ],

  timings: {
    weekdays: {
      days: "Tuesday to Saturday",
      daysUrdu: "Mangal se Hafta",
      open: "10:00 AM",
      close: "8:00 PM",
      lunchBreak: "2:00 PM - 2:30 PM",
      note: "Last appointment at 7:00 PM"
    },
    sunday: {
      day: "Sunday",
      dayUrdu: "Itwaar",
      open: "11:00 AM",
      close: "9:00 PM",
      note: "Extended hours on Sunday"
    },
    closed: {
      day: "Monday",
      dayUrdu: "Peer",
      reason: "Weekly off",
      note: "Emergency bookings available on WhatsApp"
    },
    holidays: {
      eidUlFitr: "Closed for 3 days",
      eidUlAdha: "Closed for 3 days",
      independenceDay: "Open with special offers",
      note: "Holiday timings announced on Instagram"
    },
    peakHours: {
      weekends: "Saturday & Sunday afternoon",
      weekdays: "Evening 5:00 PM - 8:00 PM",
      recommendation: "Book in advance during peak hours"
    }
  },

  location: {
    address: "Shop #12, Badar Commercial Street, DHA Phase 5, Karachi",
    addressUrdu: "Shop #12, Badar Commercial, DHA Phase 5, Karachi",
    landmark: "Near Agha Khan Hospital",
    nearbyLandmarks: [
      "Opposite Dunkin Donuts",
      "Next to Al-Fatah Supermarket",
      "5 minutes from Giga Mall"
    ],
    city: "Karachi",
    area: "DHA Phase 5",
    zipCode: "75500",
    phone: "+92-321-1234567",
    whatsapp: "+92-321-1234567",
    email: "info@glamsalon.pk",
    instagram: "@glamsalon.pk",
    googleMaps: "https://maps.google.com/?q=Glam+Beauty+Salon+DHA",
    parking: "Available on street and nearby parking plaza",
    accessibility: "Wheelchair accessible, ground floor location"
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
      certifications: ["L'Oréal Color Specialist", "Vidal Sassoon Academy Graduate"],
      languages: ["English", "Urdu", "Punjabi"],
      availability: "Tuesday to Saturday, 10 AM - 6 PM",
      bookingRequired: true
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
      certifications: ["Master Barber Certification Dubai", "American Crew Certified"],
      languages: ["English", "Urdu"],
      availability: "Tuesday to Sunday, 11 AM - 8 PM",
      bookingRequired: false
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
      certifications: ["CIDESCO Diploma", "MAC Makeup Certification"],
      languages: ["English", "Urdu"],
      availability: "Tuesday to Saturday, 10 AM - 7 PM",
      bookingRequired: true,
      specialNote: "Bridal makeup expert"
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
      certifications: ["Basic Hairdressing Certificate"],
      languages: ["Urdu", "English"],
      availability: "Wednesday to Sunday, 12 PM - 8 PM",
      bookingRequired: false
    },
    {
      id: 5,
      name: "Zainab Malik",
      nameUrdu: "Zainab Malik",
      role: "Bridal Specialist",
      roleUrdu: "Dulhan Specialist",
      specialty: "Bridal Makeup & Mehndi",
      specialtyUrdu: "Dulhan Makeup aur Mehndi",
      experience: "7 years",
      certifications: ["Bridal Makeup Specialist", "Professional Mehndi Artist"],
      languages: ["English", "Urdu", "Sindhi"],
      availability: "By appointment only",
      bookingRequired: true,
      bookingAdvance: "Minimum 2 weeks for bridal bookings"
    },
    {
      id: 6,
      name: "Maria Joseph",
      nameUrdu: "Maria Joseph",
      role: "Nail Technician",
      roleUrdu: "Nail Technician",
      specialty: "Manicure, Pedicure & Nail Art",
      specialtyUrdu: "Manicure, Pedicure aur Nail Art",
      experience: "4 years",
      certifications: ["OPI Certified", "Gel Nail Specialist"],
      languages: ["English", "Urdu"],
      availability: "Tuesday to Saturday, 11 AM - 7 PM",
      bookingRequired: false
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
      includes: ["Touch-up kit", "Makeup assistant", "Dupatta setting", "False lashes"],
      bookingAdvance: "Minimum 2 weeks notice required",
      deposit: "30% advance payment required"
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
      includes: ["Hot towel service", "Premium grooming products"]
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
      benefits: ["Priority booking", "Special birthday discount", "Complimentary head massage"],
      nonTransferable: true
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
      includes: ["False lashes", "Makeup setting spray", "Touch-up tips"]
    },
    {
      id: 5,
      name: "Spa Relaxation Package",
      nameUrdu: "Spa Relaxation Package",
      price: 12000,
      currency: "PKR",
      services: ["Moroccan Bath", "Full Body Massage", "Hair Spa", "Facial", "Manicure", "Pedicure"],
      servicesUrdu: ["Moroccan Bath", "Full Body Massage", "Hair Spa", "Facial", "Manicure", "Pedicure"],
      duration: "5 hours",
      validity: "Single use within 3 months",
      includes: ["Light refreshments", "Aromatherapy", "Relaxation room access"]
    },
    {
      id: 6,
      name: "Teen Pampering Package",
      nameUrdu: "Teen Package",
      price: 3500,
      currency: "PKR",
      services: ["Basic Facial", "Manicure", "Pedicure", "Hair Styling"],
      servicesUrdu: ["Basic Facial", "Manicure", "Pedicure", "Hair Styling"],
      validity: "Single use",
      ageRange: "13-19 years",
      note: "Perfect for birthdays and celebrations"
    },
    {
      id: 7,
      name: "Hair Care Bundle",
      nameUrdu: "Baalon Ki Care Bundle",
      price: 6000,
      currency: "PKR",
      services: ["Haircut", "Hair Coloring/Highlights", "Hair Spa", "Scalp Treatment"],
      servicesUrdu: ["Haircut", "Hair Ka Rang", "Hair Spa", "Khopri Ka Ilaaj"],
      validity: "Single session",
      savings: "Save 2000 PKR vs individual services"
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
      code: "FIRST10",
      validUntil: "Ongoing offer"
    },
    {
      id: 2,
      type: "Package Discount",
      typeUrdu: "Package Discount",
      discount: "20%",
      description: "20% off on all packages",
      descriptionUrdu: "Tamam packages par 20% discount",
      terms: "Cannot be combined with other offers",
      validUntil: "Ongoing offer"
    },
    {
      id: 3,
      type: "Student Discount",
      typeUrdu: "Student Discount",
      discount: "15%",
      description: "15% discount for students",
      descriptionUrdu: "Students ke liye 15% discount",
      terms: "Valid student ID required",
      applicableOn: "All services except packages",
      validDays: "Tuesday to Thursday"
    },
    {
      id: 4,
      type: "Senior Citizen",
      typeUrdu: "Buzurg Discount",
      discount: "10%",
      description: "10% discount for senior citizens (60+)",
      descriptionUrdu: "60 saal se zyada umr ke liye 10% discount",
      terms: "Age verification required",
      applicableOn: "All services"
    },
    {
      id: 5,
      type: "Birthday Special",
      typeUrdu: "Janam Din Special",
      discount: "25%",
      description: "25% off on your birthday month",
      descriptionUrdu: "Aapke janam din ke mahine mein 25% discount",
      terms: "Valid CNIC required, valid for birthday month only",
      applicableOn: "One service per birthday month"
    },
    {
      id: 6,
      type: "Referral Discount",
      typeUrdu: "Referral Discount",
      discount: "500 PKR",
      description: "500 PKR off for referring a friend",
      descriptionUrdu: "Dost ko lane par 500 rupay discount",
      terms: "Both referrer and referee get 500 PKR off on next visit",
      minimumBill: "3000 PKR"
    },
    {
      id: 7,
      type: "Early Bird Special",
      typeUrdu: "Subah Ka Special",
      discount: "15%",
      description: "15% off on appointments before 12 PM",
      descriptionUrdu: "Dopahar 12 baje se pehle 15% discount",
      terms: "Valid Tuesday to Friday only",
      excludes: "Packages and bridal services"
    },
    {
      id: 8,
      type: "Group Booking",
      typeUrdu: "Group Booking",
      discount: "20%",
      description: "20% off for groups of 4 or more",
      descriptionUrdu: "4 ya zyada logon ke group ko 20% discount",
      terms: "Advanced booking required, same day service",
      minimumPeople: 4
    }
  ],

  bookingInfo: {
    methods: ["Phone Call", "WhatsApp", "Walk-in", "Instagram DM"],
    methodsUrdu: ["Phone", "WhatsApp", "Seedha Aana", "Instagram Message"],
    phone: "+92-321-1234567",
    whatsapp: "+92-321-1234567",
    instagram: "@glamsalon.pk",
    email: "booking@glamsalon.pk",
    advanceBooking: "Recommended for weekends and packages",
    advanceBookingUrdu: "Weekend aur packages ke liye pehle se booking zaroori",
    walkIn: "Welcome, subject to availability",
    walkInUrdu: "Bina booking bhi aa sakte hain agar khali ho",
    bridalBooking: "Minimum 2 weeks advance booking required",
    peakTimesBooking: "3-5 days advance recommended for weekends",
    cancellationNotice: "2 hours minimum",
    reschedulePolicy: "Free rescheduling up to 4 hours before appointment",
    noShowPolicy: "No-shows may be charged 50% of service fee",
    groupBookings: "Call for special arrangements for groups of 5+",
    emergencyBooking: "Subject to availability, contact via WhatsApp"
  },

  policies: {
    cancellation: "Cancel 2 hours before appointment",
    cancellationUrdu: "Appointment se 2 ghante pehle cancel karein",
    cancellationFee: "No fee if cancelled 2+ hours before, 50% fee for no-shows",
    payment: "Cash, Card, and Mobile Banking accepted",
    paymentUrdu: "Cash, Card aur Mobile Banking sab chalta hai",
    paymentMethods: ["Cash", "Credit/Debit Cards", "JazzCash", "Easypaisa", "Bank Transfer"],
    advancePayment: "30% advance for bridal bookings",
    refundPolicy: "Refunds available within 24 hours of service if unsatisfied",
    hygiene: "Sanitized tools and equipment for every customer",
    hygieneUrdu: "Har customer ke liye saaf equipment",
    hygieneStandards: [
      "Single-use disposable items where possible",
      "UV sterilization of tools",
      "Fresh towels and capes for each client",
      "Regular sanitization of work stations",
      "Temperature checks at entry",
      "Hand sanitizers available throughout salon"
    ],
    childPolicy: "Children under 12 must be accompanied by guardian",
    lateArrival: "15 minutes grace period, may need to reschedule if later",
    photographyPolicy: "Photography allowed for personal use, please ask before posting",
    tippingPolicy: "Tips appreciated but not mandatory, 10-15% is customary",
    productPolicy: "Authentic products only, product list available on request",
    allergyPolicy: "Please inform us of any allergies or skin sensitivities"
  },

  products: {
    brands: [
      "L'Oréal Professional",
      "Schwarzkopf",
      "Wella",
      "Kerastase",
      "MAC Cosmetics",
      "OPI",
      "Essie",
      "Dermalogica",
      "The Body Shop",
      "Moroccanoil",
      "American Crew",
      "Huda Beauty"
    ],
    retail: {
      available: true,
      discount: "10% off retail products for salon clients",
      topSelling: [
        "Kerastase Hair Serum - 3500 PKR",
        "Moroccanoil Treatment - 4500 PKR",
        "OPI Nail Polish - 1200 PKR",
        "L'Oréal Hair Color - 2500 PKR"
      ]
    },
    halal: {
      certified: true,
      note: "All products are halal certified and alcohol-free"
    }
  },

  testimonials: [
    {
      id: 1,
      name: "Aisha R.",
      rating: 5,
      service: "Bridal Makeup",
      comment: "Best bridal makeup in Karachi! Fatima did an amazing job on my wedding day. Highly recommend!",
      commentUrdu: "Karachi mein sab se behtar dulhan makeup! Fatima ne mere shaadi ke din kamal ka kaam kiya.",
      date: "October 2024"
    },
    {
      id: 2,
      name: "Ali M.",
      rating: 5,
      service: "Men's Haircut",
      comment: "Ahmed is a master barber. Always gets my haircut exactly right. Great service!",
      commentUrdu: "Ahmed bohot acha barber hai. Hamesha perfect haircut karta hai.",
      date: "November 2024"
    },
    {
      id: 3,
      name: "Sana K.",
      rating: 4,
      service: "Hair Coloring",
      comment: "Sara did a beautiful balayage on my hair. The color is stunning and lasted well. Slight wait time but worth it.",
      commentUrdu: "Sara ne mere baalon ka bohot khoobsurat rang kiya. Thora intezar tha lekin result zabardast tha.",
      date: "September 2024"
    },
    {
      id: 4,
      name: "Fatima A.",
      rating: 5,
      service: "Moroccan Bath",
      comment: "The Moroccan bath experience was heavenly! My skin feels so soft and rejuvenated. Will definitely come back.",
      commentUrdu: "Moroccan bath ka tajurba bohot pyara tha! Jild bilkul naram aur taza ho gayi.",
      date: "August 2024"
    },
    {
      id: 5,
      name: "Hamza R.",
      rating: 5,
      service: "Beard Styling",
      comment: "Ahmed gave me the perfect beard shape for my wedding. Everyone complimented my look!",
      commentUrdu: "Ahmed ne mere nikah ke liye perfect darhi banai. Sab ne tareef ki!",
      date: "November 2024"
    },
    {
      id: 6,
      name: "Zara I.",
      rating: 5,
      service: "Party Makeup Package",
      comment: "Got the party package before my cousin's wedding. Makeup was flawless and lasted all night!",
      commentUrdu: "Party package liya tha apni cousin ki shaadi se pehle. Makeup puri raat perfect raha!",
      date: "October 2024"
    },
    {
      id: 7,
      name: "Rehman S.",
      rating: 4,
      service: "Facial Treatment",
      comment: "Good facial treatment. Relaxing and my skin looks fresher. Prices are reasonable too.",
      commentUrdu: "Acha facial tha. Aram dene wala aur jild taza lagti hai. Qeemat bhi munasib hai.",
      date: "September 2024"
    },
    {
      id: 8,
      name: "Mahnoor B.",
      rating: 5,
      service: "Keratin Treatment",
      comment: "Best investment! My frizzy hair is now smooth and manageable. Sara really knows her stuff.",
      commentUrdu: "Bohot acha faisla tha! Mere beshakal baal ab bilkul seedhe aur sambhalne wale hain.",
      date: "July 2024"
    }
  ],

  faq: [
    {
      id: 1,
      question: "Do you accept walk-in customers?",
      questionUrdu: "Kya aap bina booking ke customers lete hain?",
      answer: "Yes, we welcome walk-ins subject to availability. However, we recommend booking in advance, especially for weekends and specialist services.",
      answerUrdu: "Jee haan, agar jagah khali ho to bina booking bhi aa sakte hain. Lekin weekend aur special services ke liye pehle se booking behtar hai."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      questionUrdu: "Aap kaunse payment methods lete hain?",
      answer: "We accept cash, credit/debit cards, JazzCash, Easypaisa, and bank transfers.",
      answerUrdu: "Hum cash, card, JazzCash, Easypaisa aur bank transfer sab lete hain."
    },
    {
      id: 3,
      question: "How far in advance should I book for bridal services?",
      questionUrdu: "Dulhan ki services ke liye kitne din pehle booking karni chahiye?",
      answer: "We recommend booking bridal services at least 2 weeks in advance. This allows time for a trial session and ensures your preferred date is available.",
      answerUrdu: "Dulhan ki services ke liye kam se kam 2 hafte pehle booking karna zaroori hai. Isse trial ka waqt mil jata hai aur aapki pasand ki date bhi mil jati hai."
    },
    {
      id: 4,
      question: "Are your products halal certified?",
      questionUrdu: "Kya aapke products halal certified hain?",
      answer: "Yes, all our products are halal certified and alcohol-free. We only use premium, authentic brands.",
      answerUrdu: "Jee haan, hamare tamam products halal certified aur alcohol-free hain. Hum sirf premium aur asli brands istemal karte hain."
    },
    {
      id: 5,
      question: "What is your cancellation policy?",
      questionUrdu: "Aapki cancellation policy kya hai?",
      answer: "Please cancel at least 2 hours before your appointment to avoid charges. No-shows may be charged 50% of the service fee.",
      answerUrdu: "Appointment se kam se kam 2 ghante pehle cancel karein. Agar aap aaye nahi to 50% charge lag sakta hai."
    },
    {
      id: 6,
      question: "Do you offer home service?",
      questionUrdu: "Kya aap ghar pe service dete hain?",
      answer: "Yes, we offer home services for bridal makeup, party makeup, and mehndi. Additional charges apply based on location. Contact us for details.",
      answerUrdu: "Jee haan, hum dulhan makeup, party makeup aur mehndi ke liye ghar pe service dete hain. Location ke hisaab se extra charges lagte hain."
    },
    {
      id: 7,
      question: "Are there separate sections for men and women?",
      questionUrdu: "Kya mard aur aurat ke liye alag sections hain?",
      answer: "Yes, we have separate sections for men and women with dedicated staff for each section.",
      answerUrdu: "Jee haan, mard aur aurat dono ke liye alag sections hain aur alag staff bhi hai."
    },
    {
      id: 8,
      question: "Can I bring my own products?",
      questionUrdu: "Kya main apne products la sakta hoon?",
      answer: "Yes, you can bring your own products, especially for allergies or specific preferences. Please inform us in advance.",
      answerUrdu: "Jee haan, aap apne products la sakte hain, khaas kar agar allergy ho ya koi khas pasand ho. Pehle se bata dein."
    },
    {
      id: 9,
      question: "How long does hair coloring last?",
      questionUrdu: "Hair coloring kitne din chalti hai?",
      answer: "Permanent color lasts until your hair grows out. Touch-ups are usually needed every 4-6 weeks for roots. Semi-permanent colors last 4-6 weeks.",
      answerUrdu: "Permanent color jab tak baal barhte hain tab tak chalti hai. Roots ke liye har 4-6 hafte mein touch-up chahiye. Semi-permanent 4-6 hafte chalti hai."
    },
    {
      id: 10,
      question: "Do you have parking facilities?",
      questionUrdu: "Kya parking ki facility hai?",
      answer: "Street parking is available outside the salon. There's also a parking plaza nearby within 2 minutes walking distance.",
      answerUrdu: "Salon ke bahar sadak pe parking hai. Pas mein parking plaza bhi hai jo 2 minute ki walking distance pe hai."
    },
    {
      id: 11,
      question: "Can I get a trial for bridal makeup?",
      questionUrdu: "Kya dulhan makeup ka trial mil sakta hai?",
      answer: "Yes, bridal packages include one trial session. Additional trials can be booked for 3000 PKR each.",
      answerUrdu: "Jee haan, dulhan package mein ek trial shamil hai. Extra trial 3000 rupay mein mil sakti hai."
    },
    {
      id: 12,
      question: "What should I do to prepare for a facial?",
      questionUrdu: "Facial ke liye kya tayyari karni chahiye?",
      answer: "Come with clean skin, no makeup. Avoid sun exposure and harsh products 24 hours before. Inform us of any allergies or skin conditions.",
      answerUrdu: "Saaf chehre ke sath aayein, makeup na lagayein. Facial se 24 ghante pehle dhoop aur sakht products se bachein. Agar koi allergy ya skin problem ho to batayein."
    },
    {
      id: 13,
      question: "How often should I get a hair spa?",
      questionUrdu: "Hair spa kitne din baad karwani chahiye?",
      answer: "For best results, we recommend a hair spa every 3-4 weeks, especially if you have dry, damaged, or colored hair.",
      answerUrdu: "Behtar results ke liye har 3-4 hafte mein hair spa karwayein, khaas kar agar baal khushk, kharab ya rang kiye hon."
    },
    {
      id: 14,
      question: "Do you offer student discounts?",
      questionUrdu: "Kya students ke liye discount hai?",
      answer: "Yes! Students get 15% off on all services (except packages) from Tuesday to Thursday. Valid student ID required.",
      answerUrdu: "Jee haan! Students ko Mangal se Jumerat tak tamam services pe 15% discount milta hai (packages ke ilawa). Valid student ID zaroori hai."
    },
    {
      id: 15,
      question: "Can men get facials?",
      questionUrdu: "Kya mard facial karwa sakte hain?",
      answer: "Absolutely! We offer specialized facials for men including deep cleansing, anti-aging, and acne treatment facials.",
      answerUrdu: "Bilkul! Hum mardon ke liye khaas facial dete hain jismein deep cleansing, anti-aging aur acne treatment shamil hai."
    }
  ],

  seasonalOffers: [
    {
      id: 1,
      name: "Wedding Season Special",
      nameUrdu: "Shaadi Season Special",
      period: "November - February",
      discount: "25% off on all bridal packages",
      discountUrdu: "Tamam dulhan packages pe 25% discount",
      terms: "Book 3 weeks in advance to avail this offer"
    },
    {
      id: 2,
      name: "Summer Refresh",
      nameUrdu: "Garmi Ka Special",
      period: "May - August",
      discount: "20% off on hair spa and facials",
      discountUrdu: "Hair spa aur facial pe 20% discount",
      terms: "Beat the heat with our cooling treatments"
    },
    {
      id: 3,
      name: "Back to School",
      nameUrdu: "School Wapis Special",
      period: "August - September",
      discount: "30% off for students on haircuts",
      discountUrdu: "Students ke liye haircut pe 30% discount",
      terms: "Valid student ID required"
    },
    {
      id: 4,
      name: "Festive Glow",
      nameUrdu: "Eid Special",
      period: "Before Eid",
      discount: "Buy 1 Get 1 on threading and waxing",
      discountUrdu: "Threading aur waxing pe buy 1 get 1",
      terms: "Valid 2 weeks before Eid"
    }
  ],

  specialServices: {
    homeService: {
      available: true,
      services: ["Bridal Makeup", "Party Makeup", "Mehndi", "Hair Styling"],
      servicesUrdu: ["Dulhan Makeup", "Party Makeup", "Mehndi", "Hair Styling"],
      areas: ["DHA", "Clifton", "Gulshan", "North Nazimabad", "Saddar"],
      minimumCharges: 5000,
      transportCharges: "500-2000 PKR depending on location",
      note: "Book 48 hours in advance for home services",
      noteUrdu: "Ghar ki service ke liye 48 ghante pehle booking karein"
    },
    corporatePackages: {
      available: true,
      description: "Special packages for corporate events and office teams",
      descriptionUrdu: "Office teams aur corporate events ke liye khaas packages",
      minimumPeople: 5,
      discount: "25% off on group bookings of 5 or more",
      services: ["Team bonding spa day", "Office party makeup sessions", "Grooming workshops"],
      contact: "Email us at corporate@glamsalon.pk for customized packages"
    },
    consultations: {
      available: true,
      types: [
        {
          name: "Hair Consultation",
          nameUrdu: "Baalon Ka Mashwara",
          price: "Free",
          duration: "15 minutes",
          includes: ["Hair analysis", "Style recommendations", "Product suggestions"]
        },
        {
          name: "Skin Consultation",
          nameUrdu: "Jild Ka Mashwara",
          price: "Free",
          duration: "15 minutes",
          includes: ["Skin type analysis", "Treatment recommendations", "Skincare routine advice"]
        },
        {
          name: "Bridal Consultation",
          nameUrdu: "Dulhan Consultation",
          price: "Free",
          duration: "30 minutes",
          includes: ["Bridal look discussion", "Package details", "Timeline planning"]
        }
      ]
    }
  },

  membership: {
    types: [
      {
        id: 1,
        name: "Silver Membership",
        nameUrdu: "Silver Membership",
        price: 5000,
        validity: "3 months",
        benefits: [
          "10% discount on all services",
          "1 free haircut per month",
          "Priority booking",
          "Birthday month special gift"
        ],
        benefitsUrdu: [
          "Tamam services pe 10% discount",
          "Har mahine 1 free haircut",
          "Priority booking",
          "Janam din ke mahine mein special gift"
        ]
      },
      {
        id: 2,
        name: "Gold Membership",
        nameUrdu: "Gold Membership",
        price: 12000,
        validity: "6 months",
        benefits: [
          "15% discount on all services",
          "2 free services per month (haircut, facial, or threading)",
          "Priority booking",
          "1 free hair spa treatment",
          "Birthday month 25% off",
          "Complimentary head massage with every visit"
        ],
        benefitsUrdu: [
          "Tamam services pe 15% discount",
          "Har mahine 2 free services",
          "Priority booking",
          "1 free hair spa",
          "Janam din ke mahine mein 25% discount",
          "Har baar free head massage"
        ]
      },
      {
        id: 3,
        name: "Platinum Membership",
        nameUrdu: "Platinum Membership",
        price: 20000,
        validity: "1 year",
        benefits: [
          "20% discount on all services",
          "Unlimited basic services (haircut, threading)",
          "Priority booking with dedicated stylist",
          "2 free premium treatments (facial, hair spa, or waxing)",
          "1 free party makeup or 30% off bridal package",
          "Birthday month 30% off",
          "Free home service once per year",
          "Exclusive access to new services"
        ],
        benefitsUrdu: [
          "Tamam services pe 20% discount",
          "Unlimited basic services",
          "Dedicated stylist ke sath priority booking",
          "2 free premium treatments",
          "1 free party makeup ya bridal package pe 30% discount",
          "Janam din mein 30% discount",
          "Saal mein 1 baar free home service",
          "Nayi services ka pehle access"
        ]
      }
    ],
    note: "Memberships are non-transferable and non-refundable",
    noteUrdu: "Membership kisi aur ko transfer nahi ho sakti aur refund nahi hoti"
  },

  aboutUs: {
    story: "Glam Beauty Salon was founded in 2018 by Ayesha Mahmood with a vision to provide world-class beauty services in Karachi. Starting with just 2 stylists, we've grown into a full-service salon with 6 expert professionals. We pride ourselves on using only premium, halal-certified products and maintaining the highest hygiene standards. Our team regularly trains with international beauty experts to bring the latest techniques to our clients.",
    storyUrdu: "Glam Beauty Salon ki buniyad 2018 mein Ayesha Mahmood ne rakhi thi. Unka khwaab tha ke Karachi mein duniya ki behtar beauty services dein. Shuru mein sirf 2 stylists the, ab hum 6 expert professionals ke sath complete salon ban gaye hain. Hum sirf premium, halal products istemal karte hain aur safai ka khaas khayal rakhte hain.",
    
    mission: "To make every client feel beautiful, confident, and special with personalized beauty services in a hygienic and welcoming environment.",
    missionUrdu: "Har client ko khubsurat, confident aur khaas mehsoos karwana, saaf aur dost-ana mahol mein.",
    
    values: [
      "Customer satisfaction first",
      "Quality over quantity",
      "Hygiene and safety",
      "Continuous learning and improvement",
      "Respect and professionalism"
    ],
    valuesUrdu: [
      "Customer ki khushi pehle",
      "Quality ko quantity se zyada ehemiyat",
      "Safai aur salamati",
      "Hamesha seekhna aur behtar hona",
      "Ehteram aur professional behaviour"
    ],
    
    team: "Our team consists of certified professionals with years of experience in the beauty industry. We believe in ongoing training and stay updated with the latest beauty trends and techniques from around the world.",
    teamUrdu: "Hamari team certified professionals par mushtamil hai jinhein beauty industry mein saalon ka tajurba hai. Hum regular training karte hain aur duniya bhar se nayi techniques seekhte rehte hain."
  },

  contactInfo: {
    phone: "+92-321-1234567",
    whatsapp: "+92-321-1234567",
    email: "info@glamsalon.pk",
    bookingEmail: "booking@glamsalon.pk",
    corporateEmail: "corporate@glamsalon.pk",
    complaintsEmail: "feedback@glamsalon.pk",
    website: "www.glamsalon.pk",
    socialMedia: {
      facebook: "facebook.com/glamsalon.pk",
      instagram: "@glamsalon.pk",
      tiktok: "@glamsalon.official",
      youtube: "Glam Beauty Salon Karachi",
      pinterest: "pinterest.com/glamsalon"
    },
    responseTime: "We typically respond within 2-4 hours during business hours",
    responseTimeUrdu: "Hum business hours mein 2-4 ghante mein jawab dete hain"
  },

  careerOpportunities: {
    hiring: true,
    positions: [
      {
        title: "Junior Hair Stylist",
        titleUrdu: "Junior Hair Stylist",
        requirements: ["1-2 years experience", "Basic certification", "Good communication skills"],
        requirementsUrdu: ["1-2 saal ka tajurba", "Basic certificate", "Achhi communication skills"]
      },
      {
        title: "Makeup Artist",
        titleUrdu: "Makeup Artist",
        requirements: ["2-3 years experience", "Portfolio required", "Bridal makeup expertise preferred"],
        requirementsUrdu: ["2-3 saal ka tajurba", "Portfolio zaroori", "Dulhan makeup ka tajurba behtar"]
      },
      {
        title: "Receptionist",
        titleUrdu: "Receptionist",
        requirements: ["Fluent in English and Urdu", "Computer skills", "Customer service experience"],
        requirementsUrdu: ["English aur Urdu mein rawaan", "Computer skills", "Customer service ka tajurba"]
      }
    ],
    howToApply: "Send your CV and portfolio to careers@glamsalon.pk",
    howToApplyUrdu: "Apna CV aur portfolio careers@glamsalon.pk pe bhejein"
  }
};

export default SALON_KNOWLEDGE_BASE;

