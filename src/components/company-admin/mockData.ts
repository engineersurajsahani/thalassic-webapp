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
  status: "Pending" | "Approved" | "Rejected" | "Expiring";
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

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

export const mockCoursesCatalog = [
  { id: "c1", code: "STCW-BST", name: "Basic Safety Training (BST)", category: "Safety", duration: "5 Days" },
  { id: "c2", code: "STCW-AFF", name: "Advanced Fire Fighting (AFF)", category: "Safety", duration: "3 Days" },
  { id: "c3", code: "STCW-MFA", name: "Medical First Aid (MFA)", category: "Medical", duration: "3 Days" },
  { id: "c4", code: "STCW-GMDSS", name: "GMDSS General Operator Certificate", category: "Communication", duration: "12 Days" },
  { id: "c5", code: "STCW-BRM", name: "Bridge Resource Management (BRM)", category: "Navigation", duration: "5 Days" },
  { id: "c6", code: "STCW-ERM", name: "Engine Room Resource Management (ERM)", category: "Engineering", duration: "5 Days" },
  { id: "c7", code: "STCW-SDSD", name: "Security Duties (SDSD)", category: "Security", duration: "2 Days" },
];

export const mockSeafarers: Seafarer[] = [
  {
    id: "sf1",
    name: "Capt. Rajesh Kumar",
    rank: "Master",
    email: "rajesh.kumar@thalassic.in",
    phone: "+91 98765 43210",
    status: "Active",
    department: "Deck",
    indosNumber: "15GL2849",
    dob: "1978-05-14",
    nationality: "Indian",
    address: "Flat 402, Sea Breeze Apts, Bandra West, Mumbai, India",
    courses: [
      { id: "cp1", code: "STCW-BST", name: "Basic Safety Training (BST)", progress: 100, status: "Completed", assignedDate: "2024-01-10", expiryDate: "2029-01-09" },
      { id: "cp2", code: "STCW-GMDSS", name: "GMDSS General Operator Certificate", progress: 100, status: "Completed", assignedDate: "2023-06-15", expiryDate: "2028-06-14" },
      { id: "cp3", code: "STCW-BRM", name: "Bridge Resource Management (BRM)", progress: 45, status: "In Progress", assignedDate: "2026-06-01" },
    ],
    documents: [
      { id: "doc1", name: "Certificate of Competency (CoC)", type: "CoC", status: "Approved", issueDate: "2022-08-10", expiryDate: "2027-08-09", previewUrl: "/mock-pdf-placeholder.png" },
      { id: "doc2", name: "Seaman Book (CDC)", type: "CDC", status: "Approved", issueDate: "2023-04-12", expiryDate: "2033-04-11", previewUrl: "/mock-pdf-placeholder.png" },
      { id: "doc3", name: "Passport", type: "Passport", status: "Approved", issueDate: "2020-11-20", expiryDate: "2030-11-19", previewUrl: "/mock-pdf-placeholder.png" },
      { id: "doc4", name: "Medical Certificate (ENG1)", type: "Medical", status: "Expiring", issueDate: "2024-09-01", expiryDate: "2026-08-31", previewUrl: "/mock-pdf-placeholder.png" },
    ],
    seaService: [
      { id: "ss1", vesselName: "Thalassic Wave", vesselType: "Crude Oil Tanker", rank: "Master", signOn: "2025-01-15", signOff: "2025-06-15", duration: 151 },
      { id: "ss2", vesselName: "Pacific Ocean", vesselType: "Container Vessel", rank: "Chief Mate", signOn: "2024-03-01", signOff: "2024-09-01", duration: 184 },
    ]
  },
  {
    id: "sf2",
    name: "Amit Patel",
    rank: "Chief Engineer",
    email: "amit.patel@thalassic.in",
    phone: "+91 91234 56789",
    status: "Active",
    department: "Engine",
    indosNumber: "12EN4532",
    dob: "1981-11-23",
    nationality: "Indian",
    address: "712, Sun N Sand Residency, Satellite, Ahmedabad, India",
    courses: [
      { id: "cp4", code: "STCW-BST", name: "Basic Safety Training (BST)", progress: 100, status: "Completed", assignedDate: "2024-02-15", expiryDate: "2029-02-14" },
      { id: "cp5", code: "STCW-ERM", name: "Engine Room Resource Management (ERM)", progress: 100, status: "Completed", assignedDate: "2025-05-10", expiryDate: "2030-05-09" },
    ],
    documents: [
      { id: "doc5", name: "Chief Engineer CoC", type: "CoC", status: "Approved", issueDate: "2023-01-15", expiryDate: "2028-01-14", previewUrl: "/mock-pdf-placeholder.png" },
      { id: "doc6", name: "Passport", type: "Passport", status: "Pending", issueDate: "2026-06-01", expiryDate: "2036-05-31", previewUrl: "/mock-pdf-placeholder.png" },
    ],
    seaService: [
      { id: "ss3", vesselName: "Thalassic Titan", vesselType: "Bulk Carrier", rank: "Chief Engineer", signOn: "2025-07-01", signOff: "2025-12-28", duration: 180 },
    ]
  },
  {
    id: "sf3",
    name: "Vikram Singh",
    rank: "Chief Officer",
    email: "vikram.singh@thalassic.in",
    phone: "+91 98989 89898",
    status: "Pending",
    department: "Deck",
    indosNumber: "18GL9482",
    dob: "1987-03-08",
    nationality: "Indian",
    address: "House 24, Sector 15, Chandigarh, India",
    courses: [
      { id: "cp6", code: "STCW-BST", name: "Basic Safety Training (BST)", progress: 0, status: "Not Started", assignedDate: "2026-07-01" },
    ],
    documents: [
      { id: "doc7", name: "Chief Mate CoC", type: "CoC", status: "Pending", issueDate: "2024-05-20", expiryDate: "2029-05-19", previewUrl: "/mock-pdf-placeholder.png" },
      { id: "doc8", name: "Passport", type: "Passport", status: "Approved", issueDate: "2018-12-10", expiryDate: "2028-12-09", previewUrl: "/mock-pdf-placeholder.png" },
      { id: "doc9", name: "Medical ENG1", type: "Medical", status: "Rejected", issueDate: "2025-05-01", expiryDate: "2025-12-01", previewUrl: "/mock-pdf-placeholder.png", rejectionReason: "Medical certificate format not standard or stamp missing." },
    ],
    seaService: []
  },
  {
    id: "sf4",
    name: "Sandeep Nair",
    rank: "Second Engineer",
    email: "sandeep.nair@thalassic.in",
    phone: "+91 88888 77777",
    status: "Inactive",
    department: "Engine",
    indosNumber: "14EN9012",
    dob: "1985-08-30",
    nationality: "Indian",
    address: "Nair Bhavan, Kaloor, Kochi, Kerala, India",
    courses: [
      { id: "cp7", code: "STCW-BST", name: "Basic Safety Training (BST)", progress: 100, status: "Expired", assignedDate: "2021-04-10", expiryDate: "2026-04-09" },
    ],
    documents: [
      { id: "doc10", name: "Second Engineer CoC", type: "CoC", status: "Approved", issueDate: "2021-06-15", expiryDate: "2026-06-14", previewUrl: "/mock-pdf-placeholder.png" },
    ],
    seaService: []
  },
  {
    id: "sf5",
    name: "Neha Sharma",
    rank: "Safety Officer",
    email: "neha.sharma@thalassic.in",
    phone: "+91 99009 90099",
    status: "Active",
    department: "Safety",
    indosNumber: "20SF8473",
    dob: "1992-02-18",
    nationality: "Indian",
    address: "Block C-3, Greenwood Society, Noida, India",
    courses: [
      { id: "cp8", code: "STCW-BST", name: "Basic Safety Training (BST)", progress: 100, status: "Completed", assignedDate: "2025-01-20", expiryDate: "2030-01-19" },
      { id: "cp9", code: "STCW-AFF", name: "Advanced Fire Fighting (AFF)", progress: 100, status: "Completed", assignedDate: "2025-02-05", expiryDate: "2030-02-04" },
    ],
    documents: [
      { id: "doc11", name: "Passport", type: "Passport", status: "Approved", issueDate: "2022-03-01", expiryDate: "2032-02-28", previewUrl: "/mock-pdf-placeholder.png" },
      { id: "doc12", name: "Medical Certificate", type: "Medical", status: "Approved", issueDate: "2025-06-10", expiryDate: "2027-06-09", previewUrl: "/mock-pdf-placeholder.png" },
    ],
    seaService: [
      { id: "ss4", vesselName: "Thalassic Safety", vesselType: "LNG Carrier", rank: "Safety Officer", signOn: "2025-08-01", signOff: "2026-02-01", duration: 184 },
    ]
  }
];

