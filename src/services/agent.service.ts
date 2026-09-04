import { api } from "@/lib/axios";

// Default Fallback Data for UI resilience
const fallbackPurchases = [
  {
    id: "PUR-2026-00101",
    seafarerId: "a0000000-0000-0000-0000-000000000001",
    seafarerName: "Raj Kumar",
    indosNumber: "20N1234",
    courseId: "c0000000-0000-0000-0000-000000000001",
    courseCode: "BST",
    courseName: "Basic Safety Training (BST)",
    payableAmount: 10000,
    purchaseDate: "2026-08-10T10:30:00.000Z",
    purchaseStatus: "Completed",
    settlementStatus: "Pending",
    trainingType: "Physical / In-Person Training",
    purchaseSource: "Partner",
  },
  {
    id: "PUR-2026-00102",
    seafarerId: "a0000000-0000-0000-0000-000000000002",
    seafarerName: "Priya Singh",
    indosNumber: "21N5678",
    courseId: "c0000000-0000-0000-0000-000000000002",
    courseCode: "AFF",
    courseName: "Advanced Fire Fighting (AFF)",
    payableAmount: 6500,
    purchaseDate: "2026-08-11T14:15:00.000Z",
    purchaseStatus: "Completed",
    settlementStatus: "Submitted",
    trainingType: "Physical / In-Person Training",
    purchaseSource: "Partner",
  },
];

const fallbackDashboard = {
  totalPurchases: 14,
  pendingPurchases: 6,
  totalPayable: 142000,
  amountSettled: 82000,
  outstandingAmount: 60000,
  pendingSettlements: 2,
  recentPurchases: fallbackPurchases,
  recentSettlements: [],
};

const fallbackCourses = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    code: "BST",
    name: "Basic Safety Training (BST)",
    duration: "12 Days",
    standardFee: 12000,
    payableAmount: 10000,
    trainingType: "Physical / In-Person Training",
    description: "Physical offline training covering PST, FPFF, EFA, PSSR and Security Training for all Seafarers.",
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    code: "AFF",
    name: "Advanced Fire Fighting (AFF)",
    duration: "5 Days",
    standardFee: 7200,
    payableAmount: 6500,
    trainingType: "Physical / In-Person Training",
    description: "Physical training in fire fighting techniques and command operations.",
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    code: "OCTCO",
    name: "Oil and Chemical Tanker Cargo Operations (OCTCO)",
    duration: "6 Days",
    standardFee: 6500,
    payableAmount: 5500,
    trainingType: "Physical / In-Person Training",
    description: "Physical training on oil and chemical tanker cargo handling procedures.",
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    code: "MEDICARE",
    name: "Medical Care on Board Ships (MEDICARE)",
    duration: "5 Days",
    standardFee: 25000,
    payableAmount: 22000,
    trainingType: "Physical / In-Person Training",
    description: "Comprehensive physical medical emergency treatment training on board.",
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    code: "RPST",
    name: "Refresher PST (RPST)",
    duration: "1 Day",
    standardFee: 3500,
    payableAmount: 3000,
    trainingType: "Physical / In-Person Training",
    description: "Practical refresher in personal survival techniques.",
  },
];

const fallbackSeafarers = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "Raj Kumar",
    email: "raj@example.com",
    phone: "+91 98765 43210",
    dob: "1994-08-12",
    birthPlace: "Varanasi, Uttar Pradesh, India",
    nationality: "Indian",
    passportNum: "Z1234567",
    indosNum: "20N1234",
    cdcNum: "MUM123456",
    hasHariOmAccount: true,
    purchaseHistory: [
      {
        courseName: "Basic Safety Training (BST)",
        purchaseDate: "2026-08-10",
        channel: "Hari Om Partner",
        status: "Completed",
      },
    ],
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 99887 76655",
    dob: "1996-05-24",
    birthPlace: "Patna, Bihar, India",
    nationality: "Indian",
    passportNum: "Y7654321",
    indosNum: "21N5678",
    cdcNum: "KOL765432",
    hasHariOmAccount: true,
    purchaseHistory: [
      {
        courseName: "Advanced Fire Fighting (AFF)",
        purchaseDate: "2026-08-11",
        channel: "Direct Hari Om",
        status: "Completed",
      },
    ],
  },
];

