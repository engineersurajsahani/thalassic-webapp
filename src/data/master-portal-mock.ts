// Unified Master Portal Mock Dataset & Types according to PRD Chapter 1 & Chapter 2

export interface MockInstitute {
  id: string;
  name: string;
  code: string;
  idtNumber: string;
  approvalNumber: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  coursesOffered: string[]; // Course IDs
  associatedCompany?: string;
  activeBatches: number;
  totalCandidatesTrained: number;
  status: "active" | "pending" | "inactive";
  rating: number;
  accreditedSince: string;
}

export interface MockCourse {
  id: string;
  code: string;
  title: string;
  category: "Safety" | "Technical" | "Compliance" | "Operations";
  duration: string;
  price: number; // Hari Om Standard Price
  status: "Active" | "Draft" | "Inactive";
  rating: number;
  enrolledCount: number;
  associatedInstituteIds: string[]; // M:N relationship (PRD 1.10)
  description?: string;
}

export interface MockPartnerCoursePricing {
  courseId: string;
  courseTitle: string;
  hariomPrice: number; // Amount Payable to Hari Om
  suggestedSellingPrice: number;
  status: "Approved" | "Custom";
}

export interface MockPartner {
  id: string;
  name: string;
  agencyName: string;
  rpslNumber: string; // Maritime Recruitment & Placement License
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive" | "pending";
  joinedDate: string;
  lastActive: string;
  totalSeafarers: number;
  totalCoursePurchases: number;
  totalAmountPayable: number;
  totalAmountReceived: number;
  pendingAmount: number;
  assignedPricing: MockPartnerCoursePricing[];
}

export interface MockSeafarerPurchase {
  id: string;
  courseId: string;
  courseTitle: string;
  instituteId: string;
  instituteName: string;
  purchaseType: "Direct" | "Partner" | "Institute Billable";
  partnerId?: string;
  partnerName?: string;
  amountPayableToHariom: number;
  amountReceived: number;
  pendingAmount: number;
  status: "Completed" | "Pending" | "Refunded";
  invoiceNumber: string;
  paymentDate: string;
}

export interface MockSeafarerEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  instituteId: string;
  instituteName: string;
  batch: string;
  progressPercent: number;
  status: "Ongoing" | "Completed" | "On Hold";
  startDate: string;
  completionDate?: string;
}

export interface MockSeafarer {
  id: string;
  name: string;
  indosNumber: string;
  cdcNumber: string;
  passportNumber: string;
  email: string;
  phone: string;
  rank: string;
  nationality: string;
  sourceType: "Company" | "Partner" | "Direct";
  sourceName: string; // e.g., "Company - Anglo-Eastern Shipping", "Partner - Ocean Maritime Services"
  status: "Active" | "Ongoing" | "On Hold" | "Completed" | "Inactive"; // PRD 1.6
  createdDate: string;
  documents: {
    name: string;
    docNumber: string;
    validTill: string;
    verified: boolean;
  }[];
  purchases: MockSeafarerPurchase[];
  enrollments: MockSeafarerEnrollment[];
}

export interface MockPaymentRecord {
  id: string;
  seafarerId: string;
  seafarerName: string;
  indosNumber: string;
  courseId: string;
  courseTitle: string;
  purchaseType: "Direct" | "Partner" | "Institute Billable";
  partnerName: string; // "—" if Direct / Institute
  amountPayable: number;
  amountReceived: number;
  paymentStatus: "Received" | "Pending" | "Failed" | "Refunded";
  paymentDate: string;
  invoiceNumber: string;
  paymentMethod: string;
}

export interface MockPartnerSettlement {
  id: string;
  partnerId: string;
  partnerName: string;
  totalPayable: number;
  totalReceived: number;
  pendingAmount: number;
  settlementStatus: "Settled" | "Partially Settled" | "Pending";
  settlementDate: string;
  settlementReference: string; // UTR or Bank Ref #
  relatedPurchasesCount: number;
  purchases: {
    seafarerName: string;
    courseTitle: string;
    amount: number;
    date: string;
  }[];
}