export const mockTickets: SupportTicket[] = [
  {
    id: "TCK-102",
    subject: "Urgent Course Enrollment Assistance for Capt. Rajesh",
    status: "Open",
    priority: "High",
    category: "Course Management",
    assignedTo: "Customer Support Agent 1",
    createdAt: "2026-07-21T10:30:00Z",
    messages: [
      { id: "m1", sender: "Company Administrator", text: "We need to enroll Capt. Rajesh in the Bridge Resource Management refresher course today. However, the system is showing registration full. Please assist immediately as he sails in 5 days.", timestamp: "2026-07-21T10:30:00Z", isAgent: false },
      { id: "m2", sender: "Support Agent", text: "Hello! I am looking into this. We will check with the training center to see if we can accommodate an extra slot for Capt. Rajesh due to his upcoming sign-on date.", timestamp: "2026-07-21T11:15:00Z", isAgent: true }
    ]
  },
  {
    id: "TCK-095",
    subject: "CoC Verification Delay",
    status: "In Progress",
    priority: "Medium",
    category: "Verification",
    assignedTo: "Verification Team Lead",
    createdAt: "2026-07-19T14:22:00Z",
    messages: [
      { id: "m3", sender: "Company Administrator", text: "The Second Engineer CoC uploaded by Sandeep Nair has been pending verification for over 3 days. Is there an issue with the copy?", timestamp: "2026-07-19T14:22:00Z", isAgent: false },
      { id: "m4", sender: "Support Agent", text: "Apologies for the delay. We are waiting on a response from the Indian DG Shipping online portal to verify the authenticity code. We should have it cleared by tomorrow.", timestamp: "2026-07-20T09:00:00Z", isAgent: true }
    ]
  },
  {
    id: "TCK-084",
    subject: "Adding a new vessel to our company profile",
    status: "Closed",
    priority: "Low",
    category: "Profile Setup",
    assignedTo: "Database Admin",
    createdAt: "2026-07-10T11:00:00Z",
    messages: [
      { id: "m5", sender: "Company Administrator", text: "We recently acquired a new container vessel, the 'Thalassic Breeze'. Can we get this added to our list of eligible vessels for sea service logs?", timestamp: "2026-07-10T11:00:00Z", isAgent: false },
      { id: "m6", sender: "Support Agent", text: "This has been added to our database. You can now select 'Thalassic Breeze' when filing new sea service records.", timestamp: "2026-07-10T16:45:00Z", isAgent: true }
    ]
  }
];

