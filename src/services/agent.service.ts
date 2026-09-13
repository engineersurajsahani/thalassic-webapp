import { api } from "@/lib/axios";

// ISSUE-012/013: Remove fallback data - services should only return API data or throw errors
// TypeScript interfaces for type safety (ISSUE-056)

export interface AgentDashboard {
  totalPurchases: number;
  pendingPurchases: number;
  totalPayable: number;
  amountSettled: number;
  outstandingAmount: number;
  pendingSettlements: number;
  recentPurchases: Purchase[];
  recentSettlements: Settlement[];
}

export interface Purchase {
  id: string;
  seafarerId: string;
  seafarerName: string;
  indosNumber: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  payableAmount: number;
  purchaseDate: string;
  purchaseStatus: string;
  settlementStatus: string;
  trainingType: string;
  purchaseSource: string;
}

export interface Seafarer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  birthPlace: string;
  nationality: string;
  passportNum: string;
  indosNum: string;
  cdcNum: string;
  hasHariOmAccount: boolean;
  purchaseHistory: { courseName: string; purchaseDate: string; channel: string; status: string }[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  duration: string;
  standardFee: number;
  payableAmount: number;
  trainingType: string;
  description: string;
}

export interface CoursePricing {
  courseId: string;
  courseCode: string;
  courseName: string;
  standardFee: number;
  payableAmount: number;
  currency: string;
  trainingType: string;
}

export interface Financial {
  totalPayable: number;
  amountSettled: number;
  outstandingAmount: number;
  settlementHistory: Settlement[];
}

export interface Settlement {
  id: string;
  settlement_number: string;
  status: string;
  reference_number: string;
  payment_method: string;
  total_amount: number;
  purchase_count: number;
  message?: string;
}

export interface PartnerMetadata {
  onboarding_status: string;
  referral_code: string;
}

export interface PartnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  agencyName: string;
  status: string;
}

export interface Commission {
  id: string;
  agentName: string;
  seafarerName: string;
  courseName: string;
  courseFee: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  replies?: { message: string; createdAt: string }[];
}

export interface ReferralLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  agent_id?: string;
  created_at: string;
}