export interface MockInstituteFinance {
  instituteId: string;
  instituteName: string;
  idtNumber: string;
  location: string;
  seafarerCount: number;
  coursePurchasesCount: number;
  coursesOfferedCount: number;
  amountPayable: number;
  amountReceived: number;
  pendingAmount: number;
  paymentStatus: "Settled" | "Partially Settled" | "Pending";
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_INSTITUTES: MockInstitute[] = [
  {
    id: "INST-001",
    name: "Anglo-Eastern Maritime Academy",
    code: "AEMA-KARJAT",
    idtNumber: "IDT-MH-1021",
    approvalNumber: "DGS-MTI-101/2021",
    location: "Karjat, Maharashtra",
    contactPerson: "Capt. K. S. Bhandari",
    email: "admissions@angloeasternacademy.com",
    phone: "+91 2148 226850",
    coursesOffered: ["CRS-01", "CRS-02", "CRS-03", "CRS-06"],
    associatedCompany: "Anglo-Eastern Group",
    activeBatches: 6,
    totalCandidatesTrained: 4820,
    status: "active",
    rating: 4.9,
    accreditedSince: "2009",
  },
  {
    id: "INST-002",
    name: "Hindustan Institute of Maritime Training",
    code: "HIMT-CHN",
    idtNumber: "IDT-TN-2045",
    approvalNumber: "DGS-MTI-204/2019",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Dr. Sanjeev S. Vakil",
    email: "training@himtmarine.com",
    phone: "+91 44 3010 3010",
    coursesOffered: ["CRS-01", "CRS-02", "CRS-04", "CRS-07"],
    associatedCompany: "HIMT Educational Trust",
    activeBatches: 8,
    totalCandidatesTrained: 9400,
    status: "active",
    rating: 4.8,
    accreditedSince: "1998",
  },
  {
    id: "INST-003",
    name: "Great Eastern Institute of Maritime Studies",
    code: "GEIMS-LON",
    idtNumber: "IDT-MH-3118",
    approvalNumber: "DGS-MTI-308/2020",
    location: "Lonavala, Maharashtra",
    contactPerson: "Capt. David L. Nazareth",
    email: "geims@greatship.com",
    phone: "+91 2114 266100",
    coursesOffered: ["CRS-01", "CRS-03", "CRS-05", "CRS-06"],
    associatedCompany: "Great Eastern Shipping Co.",
    activeBatches: 5,
    totalCandidatesTrained: 3950,
    status: "active",
    rating: 4.7,
    accreditedSince: "2006",
  },
  {
    id: "INST-004",
    name: "Samundra Institute of Maritime Studies",
    code: "SIMS-PUN",
    idtNumber: "IDT-MH-4092",
    approvalNumber: "DGS-MTI-412/2022",
    location: "Lonavala, Maharashtra",
    contactPerson: "Capt. Rajeev Nayyer",
    email: "admin@samundra.com",
    phone: "+91 2114 399500",
    coursesOffered: ["CRS-02", "CRS-04", "CRS-05", "CRS-08"],
    associatedCompany: "Executive Ship Management",
    activeBatches: 4,
    totalCandidatesTrained: 2840,
    status: "active",
    rating: 4.8,
    accreditedSince: "2005",
  },
  {
    id: "INST-005",
    name: "International Maritime Institute",
    code: "IMI-NOI",
    idtNumber: "IDT-UP-5184",
    approvalNumber: "DGS-MTI-501/2018",
    location: "Greater Noida, Uttar Pradesh",
    contactPerson: "Capt. D. C. Sekhar",
    email: "training@imi.edu.in",
    phone: "+91 120 232 6011",
    coursesOffered: ["CRS-01", "CRS-03", "CRS-07", "CRS-08"],
    associatedCompany: "IMI Global Education",
    activeBatches: 3,
    totalCandidatesTrained: 2180,
    status: "active",
    rating: 4.6,
    accreditedSince: "2001",
  },
];

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "CRS-01",
    code: "STCW-BST",
    title: "STCW Basic Safety Training",
    category: "Safety",
    duration: "5 days",
    price: 5000,
    status: "Active",
    rating: 4.8,
    enrolledCount: 412,
    associatedInstituteIds: ["INST-001", "INST-002", "INST-003", "INST-005"],
  },
  {
    id: "CRS-02",
    code: "STCW-AFF",
    title: "Advanced Fire Fighting (AFF)",
    category: "Safety",
    duration: "3 days",
    price: 7200,
    status: "Active",
    rating: 4.6,
    enrolledCount: 289,
    associatedInstituteIds: ["INST-001", "INST-002", "INST-004"],
  },
  {
    id: "CRS-03",
    code: "NAV-RADAR",
    title: "Ship Navigation & Radar Simulation",
    category: "Technical",
    duration: "7 days",
    price: 6800,
    status: "Active",
    rating: 4.7,
    enrolledCount: 194,
    associatedInstituteIds: ["INST-001", "INST-003", "INST-005"],
  },
  {
    id: "CRS-04",
    code: "LAW-MAR",
    title: "Maritime Law & Port State Control Compliance",
    category: "Compliance",
    duration: "2 days",
    price: 3200,
    status: "Active",
    rating: 4.5,
    enrolledCount: 137,
    associatedInstituteIds: ["INST-002", "INST-004"],
  },
  {
    id: "CRS-05",
    code: "OPS-TANK",
    title: "Tanker Cargo Handling & Safety Operations",
    category: "Operations",
    duration: "4 days",
    price: 9400,
    status: "Active",
    rating: 4.9,
    enrolledCount: 98,
    associatedInstituteIds: ["INST-003", "INST-004"],
  },
  {
    id: "CRS-06",
    code: "ENG-SIM",
    title: "Engine Room Resource Management & Simulator",
    category: "Technical",
    duration: "6 days",
    price: 8100,
    status: "Active",
    rating: 4.4,
    enrolledCount: 203,
    associatedInstituteIds: ["INST-001", "INST-003"],
  },
  {
    id: "CRS-07",
    code: "MED-FIRST",
    title: "Medical First Aid at Sea (MFA)",
    category: "Safety",
    duration: "3 days",
    price: 4500,
    status: "Active",
    rating: 4.7,
    enrolledCount: 321,
    associatedInstituteIds: ["INST-002", "INST-005"],
  },
  {
    id: "CRS-08",
    code: "CMP-CRISIS",
    title: "Crowd & Crisis Management",
    category: "Compliance",
    duration: "2 days",
    price: 3800,
    status: "Inactive",
    rating: 4.3,
    enrolledCount: 76,
    associatedInstituteIds: ["INST-004", "INST-005"],
  },
];