export const mockRecentActivities: ActivityLog[] = [
  { id: "act1", seafarerName: "Capt. Rajesh Kumar", activity: "Completed STCW-GMDSS certification", timestamp: "2 hours ago", type: "course" },
  { id: "act2", seafarerName: "Amit Patel", activity: "Uploaded new Passport document", timestamp: "4 hours ago", type: "document" },
  { id: "act3", seafarerName: "Vikram Singh", activity: "Submitted Chief Mate CoC for verification", timestamp: "1 day ago", type: "document" },
  { id: "act4", seafarerName: "Sandeep Nair", activity: "Requested course renewal for STCW-BST", timestamp: "2 days ago", type: "support" },
  { id: "act5", seafarerName: "Neha Sharma", activity: "Signed on Thalassic Safety as Safety Officer", timestamp: "3 days ago", type: "profile" }
];

export const mockNotifications: NotificationAlert[] = [
  { id: "nt1", message: "Medical Certificate for Capt. Rajesh Kumar is expiring in 45 days.", type: "warning", timestamp: "1 hour ago" },
  { id: "nt2", message: "New support ticket TCK-102 created for urgent course enrollment.", type: "info", timestamp: "3 hours ago" },
  { id: "nt3", message: "Passport verification for Sandeep Nair is pending.", type: "warning", timestamp: "1 day ago" },
  { id: "nt4", message: "Course compliance for Thalassic Webapp is at 84% (+2.4% this week).", type: "success", timestamp: "2 days ago" }
];
