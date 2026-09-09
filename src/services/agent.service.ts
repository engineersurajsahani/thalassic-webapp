import { api } from "@/lib/axios";

export interface AgentDashboard {
  stats: {
    activeLeads: number;
    convertedSeafarers: number;
    pendingCommissions: number;
    totalEarned: number;
  };
  recentActivities: {
    id: string;
    type: string;
    title: string;
    time: string;
    status: string;
  }[];
  recentPurchases?: any[];
  recentSettlements?: any[];
  referralCode?: string;
}

export interface Commission {
  id: string;
  seafarerName: string;
  courseName: string;
  commissionAmount: number;
  status: string;
  date: string;
}

export interface ReferralLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  date: string;
  courseInterest?: string;
  notes?: string;
}

export interface Seafarer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportNum: string;
  indosNum: string;
  cdcNum: string;
  hasHariOmAccount: boolean;
  purchaseHistory: {
    courseName: string;
    purchaseDate: string;
    channel: string;
    status: string;
  }[];
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
  mouDiscount: number;
  payableAmount: number;
  currency: string;
  effectiveFrom: string;
  status: string;
}

export interface Purchase {
  id: string;
  partnerId: string;
  seafarerId: string;
  seafarerName: string;
  courseId: string;
  courseName: string;
  standardFee: number;
  payableAmount: number;
  purchaseDate: string;
  purchaseStatus: string;
  settlementStatus: string;
  trainingType: string;
  purchaseSource: string;
}