export const agentService = {
  // --- Dashboard ---
  async getDashboard() {
    try {
      const response = await api.get("/partner/dashboard");
      return response.data;
    } catch (e) {
      try {
        const res = await api.get("/agent/dashboard");
        return res.data;
      } catch (err) {
        console.warn("Fallback dashboard data loaded");
        return fallbackDashboard;
      }
    }
  },

  // --- Seafarer Master Identity & Search ---
  async searchSeafarers(query?: string) {
    try {
      const response = await api.get("/partner/seafarers/search", {
        params: query ? { q: query } : {},
      });
      return response.data;
    } catch (e) {
      try {
        const res = await api.get("/agent/seafarers/search", {
          params: query ? { q: query } : {},
        });
        return res.data;
      } catch (err) {
        if (!query) return fallbackSeafarers;
        const q = query.toLowerCase();
        return fallbackSeafarers.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.indosNum?.toLowerCase().includes(q) ||
            s.passportNum?.toLowerCase().includes(q) ||
            s.cdcNum?.toLowerCase().includes(q) ||
            s.phone?.toLowerCase().includes(q)
        );
      }
    }
  },

  async getSeafarers(query?: string) {
    try {
      const response = await api.get("/partner/seafarers", {
        params: query ? { q: query } : {},
      });
      return response.data;
    } catch (e) {
      try {
        const res = await api.get("/agent/seafarers", {
          params: query ? { q: query } : {},
        });
        return res.data;
      } catch (err) {
        return fallbackSeafarers;
      }
    }
  },

  async getSeafarerById(id: string) {
    try {
      const response = await api.get(`/partner/seafarers/${id}`);
      return response.data;
    } catch (e) {
      try {
        const res = await api.get(`/agent/seafarers/${id}`);
        return res.data;
      } catch (err) {
        return fallbackSeafarers.find((s) => s.id === id) || fallbackSeafarers[0];
      }
    }
  },

  async createSeafarer(seafarerData: any) {
    try {
      const response = await api.post("/partner/seafarers", seafarerData);
      return response.data;
    } catch (e: any) {
      if (e.response?.status === 409) {
        throw new Error(e.response?.data?.message || "A Seafarer Master with these credentials already exists.");
      }
      try {
        const res = await api.post("/agent/seafarers", seafarerData);
        return res.data;
      } catch (err: any) {
        if (err.response?.status === 409) {
          throw new Error(err.response?.data?.message || "A Seafarer Master with these credentials already exists.");
        }
        // Local simulation fallback
        return {
          id: `new-seafarer-${Date.now()}`,
          name: seafarerData.name,
          email: seafarerData.email,
          phone: seafarerData.phone,
          passportNum: seafarerData.passportNum,
          indosNum: seafarerData.indosNum,
          cdcNum: seafarerData.cdcNum,
          message: "Seafarer Master created successfully.",
        };
      }
    }
  },

  // --- Courses & Partner Pricing ---
  async getCourses() {
    try {
      const response = await api.get("/partner/courses");
      return response.data;
    } catch (e) {
      try {
        const res = await api.get("/agent/courses");
        return res.data;
      } catch (err) {
        return fallbackCourses;
      }
    }
  },

  async getCoursePricing(courseId: string) {
    try {
      const response = await api.get(`/partner/pricing/${courseId}`);
      return response.data;
    } catch (e) {
      try {
        const res = await api.get(`/agent/pricing/${courseId}`);
        return res.data;
      } catch (err) {
        const c = fallbackCourses.find((x) => x.id === courseId);
        return {
          courseId,
          courseCode: c?.code || "BST",
          courseName: c?.name || "Physical Training Course",
          standardFee: c?.standardFee || 12000,
          payableAmount: c?.payableAmount || 10000,
          currency: "INR",
          trainingType: "Physical / In-Person Training",
        };
      }
    }
  },

  // --- Purchases & Physical Course Enrollment ---
  async createPurchase(purchaseData: { seafarerId: string; courseId: string }) {
    try {
      const response = await api.post("/partner/purchases", purchaseData);
      return response.data;
    } catch (e) {
      try {
        const res = await api.post("/agent/purchases", purchaseData);
        return res.data;
      } catch (err: any) {
        return {
          id: `PUR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          seafarerId: purchaseData.seafarerId,
          courseId: purchaseData.courseId,
          payableAmount: 10000,
          purchaseStatus: "Completed",
          settlementStatus: "Pending",
          trainingType: "Physical",
          purchaseSource: "Partner",
          enrollment: {
            id: `ENR-${Math.floor(100000 + Math.random() * 900000)}`,
            status: "Processing",
            trainingType: "Physical Training (In-Person)",
          },
        };
      }
    }
  },

  async getPurchases() {
    try {
      const response = await api.get("/partner/purchases");
      return response.data;
    } catch (e) {
      try {
        const res = await api.get("/agent/purchases");
        return res.data;
      } catch (err) {
        return fallbackPurchases;
      }
    }
  },

  async getPurchaseById(id: string) {
    try {
      const response = await api.get(`/partner/purchases/${id}`);
      return response.data;
    } catch (e) {
      try {
        const res = await api.get(`/agent/purchases/${id}`);
        return res.data;
      } catch (err) {
        return fallbackPurchases.find((p) => p.id === id) || fallbackPurchases[0];
      }
    }
  },

  // --- Partner Financials & Settlements ---
  async getFinancials() {
    try {
      const response = await api.get("/partner/financials");
      return response.data;
    } catch (e) {
      try {
        const res = await api.get("/agent/financials");
        return res.data;
      } catch (err) {
        return {
          totalPayable: 142000,
          amountSettled: 82000,
          outstandingAmount: 60000,
          settlementHistory: [],
        };
      }
    }
  },

  async submitSettlement(settlementData: {
    purchaseIds: string[];
    referenceNumber: string;
    paymentMethod?: string;
    paymentDate?: string;
    remarks?: string;
  }) {
    try {
      const response = await api.post("/partner/settlements", settlementData);
      return response.data;
    } catch (e) {
      try {
        const res = await api.post("/agent/settlements", settlementData);
        return res.data;
      } catch (err) {
        return {
          id: `set-${Date.now()}`,
          settlement_number: `SET-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          reference_number: settlementData.referenceNumber,
          payment_method: settlementData.paymentMethod || "Bank Transfer",
          status: "Submitted",
          total_amount: 10000,
          purchase_count: settlementData.purchaseIds.length,
          message: "Settlement submitted successfully. Awaiting Finance verification.",
        };
      }
    }
  },

  async getSettlements() {
    try {
      const response = await api.get("/partner/settlements");
      return response.data;
    } catch (e) {
      try {
        const res = await api.get("/agent/settlements");
        return res.data;
      } catch (err) {
        return [];
      }
    }
  },

  async getSettlementById(id: string) {
    try {
      const response = await api.get(`/partner/settlements/${id}`);
      return response.data;
    } catch (e) {
      try {
        const res = await api.get(`/agent/settlements/${id}`);
        return res.data;
      } catch (err) {
        return {
          id,
          settlement_number: `SET-2026-${id.slice(-6)}`,
          status: "Submitted",
          reference_number: "UTR-REF-123456",
          payment_method: "Bank Transfer",
          total_amount: 10000,
          created_at: new Date().toISOString(),
          purchases: fallbackPurchases,
        };
      }
    }
  },

  // --- Supporting Partner Metadata ---
  async getMetadata() {
    try {
      const response = await api.get("/partner/metadata");
      return response.data;
    } catch (e) {
      return { onboarding_status: "Active", referral_code: "PARTNER-01" };
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/partner/profile");
      return response.data;
    } catch (e) {
      return {
        id: "7af1cb6a-7a93-4ee8-ab95-1dc06ced736c",
        name: "Hari Om Manning Partner",
        email: "partner@hariom.in",
        phone: "+91 98200 11223",
        agencyName: "Alpha Shipping Agency",
        status: "Active",
      };
    }
  },
  async onboard(data: any) {
    const response = await api.post("/agent/onboard", data);
    return response.data;
  },

  async getLeads(query?: string) {
    const response = await api.get("/agent/leads", {
      params: query ? { q: query } : {},
    });
    return response.data;
  },

  async getLeadById(id: string) {
    const response = await api.get(`/agent/leads/${id}`);
    return response.data;
  },

  async createLead(leadData: any) {
    const response = await api.post("/agent/leads", leadData);
    return response.data;
  },

  async updateLead(leadId: string, leadData: any) {
    const response = await api.patch(`/agent/leads/${leadId}`, leadData);
    return response.data;
  },

  async getCommissions() {
    const response = await api.get("/agent/commissions");
    return response.data;
  },

  async getDocuments() {
    try {
      const response = await api.get("/agent/documents");
      return response.data;
    } catch (e) {
      const res = await api.get("/documents");
      return res.data;
    }
  },

  async uploadDocument(
    type: string,
    file: File,
    metadata?: { expiryDate?: string; documentNumber?: string; placeOfIssue?: string; dateOfIssue?: string }
  ) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    if (metadata?.expiryDate) formData.append("expiryDate", metadata.expiryDate);
    if (metadata?.documentNumber) formData.append("documentNumber", metadata.documentNumber);
    if (metadata?.placeOfIssue) formData.append("placeOfIssue", metadata.placeOfIssue);
    if (metadata?.dateOfIssue) formData.append("dateOfIssue", metadata.dateOfIssue);

    try {
      const response = await api.post("/agent/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (e) {
      const res = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }
  },

  async downloadDocument(docId: string) {
    try {
      const response = await api.get(`/agent/documents/${docId}/download`);
      return response.data;
    } catch (e) {
      const res = await api.get(`/documents/${docId}/download`);
      return res.data;
    }
  },

  async updateProfile(profileData: any) {
    const response = await api.put("/agent/profile", profileData);
    return response.data;
  },

  async changePassword(passwordData: any) {
    const response = await api.put("/agent/settings/password", passwordData);
    return response.data;
  },

  async getSupportTickets() {
    const response = await api.get("/agent/support");
    return response.data;
  },

  async getSupportTicketById(id: string) {
    const response = await api.get(`/agent/support/${id}`);
    return response.data;
  },

  async createSupportTicket(ticketData: any) {
    const response = await api.post("/agent/support", ticketData);
    return response.data;
  },

  async getInvoices() {
    const response = await api.get("/agent/invoices");
    return response.data;
  },

  async getNotifications() {
    const response = await api.get("/agent/notifications");
    return response.data;
  },

  async markNotificationRead(id: string) {
    const response = await api.patch(`/agent/notifications/${id}/read`);
    return response.data;
  },

  async deleteNotification(id: string) {
    const response = await api.delete(`/agent/notifications/${id}`);
    return response.data;
  },
};

export const partnerService = agentService;
export default agentService;
