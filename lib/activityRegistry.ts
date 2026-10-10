/**
 * Centralized Activity Registry
 * Authoritative source of truth for all active workshops, descriptions, verified Acuity destinations,
 * pricing, and location routing.
 */

export type ActivityDestination = {
  city: "chicago" | "eugene" | "online";
  appointmentTypeId: number;
  calendarIds: number[];
  bookingUrl: string;
  priceUnit?: string;
  verifiedTitle?: string;
};

export type ActivityDetail = {
  slug: string;
  title: string;
  navLabel: string;
  heroTitle: string;
  heroDescription: string;
  shortDescription: string;
  category: "mud-room" | "glass-room" | "roots-room" | "crush-create" | "paper-pigment" | "romance-room" | "family" | "special";
  categoryLabel: string;
  categoryIcon: string;
  categoryColorClass: string;
  overlayClass: string;
  isPottery: boolean;
  coversTwo: boolean;
  coversNote?: string;
  duration: string;
  ticketUnit: string;
  beginnerFriendly: boolean;
  adultThemed?: boolean;
  ageRestriction?: string | null;
  locationsOffered: "Chicago & Eugene" | "Chicago only" | "Eugene only" | "Live online";
  image: {
    path: string;
    alt: string;
    width: number;
    height: number;
    focalPosition?: string;
    filename?: string;
    driveFileId?: string;
  };
  whatYouMake: string;
  theExperience: { title: string; body: string }[];
  included: string[];
  practicalInfo: { label: string; text: string }[];
  faqs: { q: string; a: string }[];
  tags: string[];
  valueCards: { label: string; title: string; body: string }[];
  scheduleRows?: { time: string; note?: string; href?: string }[];
  destinations: {
    chicago?: ActivityDestination;
    eugene?: ActivityDestination;
    online?: ActivityDestination;
  };
};