export const agentService = {
  // --- Dashboard ---
  async getDashboard(): Promise<AgentDashboard> {
    // ISSUE-012: Remove fallback - throw error if API fails
    const response = await api.get("/partner/dashboard");
    return response.data;
  },

  // --- Seafarer Master Identity & Search ---
  async searchSeafarers(query?: string): Promise<Seafarer[]> {
    const params = query ? { params: { q: query } } : {};
    const response = await api.get("/partner/seafarers/search", params);
    return response.data;
  },

  async getSeafarers(query?: string): Promise<Seafarer[]> {
    const params = query ? { params: { q: query } } : {};
    const response = await api.get("/partner/seafarers", params);
    return response.data;
  },

  async getSeafarerById(id: string): Promise<Seafarer> {
    const response = await api.get(`/partner/seafarers/${id}`);
    return response.data;
  },

  async createSeafarer(seafarerData: { name: string; email: string; phone: string; passportNum?: string; indosNum?: string; cdcNum?: string }): Promise<{ id: string; name: string; email: string; message: string }> {
    const response = await api.post("/partner/seafarers", seafarerData);
    return response.data;
  },

  // --- Courses & Partner Pricing ---
  async getCourses(): Promise<Course[]> {
    const response = await api.get("/partner/courses");
    return response.data;
  },

  async getCoursePricing(courseId: string): Promise<CoursePricing> {
    const response = await api.get(`/partner/pricing/${courseId}`);
    return response.data;
  },

  // --- Purchases & Physical Course Enrollment ---
  async createPurchase(purchaseData: { seafarerId: string; courseId: string }): Promise<Purchase> {
    const response = await api.post("/partner/purchases", purchaseData);
    return response.data;
  },

  async getPurchases(): Promise<Purchase[]> {
    const response = await api.get("/partner/purchases");
    return response.data;
  },

  async getPurchaseById(id: string): Promise<Purchase> {
    const response = await api.get(`/partner/purchases/${id}`);
    return response.data;
  },

  // --- Partner Financials & Settlements ---
  async getFinancials(): Promise<Financial> {
    const response = await api.get("/partner/financials");
    return response.data;
  },

  async submitSettlement(settlementData: {
    purchaseIds: string[];
    referenceNumber: string;
    paymentMethod?: string;
    paymentDate?: string;
    remarks?: string;
  }): Promise<Settlement> {
    const response = await api.post("/partner/settlements", settlementData);
    return response.data;
  },

  async getSettlements(): Promise<Settlement[]> {
    const response = await api.get("/partner/settlements");
    return response.data;
  },

  async getSettlementById(id: string): Promise<Settlement> {
    const response = await api.get(`/partner/settlements/${id}`);
    return response.data;
  },

  // --- Supporting Partner Metadata ---
  async getMetadata(): Promise<PartnerMetadata> {
    const response = await api.get("/partner/metadata");
    return response.data;
  },

  async getProfile(): Promise<PartnerProfile> {
    const response = await api.get("/partner/profile");
    return response.data;
  },

  // --- Agent & Partner Documents ---
  async getDocuments(): Promise<{ id: string; type: string; name: string; url: string; status: string }[]> {
    const response = await api.get("/agent/documents");
    return response.data;
  },

  async uploadDocument(
    type: string,
    file?: File,
    metadata?: { expiryDate?: string; documentNumber?: string; placeOfIssue?: string; dateOfIssue?: string }
  ): Promise<{ id: string; type: string; status: string }> {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("type", type);
    if (metadata) {
      if (metadata.expiryDate) formData.append("expiryDate", metadata.expiryDate);
      if (metadata.documentNumber) formData.append("documentNumber", metadata.documentNumber);
      if (metadata.placeOfIssue) formData.append("placeOfIssue", metadata.placeOfIssue);
      if (metadata.dateOfIssue) formData.append("dateOfIssue", metadata.dateOfIssue);
    }

    const response = await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getCommissions(): Promise<Commission[]> {
    const response = await api.get("/agent/commissions");
    return response.data;
  },

  async downloadDocument(docId: string): Promise<{ url: string; name: string }> {
    const response = await api.get(`/documents/${docId}/download`);
    return response.data;
  },

  // --- Notifications ---
  async getNotifications(): Promise<{ id: string; title: string; message: string; read: boolean; createdAt: string }[]> {
    const response = await api.get("/agent/notifications");
    return response.data;
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const response = await api.patch(`/agent/notifications/${id}/read`);
    return response.data;
  },

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/agent/notifications/${id}`);
    return response.data;
  },

  // --- Profile & Onboarding ---
  async onboard(data: { agencyName: string; phone: string }): Promise<{ id: string; status: string }> {
    const response = await api.post("/agent/onboarding", data);
    return response.data;
  },

  async updateProfile(profileData: { name?: string; phone?: string; agencyName?: string }): Promise<{ id: string; name: string; phone: string; agencyName: string; status: string }> {
    const response = await api.put("/agent/profile", profileData);
    return response.data;
  },

  async changePassword(passwordData: { oldPassword: string; newPassword: string }): Promise<{ success: boolean }> {
    const response = await api.put("/agent/settings/password", passwordData);
    return response.data;
  },

  // --- Referral Leads ---
  async getLeads(query?: string): Promise<ReferralLead[]> {
    const params = query ? { params: { query } } : {};
    const response = await api.get("/agent/leads", params);
    return response.data;
  },

  async createLead(leadData: { name: string; email: string; phone: string }): Promise<ReferralLead> {
    const response = await api.post("/agent/leads", leadData);
    return response.data;
  },

  async updateLead(id: string, leadData: { status?: string; remarks?: string }): Promise<ReferralLead> {
    const response = await api.put(`/agent/leads/${id}`, leadData);
    return response.data;
  },

  // --- Support Tickets ---
  async getSupportTickets(): Promise<SupportTicket[]> {
    const response = await api.get("/agent/support");
    return response.data;
  },

  async createSupportTicket(ticketData: { subject: string; description: string }): Promise<SupportTicket> {
    const response = await api.post("/agent/support", ticketData);
    return response.data;
  },

  async getSupportTicketById(id: string): Promise<SupportTicket> {
    const response = await api.get(`/agent/support/${id}`);
    return response.data;
  },
};

export const partnerService = agentService;
export default agentService;