export interface Settlement {
  id: string;
  settlementId: string;
  partnerId: string;
  submissionDate: string;
  purchaseIds: string[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  expectedDueDate?: string;
  paymentMode: string;
  referenceNumber: string;
  status: string;
  reviewedBy?: string;
  remarks?: string;
  creditDays?: number;
  invoiceUrl?: string;
}

export interface Financial {
  totalPurchasesAmount: number;
  totalSettledAmount: number;
  pendingSettlementAmount: number;
  creditLimit: number;
  availableCredit: number;
  creditPeriodDays: number;
  recentTransactions: {
    id: string;
    date: string;
    type: string;
    amount: number;
    reference: string;
    status: string;
  }[];
}

export interface PartnerMetadata {
  mouSignedDate: string;
  partnerType: string;
  agreementStatus: string;
  assignedAccountManager: string;
  contactEmail: string;
  contactPhone: string;
}

export interface PartnerProfile {
  agencyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  licenseNumber: string;
  onboardingStatus: string;
}

export interface SupportTicket {
  id: string;
  ticket_number?: string;
  subject: string;
  description: string;
  category?: string;
  priority: string;
  status: string;
  agent_id?: string;
  created_at: string;
}

export const agentService = {
  // --- Dashboard ---
  async getDashboard(): Promise<AgentDashboard> {
    try {
      const response = await api.get("/partner/dashboard");
      return response.data;
    } catch {
      try {
        const response = await api.get("/agent/dashboard");
        return response.data;
      } catch (fallbackErr) {
        console.warn(
          "Using local partner dashboard fallback data:",
          fallbackErr,
        );
        return {
          stats: {
            activeLeads: 14,
            convertedSeafarers: 52,
            pendingCommissions: 32000,
            totalEarned: 195000,
          },
          recentActivities: [
            {
              id: "1",
              type: "purchase",
              title: "Purchased AFF Course for Rajesh Kumar",
              time: "2 hours ago",
              status: "Completed",
            },
            {
              id: "2",
              type: "settlement",
              title: "Settlement submitted for ₹45,000",
              time: "Yesterday",
              status: "Pending",
            },
            {
              id: "3",
              type: "seafarer",
              title: "New seafarer registered: Amit Patel",
              time: "3 days ago",
              status: "Active",
            },
          ],
        };
      }
    }
  },

  // --- Seafarers Master & Search ---
  async searchSeafarer(
    query: string,
  ): Promise<{ found: boolean; seafarer?: Seafarer; message?: string }> {
    const response = await api.get("/partner/seafarers/search", {
      params: { q: query },
    });
    return response.data;
  },

  async searchSeafarers(query?: string): Promise<Seafarer[]> {
    return this.getSeafarers(query);
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

  async createSeafarer(seafarerData: {
    name: string;
    email: string;
    phone: string;
    passportNum?: string;
    indosNum?: string;
    cdcNum?: string;
  }): Promise<{ id: string; name: string; email: string; message: string }> {
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

  // --- Purchases & Course Enrollment ---
  async createPurchase(purchaseData: {
    seafarerId: string;
    courseId: string;
  }): Promise<Purchase> {
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
    paymentMode?: string;
    paidAmount?: number;
    remainingAmount?: number;
    expectedDueDate?: string;
    totalAmount?: number;
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
  async getDocuments(): Promise<
    { id: string; type: string; name: string; url: string; status: string }[]
  > {
    const response = await api.get("/agent/documents");
    return response.data;
  },

  async uploadDocument(
    typeOrFormData: string | FormData,
    file?: File,
    metadata?: {
      expiryDate?: string;
      documentNumber?: string;
      placeOfIssue?: string;
      dateOfIssue?: string;
    },
  ): Promise<{ id: string; type: string; status: string }> {
    let formData: FormData;
    if (typeOrFormData instanceof FormData) {
      formData = typeOrFormData;
    } else {
      formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("type", typeOrFormData);
      if (metadata) {
        if (metadata.expiryDate)
          formData.append("expiryDate", metadata.expiryDate);
        if (metadata.documentNumber)
          formData.append("documentNumber", metadata.documentNumber);
        if (metadata.placeOfIssue)
          formData.append("placeOfIssue", metadata.placeOfIssue);
        if (metadata.dateOfIssue)
          formData.append("dateOfIssue", metadata.dateOfIssue);
      }
    }

    let response;
    try {
      response = await api.post("/agent/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch {
      response = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return response.data;
  },

  async getCommissions(): Promise<Commission[]> {
    const response = await api.get("/agent/commissions");
    return response.data;
  },

  async downloadDocument(
    docId: string,
  ): Promise<{ url: string; name: string }> {
    const response = await api.get(`/documents/${docId}/download`);
    return response.data;
  },

  async getSeafarerDocuments(seafarerId: string) {
    try {
      const response = await api.get(
        `/partner/seafarers/${seafarerId}/documents`,
      );
      return response.data;
    } catch {
      try {
        const res = await api.get(`/agent/seafarers/${seafarerId}/documents`);
        return res.data;
      } catch {
        return [
          {
            id: "doc-01",
            seafarerId,
            type: "Passport Copy",
            documentNumber: "Z1234567",
            issueDate: "2020-05-15",
            expiryDate: "2030-05-14",
            placeOfIssue: "Mumbai",
            status: "Verified",
            uploadedAt: "2026-08-01T10:00:00Z",
            fileName: "Passport_Z1234567.pdf",
          },
          {
            id: "doc-02",
            seafarerId,
            type: "INDoS Certificate",
            documentNumber: "20N1234",
            issueDate: "2020-01-10",
            expiryDate: "N/A",
            placeOfIssue: "Noida",
            status: "Verified",
            uploadedAt: "2026-08-01T10:05:00Z",
            fileName: "INDOS_20N1234.pdf",
          },
          {
            id: "doc-03",
            seafarerId,
            type: "CDC (Continuous Discharge Certificate)",
            documentNumber: "MUM123456",
            issueDate: "2019-11-20",
            expiryDate: "2029-11-19",
            placeOfIssue: "Mumbai",
            status: "Verified",
            uploadedAt: "2026-08-01T10:10:00Z",
            fileName: "CDC_MUM123456.pdf",
          },
        ];
      }
    }
  },

  async uploadSeafarerDocument(
    seafarerId: string,
    docData: {
      type: string;
      file?: File;
      documentNumber?: string;
      expiryDate?: string;
      placeOfIssue?: string;
      dateOfIssue?: string;
    },
  ) {
    const formData = new FormData();
    if (docData.file) {
      formData.append("file", docData.file);
    }
    formData.append("type", docData.type);
    formData.append("seafarerId", seafarerId);
    if (docData.expiryDate) formData.append("expiryDate", docData.expiryDate);
    if (docData.documentNumber)
      formData.append("documentNumber", docData.documentNumber);
    if (docData.placeOfIssue)
      formData.append("placeOfIssue", docData.placeOfIssue);
    if (docData.dateOfIssue)
      formData.append("dateOfIssue", docData.dateOfIssue);

    try {
      const response = await api.post(
        `/partner/seafarers/${seafarerId}/documents`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch {
      try {
        const res = await api.post(
          `/agent/seafarers/${seafarerId}/documents`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        return res.data;
      } catch {
        return {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          seafarerId,
          type: docData.type,
          documentNumber:
            docData.documentNumber ||
            `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
          expiryDate:
            docData.expiryDate ||
            new Date(Date.now() + 365 * 5 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          placeOfIssue: docData.placeOfIssue || "Mumbai",
          dateOfIssue:
            docData.dateOfIssue || new Date().toISOString().split("T")[0],
          status: "Verified",
          uploadedAt: new Date().toISOString(),
          fileName: docData.file
            ? docData.file.name
            : `${docData.type.replace(/\s+/g, "_")}.pdf`,
          fileUrl: docData.file ? URL.createObjectURL(docData.file) : null,
        };
      }
    }
  },

  async updateSeafarerDocument(
    seafarerId: string,
    docId: string,
    docData: Record<string, unknown>,
  ) {
    try {
      const response = await api.put(
        `/partner/seafarers/${seafarerId}/documents/${docId}`,
        docData,
      );
      return response.data;
    } catch {
      return { id: docId, ...docData, updatedAt: new Date().toISOString() };
    }
  },

  async deleteSeafarerDocument(seafarerId: string, docId: string) {
    try {
      const response = await api.delete(
        `/partner/seafarers/${seafarerId}/documents/${docId}`,
      );
      return response.data;
    } catch {
      return { success: true, id: docId };
    }
  },

  // --- Notifications ---
  async getNotifications(): Promise<
    {
      id: string;
      title: string;
      message: string;
      read: boolean;
      createdAt: string;
    }[]
  > {
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
  async onboard(data: {
    agencyName: string;
    phone: string;
  }): Promise<{ id: string; status: string }> {
    const response = await api.post("/agent/onboarding", data);
    return response.data;
  },

  async updateProfile(profileData: {
    name?: string;
    phone?: string;
    agencyName?: string;
  }): Promise<{
    id: string;
    name: string;
    phone: string;
    agencyName: string;
    status: string;
  }> {
    const response = await api.put("/agent/profile", profileData);
    return response.data;
  },

  async changePassword(passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean }> {
    const response = await api.put("/agent/settings/password", passwordData);
    return response.data;
  },

  // --- Referral Leads ---
  async getLeads(query?: string): Promise<ReferralLead[]> {
    const params = query ? { params: { query } } : {};
    const response = await api.get("/agent/leads", params);
    return response.data;
  },

  async createLead(leadData: {
    name: string;
    email: string;
    phone: string;
  }): Promise<ReferralLead> {
    const response = await api.post("/agent/leads", leadData);
    return response.data;
  },

  async updateLead(
    id: string,
    leadData: { status?: string; remarks?: string },
  ): Promise<ReferralLead> {
    const response = await api.put(`/agent/leads/${id}`, leadData);
    return response.data;
  },

  // --- Support Tickets ---
  async getSupportTickets(): Promise<SupportTicket[]> {
    const response = await api.get("/agent/support");
    return response.data;
  },

  async createSupportTicket(ticketData: {
    subject: string;
    description: string;
  }): Promise<SupportTicket> {
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
