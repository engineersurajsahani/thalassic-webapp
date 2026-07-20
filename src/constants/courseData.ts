import { Course } from "@/features/courses/types/course";

export const courseData: Course[] = [
  // Basic Courses
  {
    id: "bst",
    code: "BST",
    name: "Basic Safety Training",
    description: "Personal Survival Techniques (PST), Personal Safety & Social Responsibility (PSSR), Elementary First Aid (EFA), and Fire Prevention & Fire Fighting (FPFF).",
    duration: "12 Days",
    level: "Entry Level",
    icon: "🎯",
    category: "basic",
    image: "/images/courses/basic_safety_training.jpg",
    fees: "₹15,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Fitness Certificate (DGS Approved Doctor)",
      "10th Standard Marksheet",
      "INDOS Registration Copy"
    ],
    rating: 4.8,
    ratingCount: 342
  },
  {
    id: "stsdsd",
    code: "STSDSD",
    name: "Security Training for Seafarers with Designated Security Duties",
    description: "Comprehensive training on security threats, search procedures, piracy mitigation, and shipboard security plan execution.",
    duration: "2 Days",
    level: "Entry Level",
    icon: "🚢",
    category: "basic",
    image: "/images/courses/basic_safety_training.jpg",
    fees: "₹12,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "Basic Safety Training Certificate"
    ],
    rating: 4.9,
    ratingCount: 188
  },
  {
    id: "octco",
    code: "OCTCO",
    name: "Oil & Chemical Tanker Cargo Operations",
    description: "Familiarization training covering tanker designs, cargo properties, safety hazards, emergency actions, and pollution prevention.",
    duration: "6 Days",
    level: "Entry Level",
    icon: "🎯",
    category: "basic",
    image: "/images/courses/basic_safety_training.jpg",
    fees: "₹18,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "Basic Safety Training (BST) Certificate",
      "INDOS Copy"
    ],
    rating: 4.7,
    ratingCount: 156
  },
  {
    id: "gtfc",
    code: "GTFC",
    name: "Gas Tanker Familiarization Course",
    description: "Basic training for liquefied gas tanker cargo operations, thermodynamic properties of gases, safety monitoring systems, and hazard controls.",
    duration: "3 Days",
    level: "Entry Level",
    icon: "⛽",
    category: "basic",
    image: "/images/courses/basic_safety_training.jpg",
    fees: "₹14,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "Basic Safety Training Certificate",
      "INDOS Copy"
    ],
    rating: 4.8,
    ratingCount: 112
  },
  {
    id: "pst",
    code: "PST",
    name: "Personal Survival Techniques",
    description: "Launch lifeboats, board life rafts in open water, deploy survival equipment, and implement cold-water survival principles.",
    duration: "2 Days",
    level: "Entry Level",
    icon: "🏊",
    category: "basic",
    image: "/images/courses/basic_safety_training.jpg",
    fees: "₹10,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "INDOS Registration Copy"
    ],
    rating: 4.6,
    ratingCount: 220
  },
  {
    id: "fpff",
    code: "FPFF",
    name: "Fire Prevention and Fire Fighting",
    description: "Identify fire risks onboard, coordinate crew action drills, utilize marine fire extinguishers, breathing apparatuses, and specialized hoses.",
    duration: "3 Days",
    level: "Entry Level",
    icon: "🔥",
    category: "basic",
    image: "/images/courses/basic_safety_training.jpg",
    fees: "₹12,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Fitness Certificate",
      "INDOS Copy"
    ],
    rating: 4.9,
    ratingCount: 290
  },
  {
    id: "psf",
    code: "PSF",
    name: "Passenger Ship Familiarization",
    description: "Basic safety training for passenger ships including crowd management, safety guidelines, evacuation layouts, and emergency procedures.",
    duration: "3 Days",
    level: "Entry Level",
    icon: "🚤",
    category: "basic",
    image: "/images/courses/basic_safety_training.jpg",
    fees: "₹10,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "INDOS Copy"
    ],
    rating: 4.7,
    ratingCount: 95
  },

  // Advanced Courses
  {
    id: "mfa",
    code: "MFA",
    name: "Medical First Aid",
    description: "Intermediate medical training for seafarers to manage illnesses, administer dressings, treat shock, and coordinate offshore radio consultation.",
    duration: "4 Days",
    level: "Intermediate",
    icon: "🏥",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹10,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Fitness Certificate",
      "Basic Safety Training Certificate",
      "INDOS Copy"
    ],
    rating: 4.8,
    ratingCount: 142
  },
  {
    id: "aff",
    code: "AFF",
    name: "Advanced Fire Fighting",
    description: "Advanced firefighting command tactics, fire detection systems, gas-flooding layouts, structural fire stability, and search & rescue control.",
    duration: "5 Days",
    level: "Intermediate",
    icon: "🔥",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹16,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "Basic FPFF Certificate",
      "CDC Copy & Sea Service Proof"
    ],
    rating: 4.9,
    ratingCount: 215
  },
  {
    id: "pscrb",
    code: "PSCRB",
    name: "Proficiency in Survival Craft & Rescue Boats",
    description: "Command survival craft launch operations, handle marine rescue engines, coordinate recovery operations, and administer first aid.",
    duration: "5 Days",
    level: "Intermediate",
    icon: "🚤",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹18,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "Basic PST Certificate",
      "Sea Service Experience Certificate"
    ],
    rating: 4.8,
    ratingCount: 174
  },
  {
    id: "sso",
    code: "SSO",
    name: "Ship Security Officer",
    description: "Advanced ship security command, ship security surveys, risk audits, crew weapon awareness, and anti-piracy operations.",
    duration: "3 Days",
    level: "Advanced",
    icon: "🔒",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹20,000",
    documentsRequired: [
      "Passport Copy",
      "STSDSD Certificate",
      "CDC Copy with 12 months minimum sea service proof"
    ],
    rating: 4.9,
    ratingCount: 130
  },
  {
    id: "medicare",
    code: "MEDICARE",
    name: "Medical Care on Board Ships",
    description: "Advanced clinical diagnosis, injection procedures, minor surgical sutures, ship hospital sanitation, and life-support therapy.",
    duration: "5 Days",
    level: "Advanced",
    icon: "🏥",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹25,000",
    documentsRequired: [
      "Passport Copy",
      "MFA Certificate",
      "CDC Copy & 12 months sea service proof"
    ],
    rating: 5.0,
    ratingCount: 88
  },
  {
    id: "chemco",
    code: "CHEMCO",
    name: "Advanced Chemical Tanker Cargo Operations",
    description: "Specialized command training for chemical tanker cargo operations, cargo tank venting, slop tank monitoring, and chemical reactions control.",
    duration: "10 Days",
    level: "Advanced",
    icon: "🚢",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹30,000",
    documentsRequired: [
      "Passport Copy",
      "OCTCO Certificate",
      "Chemical Tanker Sea Service Record"
    ],
    rating: 4.9,
    ratingCount: 75
  },
  {
    id: "gasco",
    code: "GASCO",
    name: "Advanced Gas Tanker Cargo Operations",
    description: "Specialized liquefied gas cargo control, compressor operations, reliquefaction systems, boil-off gas handling, and emergency containment.",
    duration: "10 Days",
    level: "Advanced",
    icon: "🚢",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹30,000",
    documentsRequired: [
      "Passport Copy",
      "GTFC Certificate",
      "Gas Tanker Sea Service Record"
    ],
    rating: 4.8,
    ratingCount: 64
  },
  {
    id: "tasco",
    code: "TASCO",
    name: "Advanced Oil Tanker Cargo Operations",
    description: "Advanced crude oil washing, inert gas systems, oil tank venting, discharge monitoring systems, and spill response controls.",
    duration: "10 Days",
    level: "Advanced",
    icon: "🚢",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹30,000",
    documentsRequired: [
      "Passport Copy",
      "OCTCO Certificate",
      "Oil Tanker Sea Service Record"
    ],
    rating: 4.9,
    ratingCount: 92
  },
  {
    id: "frb",
    code: "FRB",
    name: "Fast Rescue Boat",
    description: "Specialized launching, maneuvering, and sea-rescue operations under adverse weather conditions for Fast Rescue Boats.",
    duration: "2 Days",
    level: "Advanced",
    icon: "🚤",
    category: "advanced",
    image: "/images/courses/advanced_navigation.jpg",
    fees: "₹18,000",
    documentsRequired: [
      "Passport Copy",
      "PSCRB Certificate",
      "Medical fitness certificate"
    ],
    rating: 4.7,
    ratingCount: 45
  },

  // Refresher Courses
  {
    id: "rpst",
    code: "RPST",
    name: "Refresher Personal Survival Techniques",
    description: "Refresher drill validation for launching survival crafts, donning life jackets, and executing marine rescue actions.",
    duration: "1 Day",
    level: "Renewal",
    icon: "🔄",
    category: "refresher",
    image: "/images/courses/firefighting_drill.jpg",
    fees: "₹8,000",
    documentsRequired: [
      "Passport Copy",
      "Previous PST Certificate",
      "Valid Medical Certificate",
      "Sea Service proof"
    ],
    rating: 4.8,
    ratingCount: 210
  },
  {
    id: "rfpff",
    code: "RFPFF",
    name: "Refresher Fire Prevention & Fire Fighting",
    description: "Refresher drill validation for shipboard fire teams, structural smoke navigation, and fire pump operations.",
    duration: "1 Day",
    level: "Renewal",
    icon: "🔥",
    category: "refresher",
    image: "/images/courses/firefighting_drill.jpg",
    fees: "₹6,000",
    documentsRequired: [
      "Passport Copy",
      "Previous FPFF Certificate",
      "Medical Certificate",
      "Sea Service proof"
    ],
    rating: 4.9,
    ratingCount: 260
  },
  {
    id: "rpscrb",
    code: "RPSCRB",
    name: "Refresher Survival Craft & Rescue Boats",
    description: "Refresher training on rescue boat handling, release hooks control, and water survival drills.",
    duration: "1 Day",
    level: "Renewal",
    icon: "🚤",
    category: "refresher",
    image: "/images/courses/firefighting_drill.jpg",
    fees: "₹7,000",
    documentsRequired: [
      "Passport Copy",
      "Previous PSCRB Certificate",
      "Medical Certificate",
      "Sea Service proof"
    ],
    rating: 4.8,
    ratingCount: 145
  },
  {
    id: "raff",
    code: "RAFF",
    name: "Refresher Advanced Fire Fighting",
    description: "Refresher training on fixed firefighting systems, team coordination, and hazardous cargo smoke drills.",
    duration: "1 Day",
    level: "Renewal",
    icon: "🔥",
    category: "refresher",
    image: "/images/courses/firefighting_drill.jpg",
    fees: "₹8,000",
    documentsRequired: [
      "Passport Copy",
      "Previous AFF Certificate",
      "Medical Certificate",
      "Sea Service proof"
    ],
    rating: 4.9,
    ratingCount: 165
  },
  {
    id: "rmfa",
    code: "RMFA",
    name: "Refresher Medical First Aid",
    description: "Refresher training for seafarers to renew their primary first aid certification.",
    duration: "1 Day",
    level: "Renewal",
    icon: "🏥",
    category: "refresher",
    image: "/images/courses/firefighting_drill.jpg",
    fees: "₹5,000",
    documentsRequired: [
      "Passport Copy",
      "Previous MFA Certificate",
      "Medical Certificate"
    ],
    rating: 4.8,
    ratingCount: 78
  },
  {
    id: "rmedicare",
    code: "R-MEDICARE",
    name: "Refresher Medical Care",
    description: "Refresher training for officers in charge of onboard medical treatment, updating diagnostic and treatment standards.",
    duration: "1 Day",
    level: "Renewal",
    icon: "🏥",
    category: "refresher",
    image: "/images/courses/firefighting_drill.jpg",
    fees: "₹15,000",
    documentsRequired: [
      "Passport Copy",
      "Previous MEDICARE Certificate",
      "Medical Certificate",
      "Sea Service proof"
    ],
    rating: 4.9,
    ratingCount: 52
  },
  {
    id: "rucdeck",
    code: "RUC-DECK",
    name: "Refresher Upgrading Course for Deck Officers",
    description: "Management and Operational level refresher upgrading course for deck officers to align with latest DGS/IMO regulations.",
    duration: "5 Days",
    level: "Professional",
    icon: "⚓",
    category: "refresher",
    image: "/images/courses/firefighting_drill.jpg",
    fees: "₹25,000",
    documentsRequired: [
      "Passport Copy",
      "Deck COC Copy",
      "CDC Copy & 6 months sea service proof"
    ],
    rating: 4.8,
    ratingCount: 104
  },

  // Additional Courses
  {
    id: "bigf",
    code: "B-IGF",
    name: "Basic IGF Code Training",
    description: "Basic training for ships subject to the IGF Code, focusing on safety operations on vessels utilizing low-flashpoint fuels.",
    duration: "5 Days",
    level: "Specialized",
    icon: "⛽",
    category: "additional",
    image: "/images/courses/tanker_cargo_operations.jpg",
    fees: "₹20,000",
    documentsRequired: [
      "Passport Copy",
      "Medical Certificate",
      "Basic Safety Training Certificate"
    ],
    rating: 4.9,
    ratingCount: 88
  },
  {
    id: "aigf",
    code: "A-IGF",
    name: "Advanced IGF Code Training",
    description: "Advanced training for personnel on board vessels subject to the IGF Code, covering engineering operations of low-flashpoint fuels.",
    duration: "5 Days",
    level: "Advanced",
    icon: "🔥",
    category: "additional",
    image: "/images/courses/tanker_cargo_operations.jpg",
    fees: "₹25,000",
    documentsRequired: [
      "Passport Copy",
      "Basic IGF Certificate",
      "Gas/Chemical Tanker Sea Service proof"
    ],
    rating: 4.8,
    ratingCount: 76
  },
  {
    id: "vict",
    code: "VICT",
    name: "Vertical Integration Course for Trainers",
    description: "Pedagogy course for trainers and instructors at maritime institutes, teaching IMO model course standards.",
    duration: "10 Days",
    level: "Technical",
    icon: "🔍",
    category: "additional",
    image: "/images/courses/tanker_cargo_operations.jpg",
    fees: "₹20,000",
    documentsRequired: [
      "Passport Copy",
      "COC or equivalent educational qualification",
      "Sea Service proof (if applicable)"
    ],
    rating: 4.9,
    ratingCount: 110
  },
  {
    id: "hvs",
    code: "HVS",
    name: "High Voltage Safety",
    description: "Operational and Management level high voltage safety training covering insulation testing, lock-out procedures, and electrical busbar layouts.",
    duration: "5 Days",
    level: "Specialized",
    icon: "⚡",
    category: "additional",
    image: "/images/courses/tanker_cargo_operations.jpg",
    fees: "₹18,000",
    documentsRequired: [
      "Passport Copy",
      "Marine Engineering Degree/Diploma",
      "INDOS Copy"
    ],
    rating: 4.9,
    ratingCount: 125
  },
  {
    id: "cso",
    code: "CSO",
    name: "Company Security Officer",
    description: "Training for company-level personnel to administer company security plans and conduct audits on vessels.",
    duration: "5 Days",
    level: "Management",
    icon: "🏢",
    category: "additional",
    image: "/images/courses/tanker_cargo_operations.jpg",
    fees: "₹28,000",
    documentsRequired: [
      "Passport Copy",
      "Security Training Background",
      "Company authorization letter"
    ],
    rating: 4.8,
    ratingCount: 65
  },
  {
    id: "mbs",
    code: "MBS",
    name: "Maritime Bridge Simulation",
    description: "Radar navigation, ARPA operation, bridge teamwork simulation, and electronic chart display information systems (ECDIS).",
    duration: "5 Days",
    level: "Technical",
    icon: "🎮",
    category: "additional",
    image: "/images/courses/tanker_cargo_operations.jpg",
    fees: "₹35,000",
    documentsRequired: [
      "Passport Copy",
      "Deck COC Copy",
      "INDOS Copy"
    ],
    rating: 4.9,
    ratingCount: 140
  }
];
