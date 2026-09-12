// Unified Master Portal Dataset & Types according to PRD Chapter 1 & Chapter 2

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
// DATA ARRAYS (Empty state ready for live/backend data)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_INSTITUTES: MockInstitute[] = [];

export const MOCK_COURSES: MockCourse[] = [];

export const MOCK_PARTNERS: MockPartner[] = [];

export const MOCK_SEAFARERS: MockSeafarer[] = [];

export const MOCK_PAYMENTS: MockPaymentRecord[] = [];

export const MOCK_PARTNER_SETTLEMENTS: MockPartnerSettlement[] = [];

export const MOCK_INSTITUTE_FINANCE: MockInstituteFinance[] = [];
