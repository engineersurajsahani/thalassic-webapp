export interface CourseProgress {
  id: string;
  code: string;
  name: string;
  progress: number; // 0 to 100
  status: "Completed" | "In Progress" | "Not Started" | "Expired";
  assignedDate: string;
  expiryDate?: string;
}

export interface SeafarerDocument {
  id: string;
  name: string;
  type: string; // e.g., "Passport", "CoC", "STCW"
  status: "Pending" | "Approved" | "Rejected" | "Expired" | "Expiring";
  issueDate: string;
  expiryDate: string;
  previewUrl?: string;
  rejectionReason?: string;
}

export interface SeaServiceRecord {
  id: string;
  vesselName: string;
  vesselType: string;
  rank: string;
  signOn: string;
  signOff: string;
  duration: number; // in days
}

export interface Seafarer {
  id: string;
  name: string;
  rank: string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Inactive";
  department: "Deck" | "Engine" | "Galley" | "Safety";
  indosNumber: string;
  dob: string;
  nationality: string;
  address: string;
  profilePicture?: string;
  courses: CourseProgress[];
  documents: SeafarerDocument[];
  seaService: SeaServiceRecord[];
}

export interface SupportMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isAgent: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "Open" | "In Progress" | "Closed";
  priority: "Low" | "Medium" | "High";
  category: string;
  assignedTo: string;
  createdAt: string;
  messages: SupportMessage[];
}

export interface ActivityLog {
  id: string;
  seafarerName: string;
  activity: string;
  timestamp: string;
  type: "document" | "course" | "profile" | "support";
}

export interface NotificationAlert {
  id: string;
  message: string;
  type: "warning" | "info" | "success" | "danger";
  timestamp: string;
}

export interface CourseCatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  duration: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA ARRAYS (Empty state ready for live/backend data)
// ─────────────────────────────────────────────────────────────────────────────

export const mockCoursesCatalog: CourseCatalogItem[] = [];

export const mockSeafarers: Seafarer[] = [];

export const mockTickets: SupportTicket[] = [];

export const mockRecentActivities: ActivityLog[] = [];

export const mockNotifications: NotificationAlert[] = [];

export interface PaymentRecord {
  id: string;
  seafarerId: string;
  seafarerName: string;
  course: string;
  instituteId: string;
  instituteName: string;
  amount: number;
  amountReceived?: number;
  status: "Paid" | "Pending" | "Overdue" | "Partial";
  method: string;
  date: string;
  txnId: string;
  invoiceNumber?: string;
  purchaseType?: string;
}

export const mockPayments: PaymentRecord[] = [];