export const MOCK_PARTNERS: MockPartner[] = [
  {
    id: "PRT-001",
    name: "Ocean Maritime Recruitment",
    agencyName: "Ocean Maritime Services Pvt Ltd",
    rpslNumber: "RPSL-MUM-482",
    contactPerson: "Capt. Rajiv K. Mehta",
    email: "crewing@oceanmaritime.in",
    phone: "+91 22 2261 9840",
    location: "Nariman Point, Mumbai",
    status: "active",
    joinedDate: "15 Jan 2024",
    lastActive: "10 mins ago",
    totalSeafarers: 84,
    totalCoursePurchases: 142,
    totalAmountPayable: 720000,
    totalAmountReceived: 610000,
    pendingAmount: 110000,
    assignedPricing: [
      { courseId: "CRS-01", courseTitle: "STCW Basic Safety Training", hariomPrice: 4600, suggestedSellingPrice: 5000, status: "Approved" },
      { courseId: "CRS-02", courseTitle: "Advanced Fire Fighting (AFF)", hariomPrice: 6500, suggestedSellingPrice: 7200, status: "Approved" },
      { courseId: "CRS-03", courseTitle: "Ship Navigation & Radar Simulation", hariomPrice: 6100, suggestedSellingPrice: 6800, status: "Approved" },
    ],
  },
  {
    id: "PRT-002",
    name: "SeaStar Global Manning",
    agencyName: "SeaStar Crewing Solutions LLP",
    rpslNumber: "RPSL-KOL-319",
    contactPerson: "Ms. Ananya Roy",
    email: "operations@seastarglobal.com",
    phone: "+91 33 2489 1100",
    location: "Salt Lake, Kolkata",
    status: "active",
    joinedDate: "03 Feb 2024",
    lastActive: "1 hour ago",
    totalSeafarers: 52,
    totalCoursePurchases: 89,
    totalAmountPayable: 450000,
    totalAmountReceived: 390000,
    pendingAmount: 60000,
    assignedPricing: [
      { courseId: "CRS-01", courseTitle: "STCW Basic Safety Training", hariomPrice: 4700, suggestedSellingPrice: 5000, status: "Approved" },
      { courseId: "CRS-06", courseTitle: "Engine Room Resource Management & Simulator", hariomPrice: 7400, suggestedSellingPrice: 8100, status: "Approved" },
    ],
  },
  {
    id: "PRT-003",
    name: "Pacific Nautical Agency",
    agencyName: "Pacific Nautical Crewing Agency",
    rpslNumber: "RPSL-CHN-194",
    contactPerson: "Capt. T. Sundar",
    email: "tsundar@pacificnautical.com",
    phone: "+91 44 2815 4420",
    location: "George Town, Chennai",
    status: "active",
    joinedDate: "22 Nov 2023",
    lastActive: "3 hours ago",
    totalSeafarers: 63,
    totalCoursePurchases: 97,
    totalAmountPayable: 510000,
    totalAmountReceived: 510000,
    pendingAmount: 0,
    assignedPricing: [
      { courseId: "CRS-02", courseTitle: "Advanced Fire Fighting (AFF)", hariomPrice: 6600, suggestedSellingPrice: 7200, status: "Approved" },
      { courseId: "CRS-07", courseTitle: "Medical First Aid at Sea (MFA)", hariomPrice: 4100, suggestedSellingPrice: 4500, status: "Approved" },
    ],
  },
  {
    id: "PRT-004",
    name: "Nautical Horizon Agencies",
    agencyName: "Nautical Horizon Manning Corp",
    rpslNumber: "RPSL-GOA-108",
    contactPerson: "Mr. Francisco Fernandes",
    email: "francisco@nauticalhorizon.com",
    phone: "+91 832 251 3390",
    location: "Vasco da Gama, Goa",
    status: "inactive",
    joinedDate: "11 Aug 2023",
    lastActive: "2 weeks ago",
    totalSeafarers: 19,
    totalCoursePurchases: 25,
    totalAmountPayable: 130000,
    totalAmountReceived: 95000,
    pendingAmount: 35000,
    assignedPricing: [
      { courseId: "CRS-01", courseTitle: "STCW Basic Safety Training", hariomPrice: 4800, suggestedSellingPrice: 5000, status: "Approved" },
    ],
  },
];