export const ACTIVITY_REGISTRY: Record<string, ActivityDetail> = {
  "cauldron-pottery": {
    "slug": "cauldron-pottery",
    "title": "Cauldron Pottery",
    "navLabel": "Cauldron Pottery",
    "heroTitle": "Cauldron Pottery",
    "heroDescription": "Make your own clay cauldron in a guided, beginner-friendly workshop.",
    "shortDescription": "Make your own clay cauldron in a guided, beginner-friendly workshop.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per ticket",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Spin A Spell- Make your Own Clay Cauldron.webp",
      "driveFileId": "1TQ1ahWNZted7uwQrvDmiM8IcFZmk2QuD",
      "path": "/images/classes/approved-40-mk2QuD-49bec5c931b2.webp",
      "width": 1200,
      "height": 900,
      "alt": "A black clay cauldron with small handles",
      "focalPosition": "50% 58%"
    },
    "whatYouMake": "Cauldron Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating cauldron pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Cauldron Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 95588506,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95588506",
        "priceUnit": "per ticket",
        "verifiedTitle": "Spin A Spell- Make your Own Clay Cauldron"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 96657402,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96657402",
        "priceUnit": "per ticket",
        "verifiedTitle": "Spin A Spell- Make your Own Clay Cauldron"
      }
    }
  },
  "date-night-wheel": {
    "slug": "date-night-wheel",
    "title": "Date Night on the Wheel",
    "navLabel": "Date Night",
    "heroTitle": "Date Night on the Wheel",
    "heroDescription": "Two people, one wheel, and a hilariously fun learning curve. Guided step-by-step. Leave with real memories (and maybe a lopsided masterpiece).",
    "shortDescription": "Share one wheel, make two pieces together.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": true,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Chicago Date Night Pottery.webp",
      "driveFileId": "194clPBzrJEB4A7mrJkYSNlPfzmGo6xn9",
      "path": "/images/classes/approved-07-Go6xn9-08daf172fdf1.webp",
      "width": 680,
      "height": 510,
      "alt": "A couple working together on clay at a pottery wheel",
      "focalPosition": "48% 55%"
    },
    "whatYouMake": "Date Night on the Wheel",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating date night on the wheel. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do we need experience?",
        "a": "Nope. We teach from zero and keep it fun."
      },
      {
        "q": "Do we keep what we make?",
        "a": "Your ticket covers instruction, clay, and tools. Optional bisque firing is $10/piece and glazing is available from $20/piece (approx. three-week turnaround)."
      },
      {
        "q": "What should we wear?",
        "a": "Something comfy you don't mind getting a little clay on."
      },
      {
        "q": "Is this good for a first date?",
        "a": "Yes — the clay does the icebreaking for you."
      },
      {
        "q": "Can we book with friends?",
        "a": "Yes — couples' groups are a favorite."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Romantic",
      "Giftable",
      "Great photos",
      "Guided"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Playful + premium",
        "body": "Glassy vibes, warm lighting, real craft."
      },
      {
        "label": "RESULT",
        "title": "Take-home options",
        "body": "Same-day decorative, or optional bisque firing ($10) & glazing (from $20) ready in about 3 weeks."
      },
      {
        "label": "VIBE",
        "title": "Instant chemistry",
        "body": "Clay is teamwork training."
      }
    ],
    "scheduleRows": [
      {
        "time": "Fri · 5:30–7:30 PM",
        "note": "Best for after-work"
      },
      {
        "time": "Sat · 7:30–9:30 PM",
        "note": "Peak date-night energy"
      },
      {
        "time": "Sun · 5:30–7:30 PM",
        "note": "Chill + romantic"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006071,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79006071",
        "priceUnit": "for two",
        "verifiedTitle": "Date Night on the Pottery Wheel - Chicago"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 91935746,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=91935746",
        "priceUnit": "for two",
        "verifiedTitle": "Eugene Date Night On The Wheel"
      }
    }
  },
  "beginner-wheel": {
    "slug": "beginner-wheel",
    "title": "Wheel Throwing for Beginners",
    "navLabel": "Beginner Wheel",
    "heroTitle": "Wheel Throwing for Beginners",
    "heroDescription": "Your first spin on the wheel. Learn centering, pulling, and shaping with hands-on coaching. You'll leave with new skills and a serious clay grin.",
    "shortDescription": "Try the pottery wheel and shape your first clay creation.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per ticket",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Wheel Throwing for Beginners - Chicago.webp",
      "driveFileId": "1rUWLJ1sUh8iFBVU5xwI0CCmlO5e58mRd",
      "path": "/images/classes/wheel-throwing-for-beginners-color-cocktail-factory-acuity-600x600.jpg",
      "width": 600,
      "height": 600,
      "alt": "Students shaping clay on pottery wheels during a beginner workshop",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Wheel Throwing for Beginners",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating wheel throwing for beginners. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need experience?",
        "a": "No. This is designed for first-timers."
      },
      {
        "q": "Do I keep my piece?",
        "a": "Your ticket covers all instruction, clay, and tools. Optional bisque firing is $10/piece and glazing is available from $20/piece (approx. three-week turnaround)."
      },
      {
        "q": "What will I learn?",
        "a": "Clay prep, centering, pulling, basic shaping."
      },
      {
        "q": "Is it messy?",
        "a": "Yes — the fun kind. Wear comfy clothes."
      },
      {
        "q": "Can I book with friends?",
        "a": "Absolutely."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Hands-on",
      "Skill-building",
      "Great gift"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Real technique",
        "body": "Centering + pulls, simplified."
      },
      {
        "label": "RESULT",
        "title": "First forms",
        "body": "Create your first bowl/cylinder attempts."
      },
      {
        "label": "VIBE",
        "title": "Supportive",
        "body": "Friendly coaching, zero judgment."
      }
    ],
    "scheduleRows": [
      {
        "time": "Sat · 2:30 PM",
        "note": "Strongest slot"
      },
      {
        "time": "Wed · 5:30 PM",
        "note": "Midweek favorite"
      },
      {
        "time": "Fri · 7:30 PM",
        "note": "Weekend energy"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79006616",
        "priceUnit": "per ticket",
        "verifiedTitle": "Wheel Throwing for Beginners - Chicago"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 93539343,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=93539343",
        "priceUnit": "per ticket",
        "verifiedTitle": "Eugene Wheel Throwing for Beginners: Cup creations"
      }
    }
  },
  "cup-creations": {
    "slug": "cup-creations",
    "title": "Cup Creations on the Wheel",
    "navLabel": "Cup Creations",
    "heroTitle": "Cup Creations on the Wheel",
    "heroDescription": "Master the pottery wheel while shaping your own custom drinking cup. Guided step-by-step from centering the clay to pulling the walls.",
    "shortDescription": "Learn wheel throwing techniques while creating your own handmade ceramic cup.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per ticket",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Wheel Throwing for Beginners -Cup Creations.webp",
      "driveFileId": "1jqsoqPsiLbjt0OKDsiEHxlArlXZzjDrH",
      "path": "/images/classes/approved-46-ZzjDrH-20ed285cc994.webp",
      "width": 1200,
      "height": 900,
      "alt": "Handmade ceramic cups created on the pottery wheel",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Wheel-Thrown Ceramic Cup",
    "theExperience": [
      {
        "title": "Guided Step-by-Step Instruction",
        "body": "Our experienced ceramic artists walk you through centering your clay, opening the ball, and pulling upward to create functional drinking cups, mugs, and tumblers."
      },
      {
        "title": "Hands-On Wheel Time",
        "body": "Each participant gets a dedicated pottery wheel with hands-on coaching throughout the session. Focus on the craft and tactile fun of throwing clay."
      }
    ],
    "included": [
      "Dedicated pottery wheel workstation",
      "All non-toxic stoneware clay and shaping tools",
      "Step-by-step coaching from resident ceramic artists",
      "Full studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks and snacks. Must be 21+ for alcohol. Studio glassware available."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any wheel throwing experience?",
        "a": "No experience needed! This class is designed specifically for beginners."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes and trim your nails if possible. Clay washes out of clothing easily."
      },
      {
        "q": "How does firing and glazing work?",
        "a": "Your class ticket covers instruction, clay, and wheel use. Optional professional kiln firing ($10) and glazing (from $20) are available at the end of class with ~3-week pickup."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Wheel Throwing",
      "Pottery",
      "Cup Creations",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "TECHNIQUE",
        "title": "Centering & Pulling",
        "body": "Learn core pottery fundamentals that work."
      },
      {
        "label": "MAKING",
        "title": "Functional Art",
        "body": "Shape a cup you can use every day."
      },
      {
        "label": "VIBE",
        "title": "Relaxed & Social",
        "body": "BYOB drinks and supportive artist instruction."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 94782668,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94782668",
        "priceUnit": "per ticket",
        "verifiedTitle": "Wheel Throwing for Beginners -Cup Creations"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 93539343,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=93539343",
        "priceUnit": "per ticket",
        "verifiedTitle": "Eugene Wheel Throwing for Beginners: Cup creations"
      }
    }
  },
  "turkish-lamp": {
    "slug": "turkish-lamp",
    "title": "Turkish Lamp Mosaic",
    "navLabel": "Turkish Lamps",
    "heroTitle": "Turkish Lamp Mosaic",
    "heroDescription": "Build a lamp that looks like it belongs in a movie scene. Bright glass pieces, warm light, and the most satisfying final reveal.",
    "shortDescription": "Piece together colorful glass to make your own mosaic lamp.",
    "category": "glass-room",
    "categoryLabel": "Glass Room",
    "categoryIcon": "✨",
    "categoryColorClass": "category-glass",
    "overlayClass": "gradient-overlay-glass",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Turkish Mosaic Lamp - Chicago.webp",
      "driveFileId": "1WFd8fUpeTML-DZSu8gQ4-ViDpW9vzaFl",
      "path": "/images/classes/approved-42-9vzaFl-cda788618ed1.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests with colorful mosaic lamps",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Turkish Lamp Mosaic",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating turkish lamp mosaic. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do we finish the lamp in one session?",
        "a": "Yes — most guests complete it in class."
      },
      {
        "q": "Is it fragile?",
        "a": "Treat it like a lamp — glass pieces are durable when set."
      },
      {
        "q": "Is this good for dates?",
        "a": "Extremely. It's romantic and visually stunning."
      },
      {
        "q": "Can I customize colors?",
        "a": "Yes — choose your palette as you build."
      },
      {
        "q": "Is it beginner friendly?",
        "a": "Totally — we guide every step."
      }
    ],
    "tags": [
      "Iconic",
      "Premium",
      "Best gift",
      "Group-friendly",
      "Wow factor"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Cinematic glow",
        "body": "Warm light + jewel colors."
      },
      {
        "label": "RESULT",
        "title": "A real lamp",
        "body": "Functional take-home piece."
      },
      {
        "label": "VIBE",
        "title": "Instant wow",
        "body": "Everyone gasps at the reveal."
      }
    ],
    "scheduleRows": [
      {
        "time": "Fri · 6:30–8:30 PM",
        "note": "Best night glow"
      },
      {
        "time": "Sat · 2:00–4:00 PM",
        "note": "Prime weekend"
      },
      {
        "time": "Sun · 2:00–4:00 PM",
        "note": "Easy daytime"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 95416771,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95416771",
        "priceUnit": "per person",
        "verifiedTitle": "Turkish Mosaic Lamp - Chicago"
      }
    }
  },
  "mug-and-bowl": {
    "slug": "mug-and-bowl",
    "title": "Ceramic Mug and a Bowl",
    "navLabel": "Ceramic Mug and a Bowl",
    "heroTitle": "Ceramic Mug and a Bowl",
    "heroDescription": "Handbuild a mug and bowl with your own finishing touches.",
    "shortDescription": "Handbuild a mug and bowl with your own finishing touches.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Ceramic Mug and a Bowl - Chicago.webp",
      "driveFileId": "1WtKmP1ivyyj2SBnF1N1FlXOfKB9-c5wW",
      "path": "/images/classes/approved-05-9-c5wW-833640afcace.webp",
      "width": 1084,
      "height": 813,
      "alt": "A participant handbuilding pottery at a clay-covered studio table",
      "focalPosition": "60% 50%"
    },
    "whatYouMake": "Ceramic Mug and a Bowl",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating ceramic mug and a bowl. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Ceramic Mug and a Bowl",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79186725,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79186725",
        "priceUnit": "per person",
        "verifiedTitle": "Ceramic Mug and a Bowl - Chicago"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 90210750,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=90210750",
        "priceUnit": "per person",
        "verifiedTitle": "Eugene: Ceramic Mug and a Bowl"
      }
    }
  },
  "terrarium": {
    "slug": "terrarium",
    "title": "Terrarium Class",
    "navLabel": "Terrarium",
    "heroTitle": "Terrarium Class",
    "heroDescription": "Build a tiny ecosystem in glass. Layer, plant, decorate — and walk out with a living centerpiece.",
    "shortDescription": "Build a little living garden with plants, moss, and decorative details.",
    "category": "roots-room",
    "categoryLabel": "Roots Room",
    "categoryIcon": "🌱",
    "categoryColorClass": "category-roots",
    "overlayClass": "gradient-overlay-roots",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Eugene 🌿 Date Night Terrarium Workshop.webp",
      "driveFileId": "1-TTFdz3-dOIFw7_KSVjMP6mfxSbe3SrC",
      "path": "/images/classes/approved-16-be3SrC-424e14c07efd.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two guests arranging plants in terrarium containers",
      "focalPosition": "48% 50%"
    },
    "whatYouMake": "Terrarium Class",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating terrarium class. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need a green thumb?",
        "a": "No — we choose hardy plants and teach basics."
      },
      {
        "q": "How long does it last?",
        "a": "With simple care, a long time."
      },
      {
        "q": "Is it messy?",
        "a": "A little soil, but very manageable."
      },
      {
        "q": "Can kids join?",
        "a": "Many sessions are kid-friendly; check the listing."
      },
      {
        "q": "Is it good for dates?",
        "a": "Yes — it's cute and collaborative."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Nature",
      "Giftable",
      "Home dÃ©cor"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Mini landscape",
        "body": "Design a little world."
      },
      {
        "label": "RESULT",
        "title": "Living centerpiece",
        "body": "Take it home same day."
      },
      {
        "label": "VIBE",
        "title": "Low-stress",
        "body": "Soothing and social."
      }
    ],
    "scheduleRows": [
      {
        "time": "Sat · 1:00 PM",
        "note": "Weekly"
      },
      {
        "time": "Sun · 1:00 PM",
        "note": "Weekly"
      },
      {
        "time": "Weekday · 12:30 PM",
        "note": "Monthly rotating"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79189013,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79189013",
        "priceUnit": "per person",
        "verifiedTitle": "Terrarium Workshop - Chicago"
      }
    }
  },
  "date-night-terrarium": {
    "slug": "date-night-terrarium",
    "title": "Date Night Terrarium",
    "navLabel": "Date Night Terrarium",
    "heroTitle": "Date Night Terrarium",
    "heroDescription": "Build miniature living gardens together in a guided workshop.",
    "shortDescription": "Build miniature living gardens together in a guided workshop.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": false,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Eugene only",
    "image": {
      "filename": "Eugene 🌿 Date Night Terrarium Workshop.webp",
      "driveFileId": "1-TTFdz3-dOIFw7_KSVjMP6mfxSbe3SrC",
      "path": "/images/classes/approved-16-be3SrC-424e14c07efd.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two guests arranging plants in terrarium containers",
      "focalPosition": "48% 50%"
    },
    "whatYouMake": "Date Night Terrarium",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating date night terrarium. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 3295 Cross Street, Eugene, OR 97402."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Date Night Terrarium",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 89290193,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=89290193",
        "priceUnit": "for two",
        "verifiedTitle": "Eugene 🌿 Date Night Terrarium Workshop"
      }
    }
  },
  "mosaic": {
    "slug": "mosaic",
    "title": "Beginner Mosaic Class",
    "navLabel": "Mosaics",
    "heroTitle": "Beginner Mosaic Class",
    "heroDescription": "Turn colorful pieces into a finished artwork you'll actually want to display. High satisfaction, low stress — and wildly giftable.",
    "shortDescription": "Arrange colorful pieces into a mosaic of your own design.",
    "category": "glass-room",
    "categoryLabel": "Glass Room",
    "categoryIcon": "✨",
    "categoryColorClass": "category-glass",
    "overlayClass": "gradient-overlay-glass",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Mosaic Creations - Chicago.webp",
      "driveFileId": "1Ie2yRdR3PyUJq5UYwFI9adlehgrW3n0V",
      "path": "/images/classes/approved-32-rW3n0V-cadbf04e7dff.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two guests showing their colorful mosaic creations",
      "focalPosition": "50% 45%"
    },
    "whatYouMake": "Beginner Mosaic Class",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating beginner mosaic class. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Is it messy?",
        "a": "A little — but in a satisfying way. Aprons help."
      },
      {
        "q": "Do I need design skills?",
        "a": "No. We'll guide composition and patterns."
      },
      {
        "q": "Can kids join?",
        "a": "Some sessions are kid-friendly; check the listing."
      },
      {
        "q": "How long does it take?",
        "a": "Usually 1.5'“2 hours depending on the project."
      },
      {
        "q": "Can groups sit together?",
        "a": "Yes — mosaics are perfect for groups."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Relaxing",
      "Group-friendly",
      "Take-home art"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Bold color",
        "body": "Piece-by-piece composition that pops."
      },
      {
        "label": "RESULT",
        "title": "Finished artwork",
        "body": "Leave with something you can show off."
      },
      {
        "label": "VIBE",
        "title": "Social flow",
        "body": "Easy to chat while you build."
      }
    ],
    "scheduleRows": [
      {
        "time": "Wed · 6:00–8:00 PM",
        "note": "Midweek reset"
      },
      {
        "time": "Sat · 3:30–5:30 PM",
        "note": "Best for groups"
      },
      {
        "time": "Sun · 12:30–2:30 PM",
        "note": "Easy daytime"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79182319,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79182319",
        "priceUnit": "per person",
        "verifiedTitle": "Mosaic Creations - Chicago"
      }
    }
  },
  "candle-making": {
    "slug": "candle-making",
    "title": "Organic Candle Making",
    "navLabel": "Candle",
    "heroTitle": "Organic Candle Making",
    "heroDescription": "Blend scents, pour wax, and leave with a candle that smells like '˜I have my life together' (even if you don't).",
    "shortDescription": "Create and pour your own candle in a guided studio session.",
    "category": "crush-create",
    "categoryLabel": "Crush & Create",
    "categoryIcon": "🕯️",
    "categoryColorClass": "category-crush",
    "overlayClass": "gradient-overlay-crush",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Candle Making - Chicago.webp",
      "driveFileId": "1ItqqGer2N5dAJOOwWlhejDm0Ew3xOd0G",
      "path": "/images/classes/approved-03-3xOd0G-3b868ddea3a9.webp",
      "width": 1200,
      "height": 900,
      "alt": "A candle-making instructor helping guests at a studio worktable",
      "focalPosition": "48% 45%"
    },
    "whatYouMake": "Organic Candle Making",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating organic candle making. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I take it home same day?",
        "a": "Yes — after a short set time."
      },
      {
        "q": "Are scents strong?",
        "a": "You control the strength."
      },
      {
        "q": "Is it beginner friendly?",
        "a": "Totally — we guide each step."
      },
      {
        "q": "Can couples join?",
        "a": "Yes — it's a great date."
      },
      {
        "q": "Is this good for groups?",
        "a": "Very — easy, fun, and everyone leaves happy."
      }
    ],
    "tags": [
      "Cozy",
      "Giftable",
      "Beginner-friendly",
      "Take-home"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Scent design",
        "body": "Build your own blend."
      },
      {
        "label": "RESULT",
        "title": "Take-home candle",
        "body": "Leave with a real product."
      },
      {
        "label": "VIBE",
        "title": "Warm + social",
        "body": "Perfect winter class."
      }
    ],
    "scheduleRows": [
      {
        "time": "Sat · 6:00 PM",
        "note": "Weekly favorite"
      },
      {
        "time": "Fri · 6:00 PM",
        "note": "After-work cozy"
      },
      {
        "time": "Sun · 4:30 PM",
        "note": "Easy evening"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79185767,
        "calendarIds": [
          12216179,
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79185767",
        "priceUnit": "per person",
        "verifiedTitle": "Candle Making - Chicago"
      }
    }
  },
  "vip-date-night-painting": {
    "slug": "vip-date-night-painting",
    "title": "VIP Date Night Painting",
    "navLabel": "VIP Date Night Painting",
    "heroTitle": "VIP Date Night Painting",
    "heroDescription": "Create a painting together with personal guidance from a studio artist.",
    "shortDescription": "Create a painting together with personal guidance from a studio artist.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": false,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "vip-date-night-painting.png",
      "driveFileId": "",
      "path": "/images/classes/vip-date-night-painting.png",
      "width": 1448,
      "height": 1086,
      "alt": "Two guests painting winter birds on snowy branches at studio easels",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "VIP Date Night Painting",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating vip date night painting. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "VIP Date Night Painting",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 97020385,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97020385",
        "priceUnit": "for two",
        "verifiedTitle": "VIP DATE NIGHT PAINT NIGHT"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 94058109,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94058109",
        "priceUnit": "for two",
        "verifiedTitle": "VIP Date Night Paint Night"
      }
    }
  },
  "cat-vase": {
    "slug": "cat-vase",
    "title": "Cat Vase Making",
    "navLabel": "Cat Vase Making",
    "heroTitle": "Cat Vase Making",
    "heroDescription": "Sculpt a clay vase with a cat-inspired face and ears.",
    "shortDescription": "Sculpt a clay vase with a cat-inspired face and ears.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Cat Vase Making - Chicago.webp",
      "driveFileId": "1nmmfhUOfn-Xg7N37pWpo1coU7Nbvze7K",
      "path": "/images/classes/approved-04-bvze7K-ec006f49f9b6.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two guests showing their handbuilt cat vases",
      "focalPosition": "50% 40%"
    },
    "whatYouMake": "Cat Vase Making",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating cat vase making. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Cat Vase Making",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79181599,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79181599",
        "priceUnit": "per person",
        "verifiedTitle": "Cat Vase Making - Chicago"
      }
    }
  },
  "clay-pumpkin": {
    "slug": "clay-pumpkin",
    "title": "Clay Pumpkin Lantern",
    "navLabel": "Clay Pumpkin Lantern",
    "heroTitle": "Clay Pumpkin Lantern",
    "heroDescription": "Handbuild and carve a clay pumpkin lantern with your own expression.",
    "shortDescription": "Handbuild and carve a clay pumpkin lantern with your own expression.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Halloween Pottery: Carve Your Own Clay Pumpkin.webp",
      "driveFileId": "10AJ_Mn1-NZrWPUDPixT_VsunIflimpFo",
      "path": "/images/classes/approved-26-limpFo-fc92c5a6a49d.webp",
      "width": 1084,
      "height": 813,
      "alt": "A participant carving a face into a clay pumpkin",
      "focalPosition": "55% 53%"
    },
    "whatYouMake": "Clay Pumpkin Lantern",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating clay pumpkin lantern. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Clay Pumpkin Lantern",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 96889121,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96889121",
        "priceUnit": "per person",
        "verifiedTitle": "Halloween Pottery: Carve Your Own Clay Pumpkin"
      }
    }
  },
  "glass-fusion": {
    "slug": "glass-fusion",
    "title": "Glass Fusion",
    "navLabel": "Glass Fusion",
    "heroTitle": "Glass Fusion",
    "heroDescription": "Layer, compose, and create a piece that gets kiln-fired into glossy, luminous glass art. Super premium feel — no glass experience required.",
    "shortDescription": "Arrange colorful glass into your own fused-glass artwork.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": false,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "glass-fusion.png",
      "driveFileId": "acuity-79183146",
      "path": "/images/classes/glass-fusion.png",
      "width": 700,
      "height": 699,
      "alt": "Handmade fused glass artwork",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Glass Fusion",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating glass fusion. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do we fire it in class?",
        "a": "Glass pieces are fired in our specialized glass kiln after your session and are typically ready for pickup in about two weeks."
      },
      {
        "q": "Is it safe?",
        "a": "Yes — we handle kiln workflow and safety rules."
      },
      {
        "q": "What can I make?",
        "a": "Small plates, art panels, ornaments, and more."
      },
      {
        "q": "Can groups book?",
        "a": "Yes — it's great for celebrations."
      },
      {
        "q": "Do I need drawing skills?",
        "a": "No — composition is guided."
      }
    ],
    "tags": [
      "Premium",
      "Beginner-friendly",
      "Luminous",
      "Take-home art"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Modern shine",
        "body": "Glossy glass with depth."
      },
      {
        "label": "RESULT",
        "title": "Kiln-fused piece",
        "body": "We fire it for a pro finish."
      },
      {
        "label": "VIBE",
        "title": "High-end craft",
        "body": "Feels like a boutique studio."
      }
    ],
    "scheduleRows": [
      {
        "time": "Wed · 6:15–8:15 PM",
        "note": "Creative midweek"
      },
      {
        "time": "Fri · 6:15–8:15 PM",
        "note": "Friday treat"
      },
      {
        "time": "Sat · 6:15–8:15 PM",
        "note": "Best for friends"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79183146,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79183146",
        "priceUnit": "for two",
        "verifiedTitle": "Glass Fusion - Chicago"
      }
    }
  },
  "bonsai": {
    "slug": "bonsai",
    "title": "Bonsai Class",
    "navLabel": "Bonsai",
    "heroTitle": "Bonsai Class",
    "heroDescription": "Learn styling, pruning, wiring basics, and how to care for a living sculpture. Calm energy, high skill payoff.",
    "shortDescription": "Shape and plant a miniature tree in a guided bonsai workshop.",
    "category": "roots-room",
    "categoryLabel": "Roots Room",
    "categoryIcon": "🌱",
    "categoryColorClass": "category-roots",
    "overlayClass": "gradient-overlay-roots",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Bonsai Class",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating bonsai class. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I take a tree home?",
        "a": "Many sessions include a tree; check the listing."
      },
      {
        "q": "Is this beginner-friendly?",
        "a": "Yes — we start with basics and safety."
      },
      {
        "q": "Will my bonsai survive?",
        "a": "With care, yes — we teach maintenance."
      },
      {
        "q": "What tools do I need?",
        "a": "We provide tools in class."
      },
      {
        "q": "Is this a good gift?",
        "a": "Yes — it's meaningful and lasting."
      }
    ],
    "tags": [
      "Nature",
      "Mindful",
      "Hands-on",
      "Long-term hobby"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Living art",
        "body": "A sculpture that grows."
      },
      {
        "label": "RESULT",
        "title": "Real technique",
        "body": "Pruning + wiring fundamentals."
      },
      {
        "label": "VIBE",
        "title": "Peaceful focus",
        "body": "A reset for your brain."
      }
    ],
    "scheduleRows": [
      {
        "time": "Sat · 5:00–7:00 PM",
        "note": "Best weekend slot"
      },
      {
        "time": "Sun · 5:00–7:00 PM",
        "note": "Relaxed pace"
      },
      {
        "time": "Wed · 6:00–8:00 PM",
        "note": "Midweek zen"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79188910,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79188910",
        "priceUnit": "per person",
        "verifiedTitle": "Bonsai for Beginners: Hands-On Workshop - Chicago"
      }
    }
  },
  "date-night-on-fire": {
    "slug": "date-night-on-fire",
    "title": "Date Night on Fire",
    "navLabel": "Date Night on Fire",
    "heroTitle": "Date Night on Fire",
    "heroDescription": "Share a VIP pottery experience together at the wheel.",
    "shortDescription": "Share a VIP pottery experience together at the wheel.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": false,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Date Night On Fire - VIP EXPERIENCE.webp",
      "driveFileId": "1r7cdx8xM97TKHY7yrmIM4W3bRM0WVDdt",
      "path": "/images/classes/approved-10-0WVDdt-8552826d25e5.webp",
      "width": 1200,
      "height": 900,
      "alt": "Hands shaping a tall clay vessel on a pottery wheel",
      "focalPosition": "52% 65%"
    },
    "whatYouMake": "Date Night on Fire",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating date night on fire. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Date Night on Fire",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 95023345,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95023345",
        "priceUnit": "for two",
        "verifiedTitle": "Date Night On Fire - VIP EXPERIENCE"
      }
    }
  },
  "paint-pottery": {
    "slug": "paint-pottery",
    "title": "Paint Your Own Pottery",
    "navLabel": "Paint Your Own Pottery",
    "heroTitle": "Paint Your Own Pottery",
    "heroDescription": "Choose colors and paint your own ceramic piece.",
    "shortDescription": "Choose colors and paint your own ceramic piece.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Paint Pottery - Chicago.webp",
      "driveFileId": "1N4Smjtmki9ib-oTL2xL8ipQCL4hnfruv",
      "path": "/images/classes/approved-36-hnfruv-c1631ba91192.webp",
      "width": 816,
      "height": 612,
      "alt": "Pottery painting at the studio and examples of painted plates",
      "focalPosition": "50% 52%"
    },
    "whatYouMake": "Paint Your Own Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating paint your own pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Paint Your Own Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79183668,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79183668",
        "priceUnit": "per person",
        "verifiedTitle": "Paint Pottery - Chicago"
      }
    }
  },
  "wine-glass-painting": {
    "slug": "wine-glass-painting",
    "title": "Wine Glass Painting",
    "navLabel": "Wine Glass Painting",
    "heroTitle": "Wine Glass Painting",
    "heroDescription": "Paint a set that's uniquely yours. Stencils optional. Vibes mandatory.",
    "shortDescription": "Paint your own design on a wine glass.",
    "category": "glass-room",
    "categoryLabel": "Glass Room",
    "categoryIcon": "✨",
    "categoryColorClass": "category-glass",
    "overlayClass": "gradient-overlay-glass",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Wine Glass Painting - Chicago.webp",
      "driveFileId": "1GxySoZHJuUstkXWjY6Z8t2DE9hltrBKB",
      "path": "/images/classes/approved-49-ltrBKB-622409207453.webp",
      "width": 1200,
      "height": 900,
      "alt": "Colorfully painted wine glasses",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Wine Glass Painting",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating wine glass painting. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do we seal the paint?",
        "a": "We provide cure/bake instructions depending on paint."
      },
      {
        "q": "Can I do a theme?",
        "a": "Yes — holiday themes are popular."
      },
      {
        "q": "Is it okay if I can't draw?",
        "a": "Yes — stencils and simple patterns work."
      },
      {
        "q": "Can groups do matching sets?",
        "a": "Absolutely — perfect for parties."
      },
      {
        "q": "How long does it take?",
        "a": "Usually 1.5'“2 hours."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Group-friendly",
      "Take-home",
      "Fun"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Personalized",
        "body": "Patterns or freehand."
      },
      {
        "label": "RESULT",
        "title": "Painted glass",
        "body": "A set you'll use."
      },
      {
        "label": "VIBE",
        "title": "Cheers energy",
        "body": "Social and light."
      }
    ],
    "scheduleRows": [
      {
        "time": "Fri · 7:00 PM",
        "note": "Friday fun"
      },
      {
        "time": "Sat · 7:00 PM",
        "note": "Best for groups"
      },
      {
        "time": "Sun · 4:00 PM",
        "note": "Easy Sunday"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79374003,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79374003",
        "priceUnit": "per person",
        "verifiedTitle": "Wine Glass Painting - Chicago"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 95909935,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95909935",
        "priceUnit": "per person",
        "verifiedTitle": "Wine Glass Painting"
      }
    }
  },
  "mushroom-pottery": {
    "slug": "mushroom-pottery",
    "title": "Mushroom Pottery",
    "navLabel": "Mushroom Pottery",
    "heroTitle": "Mushroom Pottery",
    "heroDescription": "Make a clay piece with whimsical mushroom details.",
    "shortDescription": "Make a clay piece with whimsical mushroom details.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Mushroom Pottery - Chicago.webp",
      "driveFileId": "1ASVnYO-DEJjWKu2IV5_54cuI6TcnT_gx",
      "path": "/images/classes/approved-33-cnT_gx-4c03060fd117.webp",
      "width": 1200,
      "height": 900,
      "alt": "A handmade clay bowl decorated with little mushrooms",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Mushroom Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating mushroom pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Mushroom Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79188019,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79188019",
        "priceUnit": "per person",
        "verifiedTitle": "Mushroom Pottery - Chicago"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 90532757,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=90532757",
        "priceUnit": "per person",
        "verifiedTitle": "Eugene Mushroom Pottery"
      }
    }
  },
  "watercolor": {
    "slug": "watercolor",
    "title": "Watercolor for Beginners",
    "navLabel": "Watercolor for Beginners",
    "heroTitle": "Watercolor for Beginners",
    "heroDescription": "Explore watercolor washes and brushwork with guided instruction.",
    "shortDescription": "Explore watercolor washes and brushwork with guided instruction.",
    "category": "paper-pigment",
    "categoryLabel": "Paper & Pigment",
    "categoryIcon": "🎨",
    "categoryColorClass": "category-paper",
    "overlayClass": "gradient-overlay-paper",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Water Color For Beginners.webp",
      "driveFileId": "1GujlQ9QUHvUdMFJJoh_ajjyWdg-Yj9yC",
      "path": "/images/classes/approved-44--Yj9yC-1250486ab1dc.webp",
      "width": 940,
      "height": 705,
      "alt": "Watercolor flowers beside a watercolor palette and brushes",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Watercolor for Beginners",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating watercolor for beginners. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Watercolor for Beginners",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 95947521,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95947521",
        "priceUnit": "per person",
        "verifiedTitle": "Water Color For Beginners"
      }
    }
  },
  "matcha-bowl": {
    "slug": "matcha-bowl",
    "title": "Matcha Bowl on the Wheel",
    "navLabel": "Matcha Bowl on the Wheel",
    "heroTitle": "Matcha Bowl on the Wheel",
    "heroDescription": "Throw and shape your own matcha bowl on the pottery wheel.",
    "shortDescription": "Throw and shape your own matcha bowl on the pottery wheel.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per ticket",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Wheel Throwing for Beginners -Make Your Own Matcha Bowl.webp",
      "driveFileId": "1eK1meuDixOc_lZWYmGh78TTphwljxCA2",
      "path": "/images/classes/approved-47-ljxCA2-9847496ddb3a.webp",
      "width": 1152,
      "height": 864,
      "alt": "A handmade ceramic matcha bowl with a pouring lip",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Matcha Bowl on the Wheel",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating matcha bowl on the wheel. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Matcha Bowl on the Wheel",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 94782793,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94782793",
        "priceUnit": "per person",
        "verifiedTitle": "Wheel Throwing for Beginners -Make Your Own Matcha Bowl"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 89287658,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=89287658",
        "priceUnit": "per ticket",
        "verifiedTitle": "Eugene Wheel Throwing for Beginners: Matcha Bowl"
      }
    }
  },
  "date-night-candle": {
    "slug": "date-night-candle",
    "title": "Date Night Candle Making",
    "navLabel": "Date Night Candle Making",
    "heroTitle": "Date Night Candle Making",
    "heroDescription": "Make a candle each during a creative studio date together.",
    "shortDescription": "Make a candle each during a creative studio date together.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": false,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Date Night Candle Making.webp",
      "driveFileId": "1RmziT-exXIMkDpnckW4ByH2RtfpGZ8Xc",
      "path": "/images/classes/approved-09-pGZ8Xc-f80ab73cab4c.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two guests smiling at a candle-making workshop table",
      "focalPosition": "50% 40%"
    },
    "whatYouMake": "Date Night Candle Making",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating date night candle making. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Date Night Candle Making",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 95415406,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95415406",
        "priceUnit": "for two",
        "verifiedTitle": "Date Night Candle Making"
      }
    }
  },
  "ghost": {
    "slug": "ghost",
    "title": "Ghost Pottery",
    "navLabel": "Ghost Pottery",
    "heroTitle": "Ghost Pottery",
    "heroDescription": "Shape a playful ghost from clay with step-by-step guidance.",
    "shortDescription": "Shape a playful ghost from clay with step-by-step guidance.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Halloween Ghost Pottey!.webp",
      "driveFileId": "1YMDM6UHHdSUwyX-x1plX-S3jWFXp8VJh",
      "path": "/images/classes/approved-25-Xp8VJh-a3cc50ff33d0.webp",
      "width": 1200,
      "height": 900,
      "alt": "Three studio guests holding handmade clay ghosts",
      "focalPosition": "50% 48%"
    },
    "whatYouMake": "Ghost Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating ghost pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Ghost Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 98180179,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98180179",
        "priceUnit": "per person",
        "verifiedTitle": "Halloween Ghost Pottey!"
      }
    }
  },
  "oogie-boogie": {
    "slug": "oogie-boogie",
    "title": "Oogie Boogie Candle Holder",
    "navLabel": "Oogie Boogie Candle Holder",
    "heroTitle": "Oogie Boogie Candle Holder",
    "heroDescription": "Sculpt a characterful clay candle holder with a crooked grin.",
    "shortDescription": "Sculpt a characterful clay candle holder with a crooked grin.",
    "category": "crush-create",
    "categoryLabel": "Crush & Create",
    "categoryIcon": "🕯️",
    "categoryColorClass": "category-crush",
    "overlayClass": "gradient-overlay-crush",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "OOGIE BOOGIE INSPIRED CANDLE HOLDER | HALLOWEEN POTTERY.webp",
      "driveFileId": "1Dk1vbnkzI5CVqE5sqrNzI28vJFB1jIP2",
      "path": "/images/classes/approved-34-B1jIP2-7da4f1254f0e.webp",
      "width": 1080,
      "height": 810,
      "alt": "Two sculpted Oogie Boogie-inspired clay candle holders",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Oogie Boogie Candle Holder",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating oogie boogie candle holder. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Oogie Boogie Candle Holder",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 97524789,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97524789",
        "priceUnit": "per person",
        "verifiedTitle": "OOGIE BOOGIE INSPIRED CANDLE HOLDER | HALLOWEEN POTTERY"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 98908868,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98908868",
        "priceUnit": "per person",
        "verifiedTitle": "OOGIE BOOGIE INSPIRED CANDLE HOLDER | HALLOWEEN POTTERY"
      }
    }
  },
  "monster-lantern": {
    "slug": "monster-lantern",
    "title": "Monster Lantern Pottery",
    "navLabel": "Monster Lantern Pottery",
    "heroTitle": "Monster Lantern Pottery",
    "heroDescription": "Sculpt and carve a clay lantern with a monstrous personality.",
    "shortDescription": "Sculpt and carve a clay lantern with a monstrous personality.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "MONSTER POTTERY! HALLOWEEN LANTERN CLASS.webp",
      "driveFileId": "1m8h0_RuVEIusnYBoRCVjTLVdSu-C-m2D",
      "path": "/images/classes/approved-31--C-m2D-9bb1c21ffb08.webp",
      "width": 1120,
      "height": 840,
      "alt": "Hands sculpting a clay monster lantern",
      "focalPosition": "52% 55%"
    },
    "whatYouMake": "Monster Lantern Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating monster lantern pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Monster Lantern Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 97573448,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97573448",
        "priceUnit": "per person",
        "verifiedTitle": "MONSTER POTTERY! HALLOWEEN LANTERN CLASS"
      }
    }
  },
  "charcuterie-board": {
    "slug": "charcuterie-board",
    "title": "Make & Paint a Charcuterie Board",
    "navLabel": "Make & Paint a Charcuterie Board",
    "heroTitle": "Make & Paint a Charcuterie Board",
    "heroDescription": "Make and decorate a ceramic board for your table.",
    "shortDescription": "Make and decorate a ceramic board for your table.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Charcuterie Board Make And Paint.webp",
      "driveFileId": "1v0FlW6PrKA5r_dok6WSSXmLVyUJv3ZHw",
      "path": "/images/classes/approved-06-Jv3ZHw-c93bf2f3ff95.webp",
      "width": 984,
      "height": 738,
      "alt": "A decorated ceramic serving board arranged with food",
      "focalPosition": "50% 55%"
    },
    "whatYouMake": "Make & Paint a Charcuterie Board",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating make & paint a charcuterie board. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Make & Paint a Charcuterie Board",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 96649100,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96649100",
        "priceUnit": "per person",
        "verifiedTitle": "Charcuterie Board Make And Paint"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 98845998,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98845998",
        "priceUnit": "per person",
        "verifiedTitle": "Eugene : Make Your Own Charcuterie Board"
      }
    }
  },
  "handbuilt-vase": {
    "slug": "handbuilt-vase",
    "title": "Handbuilt Vase Making",
    "navLabel": "Handbuilt Vase Making",
    "heroTitle": "Handbuilt Vase Making",
    "heroDescription": "Build and texture a clay vase by hand.",
    "shortDescription": "Build and texture a clay vase by hand.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Handbuilding For Beginners - Vase Making.webp",
      "driveFileId": "1bIBAAXJhbKNQdOGTT48BtbybBvOd_yaM",
      "path": "/images/classes/approved-27-Od_yaM-db5f47ec152e.webp",
      "width": 1120,
      "height": 840,
      "alt": "Two guests holding their handbuilt pottery vases",
      "focalPosition": "50% 45%"
    },
    "whatYouMake": "Handbuilt Vase Making",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating handbuilt vase making. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Handbuilt Vase Making",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 96491249,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96491249",
        "priceUnit": "per person",
        "verifiedTitle": "Handbuilding For Beginners - Vase Making"
      }
    }
  },
  "soap": {
    "slug": "soap",
    "title": "Soap Making",
    "navLabel": "Soap Making",
    "heroTitle": "Soap Making",
    "heroDescription": "Make your own soap in a guided hands-on workshop.",
    "shortDescription": "Make your own soap in a guided hands-on workshop.",
    "category": "crush-create",
    "categoryLabel": "Crush & Create",
    "categoryIcon": "🕯️",
    "categoryColorClass": "category-crush",
    "overlayClass": "gradient-overlay-crush",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Soap Making - Chicago.webp",
      "driveFileId": "1WgojxuIVC4kZfpAQoHeHda08iU6pd03D",
      "path": "/images/classes/approved-39-6pd03D-aa5367dfe912.webp",
      "width": 1180,
      "height": 885,
      "alt": "Handmade soap bars beside flowers and oils",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Soap Making",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating soap making. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Soap Making",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79274876,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79274876",
        "priceUnit": "per person",
        "verifiedTitle": "Soap Making - Chicago"
      }
    }
  },
  "duck-soap-holder": {
    "slug": "duck-soap-holder",
    "title": "Duck Soap Holder",
    "navLabel": "Duck Soap Holder",
    "heroTitle": "Duck Soap Holder",
    "heroDescription": "Sculpt a little duck-shaped holder for your soap.",
    "shortDescription": "Sculpt a little duck-shaped holder for your soap.",
    "category": "crush-create",
    "categoryLabel": "Crush & Create",
    "categoryIcon": "🕯️",
    "categoryColorClass": "category-crush",
    "overlayClass": "gradient-overlay-crush",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per ticket",
    "beginnerFriendly": true,
    "locationsOffered": "Eugene only",
    "image": {
      "filename": "Eugene Duck Soap holder.webp",
      "driveFileId": "1F6_m5BS08ufMK-lkDrUvOPMCU7iHzJZB",
      "path": "/images/classes/approved-18-iHzJZB-062e8f625073.webp",
      "width": 1200,
      "height": 900,
      "alt": "A white ceramic duck-shaped soap holder",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Duck Soap Holder",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating duck soap holder. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 3295 Cross Street, Eugene, OR 97402."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Duck Soap Holder",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 98334198,
        "calendarIds": [
          13582962,
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98334198",
        "priceUnit": "per ticket",
        "verifiedTitle": "Eugene Duck Soap holder"
      }
    }
  },
  "open-studio": {
    "slug": "open-studio",
    "title": "Open Studio Wheel Throwing",
    "navLabel": "Open Studio Wheel Throwing",
    "heroTitle": "Open Studio Wheel Throwing",
    "heroDescription": "Spend dedicated studio time working on the pottery wheel.",
    "shortDescription": "Spend dedicated studio time working on the pottery wheel.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Open Studio Wheel throwing.webp",
      "driveFileId": "1aMKNGVj2QaG3s8qol35P5JcEUoa5mSV-",
      "path": "/images/classes/approved-35-a5mSV--31ce8e8ba7af.webp",
      "width": 1120,
      "height": 840,
      "alt": "A potter shaping a bowl at an open studio wheel",
      "focalPosition": "55% 60%"
    },
    "whatYouMake": "Open Studio Wheel Throwing",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating open studio wheel throwing. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Open Studio Wheel Throwing",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 95911163,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95911163",
        "priceUnit": "per person",
        "verifiedTitle": "Open Studio Wheel throwing"
      }
    }
  },
  "wheel-pumpkin": {
    "slug": "wheel-pumpkin",
    "title": "Pumpkin on the Wheel",
    "navLabel": "Pumpkin on the Wheel",
    "heroTitle": "Pumpkin on the Wheel",
    "heroDescription": "Throw and shape a ceramic pumpkin on the pottery wheel.",
    "shortDescription": "Throw and shape a ceramic pumpkin on the pottery wheel.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Throw A Pumpkin On The Wheel.webp",
      "driveFileId": "1QcgtqkhqZ-bmRZLel8UTmDdU40Z5t289",
      "path": "/images/classes/approved-41-Z5t289-fa4591214677.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two unglazed wheel-thrown clay pumpkins",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Pumpkin on the Wheel",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating pumpkin on the wheel. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Pumpkin on the Wheel",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 98548612,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98548612",
        "priceUnit": "per person",
        "verifiedTitle": "Throw A Pumpkin On The Wheel"
      }
    }
  },
  "ceramic-chess": {
    "slug": "ceramic-chess",
    "title": "Date Night Ceramic Chess",
    "navLabel": "Date Night Ceramic Chess",
    "heroTitle": "Date Night Ceramic Chess",
    "heroDescription": "Create your own ceramic chess set together.",
    "shortDescription": "Create your own ceramic chess set together.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": true,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Eugene only",
    "image": {
      "filename": "Date Night: Make Your Own Ceramic Chess Set ♟️.webp",
      "driveFileId": "1tH32y2VynWe1KrhuygbBMcARm7zfKHQr",
      "path": "/images/classes/approved-13-zfKHQr-b484e7f234e3.webp",
      "width": 1200,
      "height": 900,
      "alt": "Handmade blue and gold ceramic chess pieces",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Date Night Ceramic Chess",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating date night ceramic chess. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 3295 Cross Street, Eugene, OR 97402."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Date Night Ceramic Chess",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 97861588,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97861588",
        "priceUnit": "for two",
        "verifiedTitle": "Date Night: Make Your Own Ceramic Chess Set ♟️"
      }
    }
  },
  "date-night-watercolor": {
    "slug": "date-night-watercolor",
    "title": "Date Night Watercolor for Two",
    "navLabel": "Date Night Watercolor for Two",
    "heroTitle": "Date Night Watercolor for Two",
    "heroDescription": "Paint together with watercolor in a guided creative date.",
    "shortDescription": "Paint together with watercolor in a guided creative date.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": false,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Date Night Watercolor Painting for Two - Chicago.webp",
      "driveFileId": "1pG8c-BNS5LsGxlAILx-fZZgM4rPKrRG-",
      "path": "/images/classes/approved-11-PKrRG--1250486ab1dc.webp",
      "width": 940,
      "height": 705,
      "alt": "Watercolor flowers beside a watercolor palette and brushes",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Date Night Watercolor for Two",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating date night watercolor for two. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Date Night Watercolor for Two",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 94935292,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94935292",
        "priceUnit": "for two",
        "verifiedTitle": "Date Night Watercolor Painting for Two - Chicago"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 94932997,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94932997",
        "priceUnit": "for two",
        "verifiedTitle": "Date Night Watercolor Painting for Two - Eugene"
      }
    }
  },
  "vip-date-night-bonsai": {
    "slug": "vip-date-night-bonsai",
    "title": "VIP Date Night Bonsai",
    "navLabel": "VIP Date Night Bonsai",
    "heroTitle": "VIP Date Night Bonsai",
    "heroDescription": "Learn to shape bonsai together in a guided date-night workshop.",
    "shortDescription": "Learn to shape bonsai together in a guided date-night workshop.",
    "category": "romance-room",
    "categoryLabel": "Romance Room",
    "categoryIcon": "💕",
    "categoryColorClass": "category-romance",
    "overlayClass": "gradient-overlay-romance",
    "isPottery": false,
    "coversTwo": true,
    "coversNote": "One ticket covers two people",
    "duration": "90–120 minutes",
    "ticketUnit": "for two",
    "beginnerFriendly": true,
    "locationsOffered": "Eugene only",
    "image": {
      "filename": "Date Night Bonsai VIP.webp",
      "driveFileId": "1ipWUtg4iAI2BYOHlTPv-ozBkePjaP3Wk",
      "path": "/images/classes/approved-08-jaP3Wk-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "A couple holding bonsai trees made in their workshop",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "VIP Date Night Bonsai",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating vip date night bonsai. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 3295 Cross Street, Eugene, OR 97402."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "VIP Date Night Bonsai",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 94058299,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94058299",
        "priceUnit": "for two",
        "verifiedTitle": "Date Night Bonsai VIP"
      }
    }
  },
  "wheel-vase": {
    "slug": "wheel-vase",
    "title": "Vase Making on the Wheel",
    "navLabel": "Vase Making on the Wheel",
    "heroTitle": "Vase Making on the Wheel",
    "heroDescription": "Learn to throw a vase and shape its silhouette on the wheel.",
    "shortDescription": "Learn to throw a vase and shape its silhouette on the wheel.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Wheel Throwing for Beginners -Vase Making.webp",
      "driveFileId": "1ZxDIPV80lLYE8-YVvJ-rRNkPK7fzOd_M",
      "path": "/images/classes/approved-48-fzOd_M-78335159bcd7.webp",
      "width": 1200,
      "height": 900,
      "alt": "A participant shaping a clay vessel at a pottery wheel",
      "focalPosition": "50% 60%"
    },
    "whatYouMake": "Vase Making on the Wheel",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating vase making on the wheel. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Vase Making on the Wheel",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 94782880,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94782880",
        "priceUnit": "per person",
        "verifiedTitle": "Wheel Throwing for Beginners -Vase Making"
      }
    }
  },
  "make-and-paint-wheel": {
    "slug": "make-and-paint-wheel",
    "title": "Make & Paint on the Wheel",
    "navLabel": "Make & Paint on the Wheel",
    "heroTitle": "Make & Paint on the Wheel",
    "heroDescription": "Throw a pottery piece and add your own painted details.",
    "shortDescription": "Throw a pottery piece and add your own painted details.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Make And Paint - Wheel throwing.webp",
      "driveFileId": "1ZmRBxXpBVYiOVsHyJy-k2T4DDoMWLugH",
      "path": "/images/classes/approved-30-MWLugH-4fd2082da220.webp",
      "width": 1044,
      "height": 783,
      "alt": "Participants painting pottery on wheels in the studio",
      "focalPosition": "50% 60%"
    },
    "whatYouMake": "Make & Paint on the Wheel",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating make & paint on the wheel. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Make & Paint on the Wheel",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 95806344,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95806344",
        "priceUnit": "per person",
        "verifiedTitle": "Make And Paint - Wheel throwing"
      }
    }
  },
  "pipe-and-ashtray": {
    "slug": "pipe-and-ashtray",
    "title": "Pipe & Ashtray Making",
    "navLabel": "Pipe & Ashtray Making",
    "heroTitle": "Pipe & Ashtray Making",
    "heroDescription": "Shape your own ceramic pipe and ashtray by hand.",
    "shortDescription": "Shape your own ceramic pipe and ashtray by hand.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "adultThemed": true,
    "ageRestriction": "18+",
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Pipe and Ashtray Making Class - Chicago.webp",
      "driveFileId": "1Gf3pMDTNEgJgY20r4Twg1MvYODZmbGc9",
      "path": "/images/classes/approved-37-ZmbGc9-5987c695c8b3.webp",
      "width": 1200,
      "height": 900,
      "alt": "Guests sculpting clay at a shared studio table",
      "focalPosition": "50% 45%"
    },
    "whatYouMake": "Pipe & Ashtray Making",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating pipe & ashtray making. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Pipe & Ashtray Making",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79188421,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79188421",
        "priceUnit": "per person",
        "verifiedTitle": "Pipe and Ashtray Making Class - Chicago"
      },
      "eugene": {
        "city": "eugene",
        "appointmentTypeId": 90211026,
        "calendarIds": [
          13582962
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=90211026",
        "priceUnit": "per person",
        "verifiedTitle": "Eugene Pipe and Ashtray Making Class"
      }
    }
  },
  "boobs-mug": {
    "slug": "boobs-mug",
    "title": "Boobs Coffee Mug",
    "navLabel": "Boobs Coffee Mug",
    "heroTitle": "Boobs Coffee Mug",
    "heroDescription": "Handbuild a cheeky, body-inspired ceramic mug.",
    "shortDescription": "Handbuild a cheeky, body-inspired ceramic mug.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "adultThemed": true,
    "ageRestriction": "18+",
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Boobs Coffee Mug - Chicago.webp",
      "driveFileId": "1doXJBmxsZonqysNYO4wPZdV8lFOxXCRA",
      "path": "/images/classes/approved-02-OxXCRA-483d78af789f.webp",
      "width": 1080,
      "height": 810,
      "alt": "A participant shaping a body-inspired clay mug",
      "focalPosition": "55% 45%"
    },
    "whatYouMake": "Boobs Coffee Mug",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating boobs coffee mug. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Boobs Coffee Mug",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79187550,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79187550",
        "priceUnit": "per person",
        "verifiedTitle": "Boobs Coffee Mug - Chicago"
      }
    }
  },
  "dildos-and-bottles": {
    "slug": "dildos-and-bottles",
    "title": "Dildos Pottery",
    "navLabel": "Dildos Pottery",
    "heroTitle": "Dildos Pottery",
    "heroDescription": "Sculpt a playful adult-themed creation from clay.",
    "shortDescription": "Sculpt a playful adult-themed creation from clay.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "adultThemed": true,
    "ageRestriction": "18+",
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Dildos and Bottles - Chicago.webp",
      "driveFileId": "1A0z3iSQIrVgzc0GDYG9UurcYUaO6jPqj",
      "path": "/images/classes/approved-14-O6jPqj-44b6e46c35f2.webp",
      "width": 1200,
      "height": 900,
      "alt": "A group working on adult-themed clay projects in the studio",
      "focalPosition": "50% 43%"
    },
    "whatYouMake": "Dildos Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating dildos pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Dildos Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79186927,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79186927",
        "priceUnit": "per person",
        "verifiedTitle": "Dildos and Bottles - Chicago"
      }
    }
  },
  "pussy-pottery": {
    "slug": "pussy-pottery",
    "title": "Pussy Pottery",
    "navLabel": "Pussy Pottery",
    "heroTitle": "Pussy Pottery",
    "heroDescription": "Create expressive, body-inspired ceramic art.",
    "shortDescription": "Create expressive, body-inspired ceramic art.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "adultThemed": true,
    "ageRestriction": "18+",
    "locationsOffered": "Chicago only",
    "image": {
      "filename": "Pussy Pottery - Chicago.webp",
      "driveFileId": "1EubdimRySRYd_IYvDKPlbPZXE9qZICjD",
      "path": "/images/classes/approved-38-qZICjD-8bdf861bfae5.webp",
      "width": 1200,
      "height": 900,
      "alt": "An arrangement of body-inspired ceramic vessels",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Pussy Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating pussy pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try."
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio."
      },
      {
        "label": "Location",
        "text": "Studio located at 1142 W. 18th Street, Chicago, IL 60608."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Pussy Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79188691,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79188691",
        "priceUnit": "per person",
        "verifiedTitle": "Pussy Pottery - Chicago"
      }
    }
  },
  "online-cauldron": {
    "slug": "online-cauldron",
    "title": "Live Online Cauldron Pottery",
    "navLabel": "Live Online Cauldron Pottery",
    "heroTitle": "Live Online Cauldron Pottery",
    "heroDescription": "Make a clay cauldron in a guided workshop from home.",
    "shortDescription": "Make a clay cauldron in a guided workshop from home.",
    "category": "mud-room",
    "categoryLabel": "Mud Room",
    "categoryIcon": "🏺",
    "categoryColorClass": "category-mud",
    "overlayClass": "gradient-overlay-mud",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per ticket",
    "beginnerFriendly": true,
    "locationsOffered": "Live online",
    "image": {
      "filename": "Make a Clay Cauldron — Live Online Halloween Workshop.webp",
      "driveFileId": "1GrTH8xrgkUTKM98nw0XjfIn6TBmzv-ST",
      "path": "/images/classes/approved-29-mzv-ST-49bec5c931b2.webp",
      "width": 1200,
      "height": 900,
      "alt": "A black clay cauldron with small handles",
      "focalPosition": "50% 50%"
    },
    "whatYouMake": "Live Online Cauldron Pottery",
    "theExperience": [
      {
        "title": "Guided Instruction & Atmosphere",
        "body": "Join our instructors for an engaging, hands-on session creating live online cauldron pottery. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side."
      },
      {
        "title": "Materials & Equipment Provided",
        "body": "All materials, tools, and personalized artist coaching are provided for the duration of the workshop. "
      }
    ],
    "included": [
      "All required tools and materials",
      "Step-by-step artist instruction",
      "Studio cleanup handled by CCF staff"
    ],
    "practicalInfo": [
      {
        "label": "BYOB Friendly",
        "text": "Enjoy your favorite drinks from the comfort of your home."
      },
      {
        "label": "Location",
        "text": "Live online—join from home via video call with materials kit delivered."
      }
    ],
    "faqs": [
      {
        "q": "Do I need any previous experience?",
        "a": "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists."
      },
      {
        "q": "What should I wear?",
        "a": "Comfortable casual clothes are perfect."
      },
      {
        "q": "Can I bring my own drinks?",
        "a": "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)."
      }
    ],
    "tags": [
      "Live Online Cauldron Pottery",
      "Workshop",
      "Hands-on",
      "BYOB"
    ],
    "valueCards": [
      {
        "label": "GUIDED",
        "title": "Expert Support",
        "body": "Hands-on coaching throughout the workshop."
      },
      {
        "label": "ALL-INCLUSIVE",
        "title": "Materials Provided",
        "body": "All studio tools and supplies ready for you."
      },
      {
        "label": "RELAXED",
        "title": "BYOB Friendly",
        "body": "Unwind with your favorite drinks and playlist."
      }
    ],
    "scheduleRows": [],
    "destinations": {
      "online": {
        "city": "online",
        "appointmentTypeId": 98770334,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98770334",
        "priceUnit": "per ticket",
        "verifiedTitle": "Make a Clay Cauldron — Live Online Halloween Workshop"
      }
    }
  },
  "private-parties": {
    "slug": "private-parties",
    "title": "Request a Private Event",
    "navLabel": "Private Events",
    "heroTitle": "Request a Private Event",
    "heroDescription": "Tell us what you're planning and we'll reply with workshop options, pricing, and available dates.",
    "shortDescription": "Tell us what you're planning and we'll reply with workshop options, pricing, and available dates.",
    "category": "special",
    "categoryLabel": "Special Events",
    "categoryIcon": "🎉",
    "categoryColorClass": "category-private",
    "overlayClass": "bg-gradient-to-br from-emerald-900/55 via-slate-900/30 to-amber-900/45",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Request a Private Event",
    "theExperience": [
      {
        "title": "Creative Experience",
        "body": "Tell us what you're planning and we'll reply with workshop options, pricing, and available dates."
      }
    ],
    "included": [
      "All required materials",
      "Expert instruction"
    ],
    "practicalInfo": [
      {
        "label": "Locations",
        "text": "Offered in Chicago and Eugene studios."
      }
    ],
    "faqs": [
      {
        "q": "How far ahead should we book?",
        "a": "Earlier is better for weekends, but we can often fit you in."
      },
      {
        "q": "Can we bring food/drinks?",
        "a": "Often yes (depending on format). Ask in the inquiry and we'll confirm."
      },
      {
        "q": "What group sizes work best?",
        "a": "Small squads to full teams — we'll recommend the right setup."
      },
      {
        "q": "Can we choose the workshop theme?",
        "a": "Yes. We'll tailor the project and pacing to your crew."
      },
      {
        "q": "Do you do corporate invoices?",
        "a": "Yes — we can provide invoices/receipts for company reimbursements."
      }
    ],
    "tags": [
      "Team-building",
      "Birthdays",
      "Bachelorettes",
      "Custom formats",
      "Easy planning"
    ],
    "valueCards": [
      {
        "label": "SPACE",
        "title": "Room to celebrate",
        "body": "We'll match you with the best room + vibe."
      },
      {
        "label": "FORMAT",
        "title": "Pick your craft",
        "body": "Pottery, mosaics, candles, painting, more."
      },
      {
        "label": "EASE",
        "title": "Simple booking",
        "body": "Fast confirmations and clear expectations."
      }
    ],
    "scheduleRows": [
      {
        "time": "Sat · 2:30–5:00 PM",
        "note": "Best overall slot"
      },
      {
        "time": "Fri · 5:30–7:30 PM",
        "note": "After-work win"
      },
      {
        "time": "Sun · 1:00–4:30 PM",
        "note": "Easy daytime"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/",
        "priceUnit": "per person",
        "verifiedTitle": "Request a Private Event"
      }
    }
  },
  "handbuilding": {
    "slug": "handbuilding",
    "title": "Handbuilding Pottery",
    "navLabel": "Handbuilding",
    "heroTitle": "Handbuilding Pottery",
    "heroDescription": "No wheel needed. Build cups, bowls, planters, and sculptural pieces using slab + pinch techniques. Great for groups and beginners.",
    "shortDescription": "No wheel needed. Build cups, bowls, planters, and sculptural pieces using slab + pinch techniques. Great for groups and beginners.",
    "category": "special",
    "categoryLabel": "Special Events",
    "categoryIcon": "🎉",
    "categoryColorClass": "category-private",
    "overlayClass": "bg-gradient-to-br from-amber-900/45 via-indigo-900/20 to-emerald-900/35",
    "isPottery": true,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Handbuilding Pottery",
    "theExperience": [
      {
        "title": "Creative Experience",
        "body": "No wheel needed. Build cups, bowls, planters, and sculptural pieces using slab + pinch techniques. Great for groups and beginners."
      }
    ],
    "included": [
      "All required materials",
      "Expert instruction"
    ],
    "practicalInfo": [
      {
        "label": "Locations",
        "text": "Offered in Chicago and Eugene studios."
      }
    ],
    "faqs": [
      {
        "q": "Do I need experience?",
        "a": "No — we teach step-by-step."
      },
      {
        "q": "What can I make?",
        "a": "Bowls, planters, vases, and rotating themed projects."
      },
      {
        "q": "Do you fire pieces?",
        "a": "Optional bisque firing is $10/piece and glazing starts at $20/piece with approximate three-week turnaround."
      },
      {
        "q": "Is it kid-friendly?",
        "a": "Some sessions are; see Parent & Me for the best fit."
      },
      {
        "q": "Is it good for groups?",
        "a": "Yes — extremely."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Relaxing",
      "Group-friendly",
      "Take-home"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Tactile",
        "body": "Hands-first pottery, very satisfying."
      },
      {
        "label": "RESULT",
        "title": "Functional pieces",
        "body": "Cups, bowls, planters, more."
      },
      {
        "label": "VIBE",
        "title": "Low pressure",
        "body": "Perfect for chatting + creating."
      }
    ],
    "scheduleRows": [
      {
        "time": "Sun · 1:00 PM",
        "note": "Easy daytime"
      },
      {
        "time": "Thu · 5:30 PM",
        "note": "After-work calm"
      },
      {
        "time": "Sat · 12:00 PM",
        "note": "Classic slot"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/",
        "priceUnit": "per person",
        "verifiedTitle": "Handbuilding Pottery"
      }
    }
  },
  "glass-blowing": {
    "slug": "glass-blowing",
    "title": "Glass Blowing (Coming Soon)",
    "navLabel": "Glass Blowing",
    "heroTitle": "Glass Blowing (Coming Soon)",
    "heroDescription": "We're building this. Want early access? Join the waitlist and we'll notify you as soon as the first sessions drop.",
    "shortDescription": "We're building this. Want early access? Join the waitlist and we'll notify you as soon as the first sessions drop.",
    "category": "special",
    "categoryLabel": "Special Events",
    "categoryIcon": "🎉",
    "categoryColorClass": "category-private",
    "overlayClass": "bg-gradient-to-br from-indigo-900/55 via-slate-900/25 to-amber-900/35",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Glass Blowing (Coming Soon)",
    "theExperience": [
      {
        "title": "Creative Experience",
        "body": "We're building this. Want early access? Join the waitlist and we'll notify you as soon as the first sessions drop."
      }
    ],
    "included": [
      "All required materials",
      "Expert instruction"
    ],
    "practicalInfo": [
      {
        "label": "Locations",
        "text": "Offered in Chicago and Eugene studios."
      }
    ],
    "faqs": [
      {
        "q": "When does it launch?",
        "a": "Soon. Join the waitlist and you'll get first notice."
      },
      {
        "q": "Is it beginner-friendly?",
        "a": "Yes — intro sessions will be built for beginners."
      },
      {
        "q": "Will it be premium priced?",
        "a": "Likely yes — materials + equipment are costly."
      },
      {
        "q": "Can groups book it privately?",
        "a": "Yes — once live, private events will be available."
      },
      {
        "q": "How do I get updates?",
        "a": "Use the waitlist button; it opens a ready email to send."
      }
    ],
    "tags": [
      "Coming soon",
      "Premium",
      "Limited seats",
      "Early access"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Molten magic",
        "body": "Fire, color, and form in motion."
      },
      {
        "label": "RESULT",
        "title": "Real glass pieces",
        "body": "Take-home forms once cooled/finished."
      },
      {
        "label": "VIBE",
        "title": "Bucket-list",
        "body": "A true 'I did that' workshop."
      }
    ],
    "scheduleRows": [
      {
        "time": "Launching soon",
        "note": "Sign up for updates",
        "href": "mailto:support@colorcocktailfactory.com?subject=Glass%20Blowing%20Waitlist&body=Hi%20CCF!%20Please%20add%20me%20to%20the%20waitlist.%0A%0AName%3A%0AEmail%3A%0APhone%3A%0ACity%3A%0ANotes%3A%0A"
      },
      {
        "time": "First dates TBD",
        "note": "We'll email when live",
        "href": "mailto:support@colorcocktailfactory.com?subject=Glass%20Blowing%20Waitlist&body=Hi%20CCF!%20Please%20add%20me%20to%20the%20waitlist.%0A%0AName%3A%0AEmail%3A%0APhone%3A%0ACity%3A%0ANotes%3A%0A"
      },
      {
        "time": "VIP early access",
        "note": "Limited seats",
        "href": "mailto:support@colorcocktailfactory.com?subject=Glass%20Blowing%20Waitlist&body=Hi%20CCF!%20Please%20add%20me%20to%20the%20waitlist.%0A%0AName%3A%0AEmail%3A%0APhone%3A%0ACity%3A%0ANotes%3A%0A"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/",
        "priceUnit": "per person",
        "verifiedTitle": "Glass Blowing (Coming Soon)"
      }
    }
  },
  "paper-pigment": {
    "slug": "paper-pigment",
    "title": "Paper & Pigment",
    "navLabel": "Paper & Pigment",
    "heroTitle": "Paper & Pigment",
    "heroDescription": "Watercolor that feels premium and modern: from making your own paint to weekly sessions and online classes.",
    "shortDescription": "Watercolor that feels premium and modern: from making your own paint to weekly sessions and online classes.",
    "category": "special",
    "categoryLabel": "Special Events",
    "categoryIcon": "🎉",
    "categoryColorClass": "category-private",
    "overlayClass": "bg-gradient-to-br from-sky-900/45 via-indigo-900/25 to-amber-900/35",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Paper & Pigment",
    "theExperience": [
      {
        "title": "Creative Experience",
        "body": "Watercolor that feels premium and modern: from making your own paint to weekly sessions and online classes."
      }
    ],
    "included": [
      "All required materials",
      "Expert instruction"
    ],
    "practicalInfo": [
      {
        "label": "Locations",
        "text": "Offered in Chicago and Eugene studios."
      }
    ],
    "faqs": [
      {
        "q": "Do you provide supplies?",
        "a": "Yes — we provide what you need in class."
      },
      {
        "q": "What's '˜make your own watercolor'?",
        "a": "You create paint, then use it immediately."
      },
      {
        "q": "Is watercolor hard?",
        "a": "We make it approachable with simple exercises."
      },
      {
        "q": "Do you offer online?",
        "a": "Yes — check listings for online sessions."
      },
      {
        "q": "Is this good for groups?",
        "a": "Yes — calm and social."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Premium",
      "Mindful",
      "Online options"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Luminous",
        "body": "Soft blends and blooms."
      },
      {
        "label": "RESULT",
        "title": "Real technique",
        "body": "Brush control + layers."
      },
      {
        "label": "VIBE",
        "title": "Peaceful",
        "body": "A gentle creative reset."
      }
    ],
    "scheduleRows": [
      {
        "time": "Make your own watercolor + paint",
        "note": "Premium signature"
      },
      {
        "time": "Weekly watercolor session",
        "note": "All skills"
      },
      {
        "time": "Online watercolor classes",
        "note": "Learn anywhere"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/",
        "priceUnit": "per person",
        "verifiedTitle": "Paper & Pigment"
      }
    }
  },
  "painting": {
    "slug": "painting",
    "title": "Painting Department",
    "navLabel": "Painting",
    "heroTitle": "Painting Department",
    "heroDescription": "Acrylic painting nights, themed sessions, and easy-to-love projects. Come for the vibes, leave with a painting you're proud of.",
    "shortDescription": "Acrylic painting nights, themed sessions, and easy-to-love projects. Come for the vibes, leave with a painting you're proud of.",
    "category": "special",
    "categoryLabel": "Special Events",
    "categoryIcon": "🎉",
    "categoryColorClass": "category-private",
    "overlayClass": "bg-gradient-to-br from-indigo-900/55 via-slate-900/30 to-rose-900/40",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Painting Department",
    "theExperience": [
      {
        "title": "Creative Experience",
        "body": "Acrylic painting nights, themed sessions, and easy-to-love projects. Come for the vibes, leave with a painting you're proud of."
      }
    ],
    "included": [
      "All required materials",
      "Expert instruction"
    ],
    "practicalInfo": [
      {
        "label": "Locations",
        "text": "Offered in Chicago and Eugene studios."
      }
    ],
    "faqs": [
      {
        "q": "Do I need experience?",
        "a": "No — we teach step-by-step."
      },
      {
        "q": "Can I choose colors?",
        "a": "Yes — we encourage personalization."
      },
      {
        "q": "Do you do themed nights?",
        "a": "Yes — holiday + seasonal themes happen often."
      },
      {
        "q": "Is this good for groups?",
        "a": "Yes — easy and social."
      },
      {
        "q": "Do you offer private painting parties?",
        "a": "Yes — see Private Events."
      }
    ],
    "tags": [
      "Beginner-friendly",
      "Group-friendly",
      "Great for dates",
      "Take-home art"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Bold + fun",
        "body": "Color-forward, not intimidating."
      },
      {
        "label": "RESULT",
        "title": "Finished painting",
        "body": "Leave with a full piece."
      },
      {
        "label": "VIBE",
        "title": "Party-safe",
        "body": "Perfect for birthdays and friends."
      }
    ],
    "scheduleRows": [
      {
        "time": "Acrylic painting nights",
        "note": "Beginner-friendly"
      },
      {
        "time": "Themed painting sessions",
        "note": "Holiday specials"
      },
      {
        "time": "Sip & paint classics",
        "note": "Easy wins"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/",
        "priceUnit": "per person",
        "verifiedTitle": "Painting Department"
      }
    }
  },
  "parent-and-me": {
    "slug": "parent-and-me",
    "title": "Parent & Me Classes",
    "navLabel": "Parent & Me",
    "heroTitle": "Parent & Me Classes",
    "heroDescription": "A kid-friendly creative session where parents and kids make together. Easy projects, guided steps, and maximum proud smiles.",
    "shortDescription": "A kid-friendly creative session where parents and kids make together. Easy projects, guided steps, and maximum proud smiles.",
    "category": "special",
    "categoryLabel": "Special Events",
    "categoryIcon": "🎉",
    "categoryColorClass": "category-private",
    "overlayClass": "bg-gradient-to-br from-rose-900/40 via-sky-900/20 to-emerald-900/30",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Parent & Me Classes",
    "theExperience": [
      {
        "title": "Creative Experience",
        "body": "A kid-friendly creative session where parents and kids make together. Easy projects, guided steps, and maximum proud smiles."
      }
    ],
    "included": [
      "All required materials",
      "Expert instruction"
    ],
    "practicalInfo": [
      {
        "label": "Locations",
        "text": "Offered in Chicago and Eugene studios."
      }
    ],
    "faqs": [
      {
        "q": "What ages work best?",
        "a": "It depends on the project; listings usually include age guidance."
      },
      {
        "q": "Do adults participate?",
        "a": "Yes — it's collaborative by design."
      },
      {
        "q": "Is it messy?",
        "a": "A little, but manageable. Aprons recommended."
      },
      {
        "q": "Do we keep the pieces?",
        "a": "Your ticket covers instruction, clay, and tools. Optional bisque firing is $10/piece and glazing starts at $20/piece (approx. three-week turnaround)."
      },
      {
        "q": "Can we book for birthdays?",
        "a": "Yes — see Private Events for group options."
      }
    ],
    "tags": [
      "Kid-friendly",
      "Beginner-friendly",
      "Weekend",
      "Memories"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "Simple + cute",
        "body": "Projects that kids can actually finish."
      },
      {
        "label": "RESULT",
        "title": "Shared keepsakes",
        "body": "Take-home memories (and pieces)."
      },
      {
        "label": "VIBE",
        "title": "Wholesome",
        "body": "A screen-free win for everyone."
      }
    ],
    "scheduleRows": [
      {
        "time": "Sat · 10:30 AM",
        "note": "Best family slot"
      },
      {
        "time": "Sun · 12:00 PM",
        "note": "Easy weekend"
      },
      {
        "time": "Holiday pop-ups",
        "note": "Special themes"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/",
        "priceUnit": "per person",
        "verifiedTitle": "Parent & Me Classes"
      }
    }
  },
  "gift-cards": {
    "slug": "gift-cards",
    "title": "Gift Cards",
    "navLabel": "Gift Cards",
    "heroTitle": "Gift Cards",
    "heroDescription": "Holiday mode: activated. Gift cards work for pottery, mosaics, Turkish lamps, glass fusion, bonsai, terrariums, candle making, watercolor, painting nights — the whole creative universe.",
    "shortDescription": "Holiday mode: activated. Gift cards work for pottery, mosaics, Turkish lamps, glass fusion, bonsai, terrariums, candle making, watercolor, painting nights — the whole creative universe.",
    "category": "special",
    "categoryLabel": "Special Events",
    "categoryIcon": "🎉",
    "categoryColorClass": "category-private",
    "overlayClass": "bg-gradient-to-br from-rose-900/60 via-amber-900/35 to-indigo-900/55",
    "isPottery": false,
    "coversTwo": false,
    "duration": "90–120 minutes",
    "ticketUnit": "per person",
    "beginnerFriendly": true,
    "locationsOffered": "Chicago & Eugene",
    "image": {
      "filename": "Bonsai for Beginners: Hands-On Workshop - Chicago.webp",
      "driveFileId": "1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv",
      "path": "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
      "width": 1200,
      "height": 900,
      "alt": "Two workshop guests holding their finished bonsai trees",
      "focalPosition": "50% 42%"
    },
    "whatYouMake": "Gift Cards",
    "theExperience": [
      {
        "title": "Creative Experience",
        "body": "Holiday mode: activated. Gift cards work for pottery, mosaics, Turkish lamps, glass fusion, bonsai, terrariums, candle making, watercolor, painting nights — the whole creative universe."
      }
    ],
    "included": [
      "All required materials",
      "Expert instruction"
    ],
    "practicalInfo": [
      {
        "label": "Locations",
        "text": "Offered in Chicago and Eugene studios."
      }
    ],
    "faqs": [
      {
        "q": "Do gift cards work for any class?",
        "a": "Yes — use them toward any public class or workshop booking."
      },
      {
        "q": "Do they expire?",
        "a": "Generally no. If you ever need help applying one, we'll fix it fast."
      },
      {
        "q": "Can I send it to someone?",
        "a": "Yep. Buy it, then share the link or forward the confirmation."
      },
      {
        "q": "Can it cover two people?",
        "a": "Absolutely — especially great for Date Night classes."
      },
      {
        "q": "What if I buy the wrong amount?",
        "a": "No stress. We can help you combine or apply balances."
      }
    ],
    "tags": [
      "Instant delivery",
      "Works for any class",
      "Perfect for couples",
      "Great for any occasion"
    ],
    "valueCards": [
      {
        "label": "STYLE",
        "title": "The easiest win",
        "body": "Looks thoughtful. Requires zero guessing."
      },
      {
        "label": "RESULT",
        "title": "They choose the vibe",
        "body": "Pottery, mosaics, lamps, glass, bonsai, painting'¦"
      },
      {
        "label": "VIBE",
        "title": "Holiday glow",
        "body": "Creative plans beat last-minute stuff."
      }
    ],
    "scheduleRows": [
      {
        "time": "$50 · Popular pick",
        "note": "Perfect for a first class",
        "href": "https://app.acuityscheduling.com/catalog.php?owner=35932879&category=Gift+Cards"
      },
      {
        "time": "$100 · Date night energy",
        "note": "Two people, one great plan",
        "href": "https://app.acuityscheduling.com/catalog.php?owner=35932879&category=Gift+Cards"
      },
      {
        "time": "$200 · Full experience",
        "note": "Premium workshop + extras",
        "href": "https://app.acuityscheduling.com/catalog.php?owner=35932879&category=Gift+Cards"
      }
    ],
    "destinations": {
      "chicago": {
        "city": "chicago",
        "appointmentTypeId": 79006616,
        "calendarIds": [
          12216179
        ],
        "bookingUrl": "https://colorcocktailfactory.as.me/",
        "priceUnit": "per person",
        "verifiedTitle": "Gift Cards"
      }
    }
  }
};

export function getAllActivityDetails(): ActivityDetail[] {
  return Object.values(ACTIVITY_REGISTRY);
}

export function getActivityDetailBySlug(slug: string): ActivityDetail | undefined {
  return ACTIVITY_REGISTRY[slug];
}

export function getAllActivitySlugs(): string[] {
  return Object.keys(ACTIVITY_REGISTRY);
}

export function getBookingDestinations(slug: string): ActivityDetail["destinations"] | undefined {
  return ACTIVITY_REGISTRY[slug]?.destinations;
}