export const MOCK_SEAFARERS: MockSeafarer[] = [
  {
    id: "SF-1001",
    name: "Capt. Rajesh Kumar",
    indosNumber: "08GL1294",
    cdcNumber: "MUM-192847",
    passportNumber: "Z4829103",
    email: "rajesh.kumar@maritime.in",
    phone: "+91 98201 44521",
    rank: "Master Mariner",
    nationality: "Indian",
    sourceType: "Company",
    sourceName: "Company - ABC Shipping Ltd",
    status: "Active",
    createdDate: "12 Feb 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", docNumber: "MUM-192847", validTill: "18 Aug 2029", verified: true },
      { name: "STCW BST Certificate", docNumber: "BST-2022-819", validTill: "14 Jun 2027", verified: true },
      { name: "Medical Fitness Certificate", docNumber: "MED-DG-9921", validTill: "10 Jan 2026", verified: true },
    ],
    purchases: [
      {
        id: "PUR-101",
        courseId: "CRS-01",
        courseTitle: "STCW Basic Safety Training",
        instituteId: "INST-001",
        instituteName: "Anglo-Eastern Maritime Academy",
        purchaseType: "Direct",
        amountPayableToHariom: 5000,
        amountReceived: 5000,
        pendingAmount: 0,
        status: "Completed",
        invoiceNumber: "INV-2026-081",
        paymentDate: "12 Feb 2024",
      },
      {
        id: "PUR-102",
        courseId: "CRS-03",
        courseTitle: "Ship Navigation & Radar Simulation",
        instituteId: "INST-003",
        instituteName: "Great Eastern Institute of Maritime Studies",
        purchaseType: "Direct",
        amountPayableToHariom: 6800,
        amountReceived: 6800,
        pendingAmount: 0,
        status: "Completed",
        invoiceNumber: "INV-2026-095",
        paymentDate: "05 Apr 2024",
      },
    ],
    enrollments: [
      {
        id: "ENR-01",
        courseId: "CRS-01",
        courseTitle: "STCW Basic Safety Training",
        instituteId: "INST-001",
        instituteName: "Anglo-Eastern Maritime Academy",
        batch: "Batch #44",
        progressPercent: 100,
        status: "Completed",
        startDate: "15 Feb 2024",
        completionDate: "20 Feb 2024",
      },
      {
        id: "ENR-02",
        courseId: "CRS-03",
        courseTitle: "Ship Navigation & Radar Simulation",
        instituteId: "INST-003",
        instituteName: "Great Eastern Institute of Maritime Studies",
        batch: "Batch #19",
        progressPercent: 65,
        status: "Ongoing",
        startDate: "10 Apr 2024",
      },
    ],
  },
  {
    id: "SF-1002",
    name: "Vikram Malhotra",
    indosNumber: "12EL4501",
    cdcNumber: "KOL-283910",
    passportNumber: "T9281042",
    email: "v.malhotra@marinecrew.com",
    phone: "+91 94330 81294",
    rank: "Second Officer",
    nationality: "Indian",
    sourceType: "Partner",
    sourceName: "Partner - Ocean Maritime Recruitment",
    status: "Ongoing",
    createdDate: "04 Mar 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", docNumber: "KOL-283910", validTill: "02 Mar 2028", verified: true },
      { name: "Passport", docNumber: "T9281042", validTill: "19 Nov 2031", verified: true },
    ],
    purchases: [
      {
        id: "PUR-103",
        courseId: "CRS-02",
        courseTitle: "Advanced Fire Fighting (AFF)",
        instituteId: "INST-001",
        instituteName: "Anglo-Eastern Maritime Academy",
        purchaseType: "Partner",
        partnerId: "PRT-001",
        partnerName: "Ocean Maritime Recruitment",
        amountPayableToHariom: 6500,
        amountReceived: 6500,
        pendingAmount: 0,
        status: "Completed",
        invoiceNumber: "INV-2026-112",
        paymentDate: "04 Mar 2024",
      },
    ],
    enrollments: [
      {
        id: "ENR-03",
        courseId: "CRS-02",
        courseTitle: "Advanced Fire Fighting (AFF)",
        instituteId: "INST-001",
        instituteName: "Anglo-Eastern Maritime Academy",
        batch: "Batch #12",
        progressPercent: 45,
        status: "Ongoing",
        startDate: "08 Mar 2024",
      },
    ],
  },
  {
    id: "SF-1003",
    name: "Suresh Pillai",
    indosNumber: "09CL7820",
    cdcNumber: "CHN-492019",
    passportNumber: "R1029481",
    email: "suresh.pillai@seafarer.org",
    phone: "+91 98402 11928",
    rank: "Chief Engineer",
    nationality: "Indian",
    sourceType: "Partner",
    sourceName: "Partner - SeaStar Global Manning",
    status: "On Hold", // PRD 1.6
    createdDate: "18 Jan 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", docNumber: "CHN-492019", validTill: "25 May 2027", verified: true },
      { name: "Medical Fitness Certificate", docNumber: "MED-DG-7192", validTill: "14 Feb 2024", verified: false }, // expired medical
    ],
    purchases: [
      {
        id: "PUR-104",
        courseId: "CRS-06",
        courseTitle: "Engine Room Resource Management & Simulator",
        instituteId: "INST-003",
        instituteName: "Great Eastern Institute of Maritime Studies",
        purchaseType: "Partner",
        partnerId: "PRT-002",
        partnerName: "SeaStar Global Manning",
        amountPayableToHariom: 7400,
        amountReceived: 4000,
        pendingAmount: 3400,
        status: "Pending",
        invoiceNumber: "INV-2026-128",
        paymentDate: "18 Jan 2024",
      },
    ],
    enrollments: [
      {
        id: "ENR-04",
        courseId: "CRS-06",
        courseTitle: "Engine Room Resource Management & Simulator",
        instituteId: "INST-003",
        instituteName: "Great Eastern Institute of Maritime Studies",
        batch: "Batch #08",
        progressPercent: 30,
        status: "On Hold",
        startDate: "22 Jan 2024",
      },
    ],
  },
  {
    id: "SF-1004",
    name: "Amitabh Sen",
    indosNumber: "14DL8821",
    cdcNumber: "MUM-983210",
    passportNumber: "P8819203",
    email: "amitabh.sen@ships.com",
    phone: "+91 98112 39019",
    rank: "Electro-Technical Officer (ETO)",
    nationality: "Indian",
    sourceType: "Company",
    sourceName: "Company - Anglo-Eastern Shipping",
    status: "Completed",
    createdDate: "02 Dec 2023",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", docNumber: "MUM-983210", validTill: "10 Oct 2029", verified: true },
    ],
    purchases: [
      {
        id: "PUR-105",
        courseId: "CRS-01",
        courseTitle: "STCW Basic Safety Training",
        instituteId: "INST-002",
        instituteName: "Hindustan Institute of Maritime Training",
        purchaseType: "Direct",
        amountPayableToHariom: 5000,
        amountReceived: 5000,
        pendingAmount: 0,
        status: "Completed",
        invoiceNumber: "INV-2026-140",
        paymentDate: "02 Dec 2023",
      },
    ],
    enrollments: [
      {
        id: "ENR-05",
        courseId: "CRS-01",
        courseTitle: "STCW Basic Safety Training",
        instituteId: "INST-002",
        instituteName: "Hindustan Institute of Maritime Training",
        batch: "Batch #38",
        progressPercent: 100,
        status: "Completed",
        startDate: "05 Dec 2023",
        completionDate: "10 Dec 2023",
      },
    ],
  },
  {
    id: "SF-1005",
    name: "Naveen Fernandes",
    indosNumber: "15GL9012",
    cdcNumber: "GOA-192019",
    passportNumber: "K9182741",
    email: "naveen.f@goacrew.in",
    phone: "+91 83225 91823",
    rank: "Bosun",
    nationality: "Indian",
    sourceType: "Partner",
    sourceName: "Partner - Nautical Horizon Agencies",
    status: "Inactive",
    createdDate: "15 Oct 2023",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", docNumber: "GOA-192019", validTill: "11 Nov 2025", verified: true },
    ],
    purchases: [
      {
        id: "PUR-106",
        courseId: "CRS-07",
        courseTitle: "Medical First Aid at Sea (MFA)",
        instituteId: "INST-005",
        instituteName: "International Maritime Institute",
        purchaseType: "Partner",
        partnerId: "PRT-004",
        partnerName: "Nautical Horizon Agencies",
        amountPayableToHariom: 4100,
        amountReceived: 4100,
        pendingAmount: 0,
        status: "Completed",
        invoiceNumber: "INV-2026-155",
        paymentDate: "15 Oct 2023",
      },
    ],
    enrollments: [
      {
        id: "ENR-06",
        courseId: "CRS-07",
        courseTitle: "Medical First Aid at Sea (MFA)",
        instituteId: "INST-005",
        instituteName: "International Maritime Institute",
        batch: "Batch #11",
        progressPercent: 100,
        status: "Completed",
        startDate: "18 Oct 2023",
        completionDate: "21 Oct 2023",
      },
    ],
  },
];

export const MOCK_PAYMENTS: MockPaymentRecord[] = [
  {
    id: "PAY-2026-081",
    seafarerId: "SF-1001",
    seafarerName: "Capt. Rajesh Kumar",
    indosNumber: "08GL1294",
    courseId: "CRS-01",
    courseTitle: "STCW Basic Safety Training",
    purchaseType: "Direct",
    partnerName: "—",
    amountPayable: 5000,
    amountReceived: 5000,
    paymentStatus: "Received",
    paymentDate: "12 Feb 2024",
    invoiceNumber: "INV-2026-081",
    paymentMethod: "Bank Transfer / NEFT",
  },
  {
    id: "PAY-2026-095",
    seafarerId: "SF-1001",
    seafarerName: "Capt. Rajesh Kumar",
    indosNumber: "08GL1294",
    courseId: "CRS-03",
    courseTitle: "Ship Navigation & Radar Simulation",
    purchaseType: "Direct",
    partnerName: "—",
    amountPayable: 6800,
    amountReceived: 6800,
    paymentStatus: "Received",
    paymentDate: "05 Apr 2024",
    invoiceNumber: "INV-2026-095",
    paymentMethod: "Credit Card (Corporate)",
  },
  {
    id: "PAY-2026-112",
    seafarerId: "SF-1002",
    seafarerName: "Vikram Malhotra",
    indosNumber: "12EL4501",
    courseId: "CRS-02",
    courseTitle: "Advanced Fire Fighting (AFF)",
    purchaseType: "Partner",
    partnerName: "Ocean Maritime Recruitment",
    amountPayable: 6500,
    amountReceived: 6500,
    paymentStatus: "Received",
    paymentDate: "04 Mar 2024",
    invoiceNumber: "INV-2026-112",
    paymentMethod: "Partner Settlement Transfer",
  },
  {
    id: "PAY-2026-128",
    seafarerId: "SF-1003",
    seafarerName: "Suresh Pillai",
    indosNumber: "09CL7820",
    courseId: "CRS-06",
    courseTitle: "Engine Room Resource Management & Simulator",
    purchaseType: "Partner",
    partnerName: "SeaStar Global Manning",
    amountPayable: 7400,
    amountReceived: 4000,
    paymentStatus: "Pending",
    paymentDate: "18 Jan 2024",
    invoiceNumber: "INV-2026-128",
    paymentMethod: "Partner Ledger (Partial)",
  },
  {
    id: "PAY-2026-140",
    seafarerId: "SF-1004",
    seafarerName: "Amitabh Sen",
    indosNumber: "14DL8821",
    courseId: "CRS-01",
    courseTitle: "STCW Basic Safety Training",
    purchaseType: "Direct",
    partnerName: "—",
    amountPayable: 5000,
    amountReceived: 5000,
    paymentStatus: "Received",
    paymentDate: "02 Dec 2023",
    invoiceNumber: "INV-2026-140",
    paymentMethod: "UPI Gateway",
  },
  {
    id: "PAY-2026-155",
    seafarerId: "SF-1005",
    seafarerName: "Naveen Fernandes",
    indosNumber: "15GL9012",
    courseId: "CRS-07",
    courseTitle: "Medical First Aid at Sea (MFA)",
    purchaseType: "Partner",
    partnerName: "Nautical Horizon Agencies",
    amountPayable: 4100,
    amountReceived: 4100,
    paymentStatus: "Received",
    paymentDate: "15 Oct 2023",
    invoiceNumber: "INV-2026-155",
    paymentMethod: "Partner Settlement Transfer",
  },
  {
    id: "PAY-2026-162",
    seafarerId: "SF-1002",
    seafarerName: "Vikram Malhotra",
    indosNumber: "12EL4501",
    courseId: "CRS-01",
    courseTitle: "STCW Basic Safety Training",
    purchaseType: "Partner",
    partnerName: "Ocean Maritime Recruitment",
    amountPayable: 4600,
    amountReceived: 0,
    paymentStatus: "Pending",
    paymentDate: "01 Sep 2026",
    invoiceNumber: "INV-2026-162",
    paymentMethod: "Pending Verification",
  },
  {
    id: "PAY-2026-175",
    seafarerId: "SF-1002",
    seafarerName: "Vikram Malhotra",
    indosNumber: "12EL4501",
    courseId: "CRS-04",
    courseTitle: "Maritime Law & Port State Control Compliance",
    purchaseType: "Institute Billable",
    partnerName: "Anglo-Eastern Maritime Academy",
    amountPayable: 3200,
    amountReceived: 3200,
    paymentStatus: "Received",
    paymentDate: "18 Jun 2026",
    invoiceNumber: "INV-2026-175",
    paymentMethod: "Institute Monthly Invoicing",
  },
  {
    id: "PAY-2026-189",
    seafarerId: "SF-1004",
    seafarerName: "Ananya Sharma",
    indosNumber: "15DL9021",
    courseId: "CRS-07",
    courseTitle: "GMDSS General Operator Certificate (GOC)",
    purchaseType: "Institute Billable",
    partnerName: "Hindustan Institute of Maritime Training",
    amountPayable: 11500,
    amountReceived: 11500,
    paymentStatus: "Received",
    paymentDate: "29 Jul 2026",
    invoiceNumber: "INV-2026-189",
    paymentMethod: "Direct Institute Settlement",
  },
];

export const MOCK_PARTNER_SETTLEMENTS: MockPartnerSettlement[] = [
  {
    id: "SET-2026-001",
    partnerId: "PRT-001",
    partnerName: "Ocean Maritime Recruitment",
    totalPayable: 720000,
    totalReceived: 610000,
    pendingAmount: 110000,
    settlementStatus: "Partially Settled",
    settlementDate: "28 Aug 2026",
    settlementReference: "UTR-HDFC-9918237190",
    relatedPurchasesCount: 142,
    purchases: [
      { seafarerName: "Vikram Malhotra", courseTitle: "Advanced Fire Fighting (AFF)", amount: 6500, date: "04 Mar 2024" },
      { seafarerName: "Vikram Malhotra", courseTitle: "STCW Basic Safety Training", amount: 4600, date: "01 Sep 2026" },
      { seafarerName: "K. R. Varma", courseTitle: "Ship Navigation & Radar Simulation", amount: 6100, date: "15 Aug 2026" },
      { seafarerName: "Arjun Nair", courseTitle: "STCW Basic Safety Training", amount: 4600, date: "20 Aug 2026" },
    ],
  },
  {
    id: "SET-2026-002",
    partnerId: "PRT-002",
    partnerName: "SeaStar Global Manning",
    totalPayable: 450000,
    totalReceived: 390000,
    pendingAmount: 60000,
    settlementStatus: "Partially Settled",
    settlementDate: "15 Aug 2026",
    settlementReference: "UTR-ICIC-4820194812",
    relatedPurchasesCount: 89,
    purchases: [
      { seafarerName: "Suresh Pillai", courseTitle: "Engine Room Resource Management & Simulator", amount: 7400, date: "18 Jan 2024" },
      { seafarerName: "R. Mukherjee", courseTitle: "STCW Basic Safety Training", amount: 4700, date: "10 Aug 2026" },
    ],
  },
  {
    id: "SET-2026-003",
    partnerId: "PRT-003",
    partnerName: "Pacific Nautical Agency",
    totalPayable: 510000,
    totalReceived: 510000,
    pendingAmount: 0,
    settlementStatus: "Settled",
    settlementDate: "02 Sep 2026",
    settlementReference: "UTR-SBI-1092837482",
    relatedPurchasesCount: 97,
    purchases: [
      { seafarerName: "G. Venkatesh", courseTitle: "Medical First Aid at Sea (MFA)", amount: 4100, date: "25 Aug 2026" },
      { seafarerName: "M. Balaji", courseTitle: "Advanced Fire Fighting (AFF)", amount: 6600, date: "28 Aug 2026" },
    ],
  },
  {
    id: "SET-2026-004",
    partnerId: "PRT-004",
    partnerName: "Nautical Horizon Agencies",
    totalPayable: 130000,
    totalReceived: 95000,
    pendingAmount: 35000,
    settlementStatus: "Pending",
    settlementDate: "10 Jul 2026",
    settlementReference: "UTR-AXIS-8291093481",
    relatedPurchasesCount: 25,
    purchases: [
      { seafarerName: "Naveen Fernandes", courseTitle: "Medical First Aid at Sea (MFA)", amount: 4100, date: "15 Oct 2023" },
      { seafarerName: "Peter D'Souza", courseTitle: "STCW Basic Safety Training", amount: 4800, date: "02 Jul 2026" },
    ],
  },
];

export const MOCK_INSTITUTE_FINANCE: MockInstituteFinance[] = [
  {
    instituteId: "INST-001",
    instituteName: "Anglo-Eastern Maritime Academy",
    idtNumber: "IDT-MH-1021",
    location: "Karjat, Maharashtra",
    seafarerCount: 412,
    coursePurchasesCount: 520,
    coursesOfferedCount: 4,
    amountPayable: 1480000,
    amountReceived: 1390000,
    pendingAmount: 90000,
    paymentStatus: "Partially Settled",
  },
  {
    instituteId: "INST-002",
    instituteName: "Hindustan Institute of Maritime Training",
    idtNumber: "IDT-TN-2045",
    location: "Chennai, Tamil Nadu",
    seafarerCount: 610,
    coursePurchasesCount: 780,
    coursesOfferedCount: 4,
    amountPayable: 1950000,
    amountReceived: 1950000,
    pendingAmount: 0,
    paymentStatus: "Settled",
  },
  {
    instituteId: "INST-003",
    instituteName: "Great Eastern Institute of Maritime Studies",
    idtNumber: "IDT-MH-3118",
    location: "Lonavala, Maharashtra",
    seafarerCount: 280,
    coursePurchasesCount: 360,
    coursesOfferedCount: 4,
    amountPayable: 1120000,
    amountReceived: 980000,
    pendingAmount: 140000,
    paymentStatus: "Partially Settled",
  },
  {
    instituteId: "INST-004",
    instituteName: "Samundra Institute of Maritime Studies",
    idtNumber: "IDT-MH-4092",
    location: "Lonavala, Maharashtra",
    seafarerCount: 190,
    coursePurchasesCount: 240,
    coursesOfferedCount: 4,
    amountPayable: 750000,
    amountReceived: 750000,
    pendingAmount: 0,
    paymentStatus: "Settled",
  },
  {
    instituteId: "INST-005",
    instituteName: "International Maritime Institute",
    idtNumber: "IDT-UP-5184",
    location: "Greater Noida, Uttar Pradesh",
    seafarerCount: 140,
    coursePurchasesCount: 180,
    coursesOfferedCount: 4,
    amountPayable: 540000,
    amountReceived: 460000,
    pendingAmount: 80000,
    paymentStatus: "Pending",
  },
];
