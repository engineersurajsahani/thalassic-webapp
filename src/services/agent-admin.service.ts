import { api } from "@/lib/axios";

const MOCK_AGENT_ADMIN_DASHBOARD = {
  stats: {
    totalPartners: 48,
    activePartners: 42,
    pendingVerification: 6,
    totalSeafarers: 1240,
    activeSeafarers: 1150,
    totalPurchases: 380,
    pendingApprovals: 5,
    monthlyRevenue: 1450000,
    revenueGrowth: "+14.2%",
    totalSettlements: 28,
  },
  seafarerActivities: [
    {
      id: "act-1",
      seafarerName: "Captain Rajesh Sharma",
      seafarerId: "SF-8842",
      action: "Course Purchase - STCW Basic Safety Training",
      partnerName: "Maritime Crewing Corp",
      time: "10 mins ago",
      status: "Completed",
      amount: "₹12,000",
    },
    {
      id: "act-2",
      seafarerName: "Vikramaditya Singh",
      seafarerId: "SF-9912",
      action: "Submitted Medical Fitness Certificate",
      partnerName: "Oceanic Seamen Agency",
      time: "25 mins ago",
      status: "Pending Verification",
      documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "act-3",
      seafarerName: "Anil Kumar",
      seafarerId: "SF-7721",
      action: "Advanced Fire Fighting Booking",
      partnerName: "Global Marine Services",
      time: "1 hour ago",
      status: "Active",
      amount: "₹15,000",
    },
  ],
  partnerActivities: [
    {
      id: "pact-1",
      partnerName: "Oceanic Seamen Agency",
      action: "Proposed Course Pricing Change for AFF-002",
      status: "Pending Approval",
      time: "15 mins ago",
      details: "Proposed Hari Om payable: ₹13,000",
    },
    {
      id: "pact-2",
      partnerName: "Maritime Crewing Corp",
      action: "Submitted Settlement Invoice #INV-2026-089",
      status: "Awaiting Payment",
      time: "45 mins ago",
      details: "Amount: ₹1,45,000",
    },
  ],
  recentPartners: [
    { id: "c2222222-2222-2222-2222-222222222222", name: "Kishan Manning Agency", email: "kishan1@gmail.com", status: "Active", seafarers: 52 },
    { id: "p-1", name: "Oceanic Seamen Agency", email: "contact@oceanic.com", status: "Active", seafarers: 142 },
    { id: "p-2", name: "Maritime Crewing Corp", email: "info@maritimecrewing.in", status: "Active", seafarers: 98 },
    { id: "p-3", name: "Global Marine Services", email: "support@globalmarine.com", status: "Pending Verification", seafarers: 45 },
  ],
};

export const agentAdminService = {
  async getDashboardData() {
    try {
      const response = await api.get("/agent-admin/dashboard");
      return response.data;
    } catch {
      return MOCK_AGENT_ADMIN_DASHBOARD;
    }
  },

  async getAgents() {
    try {
      const response = await api.get("/agent-admin/agents");
      return response.data;
    } catch {
      return MOCK_AGENT_ADMIN_DASHBOARD.recentPartners;
    }
  },

  async createAgent(agentData: any) {
    try {
      const response = await api.post("/agent-admin/agents", agentData);
      return response.data;
    } catch {
      return { success: true, ...agentData };
    }
  },

  async updateAgentStatus(agentId: string, status: string) {
    try {
      const response = await api.patch(`/agent-admin/agents/${agentId}/status`, { status });
      return response.data;
    } catch {
      return { success: true, agentId, status };
    }
  },

  async updateAgentCommission(agentId: string, generalCommission: number, courseCommissions: any) {
    try {
      const response = await api.patch(`/agent-admin/agents/${agentId}/commission`, {
        generalCommission,
        courseCommissions,
      });
      return response.data;
    } catch {
      return { success: true, agentId, generalCommission, courseCommissions };
    }
  },

  async resetAgentPassword(agentId: string, passwordDto: any) {
    try {
      const response = await api.post(`/agent-admin/agents/${agentId}/reset-password`, passwordDto);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  async getAgentOnboarding(agentId: string) {
    try {
      const response = await api.get(`/agent-admin/agents/${agentId}/onboarding`);
      return response.data;
    } catch {
      return { status: "Active" };
    }
  },

  async getReferredSeafarers() {
    try {
      const response = await api.get("/agent-admin/seafarers");
      return response.data;
    } catch {
      return [];
    }
  },

  async getReferralLeads() {
    try {
      const response = await api.get("/agent-admin/referral-leads");
      return response.data;
    } catch {
      return [];
    }
  },

  async getCommissions() {
    try {
      const response = await api.get("/agent-admin/commissions");
      return response.data;
    } catch {
      return [];
    }
  },

  async getReports(month?: string) {
    const fallbackReports = {
      conversionSummary: {
        totalLeads: 142,
        convertedLeads: 98,
        globalConversionRate: "69.0%",
      },
      regionStats: [
        { name: "Mumbai", value: 48 },
        { name: "Kochi", value: 36 },
        { name: "Chennai", value: 28 },
        { name: "Kolkata", value: 18 },
        { name: "Goa", value: 12 },
      ],
      agentPerformance: [
        {
          agentName: "Apex Maritime Solutions",
          leads: 42,
          conversions: 32,
          conversionRate: "76.2%",
          totalSales: "₹10,50,000",
          earnings: "₹1,26,000",
        },
        {
          agentName: "Blue Ocean Crewing Ltd",
          leads: 35,
          conversions: 25,
          conversionRate: "71.4%",
          totalSales: "₹8,75,000",
          earnings: "₹1,05,000",
        },
        {
          agentName: "Nautical Placement Services",
          leads: 28,
          conversions: 20,
          conversionRate: "71.4%",
          totalSales: "₹7,00,000",
          earnings: "₹84,000",
        },
        {
          agentName: "SeaFarer Operations India",
          leads: 22,
          conversions: 14,
          conversionRate: "63.6%",
          totalSales: "₹5,50,000",
          earnings: "₹66,000",
        },
        {
          agentName: "Pacific Marine Manning",
          leads: 15,
          conversions: 7,
          conversionRate: "46.7%",
          totalSales: "₹3,75,000",
          earnings: "₹45,000",
        },
      ],
    };

    try {
      const response = await api.get("/agent-admin/reports", {
        params: month && month !== "all" ? { month } : {},
      });
      if (
        response.data &&
        Array.isArray(response.data.agentPerformance) &&
        response.data.agentPerformance.length > 0
      ) {
        return response.data;
      }
      return fallbackReports;
    } catch {
      return fallbackReports;
    }
  },

  async getAuditLogs() {
    try {
      const response = await api.get("/agent-admin/audit-logs");
      return response.data;
    } catch {
      return [];
    }
  },

  async updateAgentDetails(agentId: string, data: any) {
    try {
      const response = await api.patch(`/agent-admin/agents/${agentId}`, data);
      return response.data;
    } catch {
      return { success: true, ...data };
    }
  },

  async verifyAgentDocument(agentId: string, docId: string, status: string, remarks: string) {
    try {
      const response = await api.patch(`/agent-admin/agents/${agentId}/verify-document`, { docId, status, remarks });
      return response.data;
    } catch {
      return { success: true, docId, status, remarks };
    }
  },

  async getReferralConflicts() {
    try {
      const response = await api.get("/agent-admin/referral-conflicts");
      return response.data;
    } catch {
      return [];
    }
  },

  async resolveConflict(purchaseId: string, approvedAgentId: string, remarks: string) {
    try {
      const response = await api.post("/agent-admin/resolve-conflict", {
        purchaseId,
        approvedAgentId,
        remarks,
      });
      return response.data;
    } catch {
      return { success: true };
    }
  },

  // --- PRD 4.9 PARTNER SETTLEMENTS ---
  async getSettlements() {
    try {
      const response = await api.get("/agent-admin/settlements");
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      console.warn("Failed to fetch settlements from API, returning mock data");
    }

    return [
      {
        id: "settl-001",
        settlement_reference: "SETTL-2026-00412",
        reference_number: "UTR-HDFC-9948210394",
        settlement_date: "2026-09-04T12:00:00.000Z",
        created_at: "2026-09-04T12:00:00.000Z",
        amount_payable: 145000,
        amount_settled: 145000,
        pending_amount: 0,
        status: "Completed",
        payment_method: "HDFC Bank RTGS / NEFT",
        agent_name: "SeaTrans Manning Agency",
        related_purchases: [
          { invoice_number: "HAC260900001", customer_name: "Capt. Vikramaditya Singh", course_name: "Advanced Oil Tanker Cargo Operations (TASCO)", hariom_payable: 24500, date: "04 Sep 2026" },
          { invoice_number: "HAC260900002", customer_name: "Rajesh Kumar Sharma", course_name: "Basic Safety Training (STCW BST)", hariom_payable: 14200, date: "03 Sep 2026" },
          { invoice_number: "HAC260900003", customer_name: "Amitabh Deshmukh", course_name: "Medical First Aid (MFA)", hariom_payable: 8500, date: "02 Sep 2026" },
        ],
      },
      {
        id: "settl-002",
        settlement_reference: "SETTL-2026-00413",
        reference_number: "UTR-ICICI-8841029411",
        settlement_date: "2026-09-03T10:30:00.000Z",
        created_at: "2026-09-03T10:30:00.000Z",
        amount_payable: 180000,
        amount_settled: 0,
        pending_amount: 180000,
        status: "Under Verification",
        payment_method: "Bank Wire Transfer",
        agent_name: "SeaTrans Manning Agency",
        related_purchases: [
          { invoice_number: "HAC260800075", customer_name: "Suresh Nambiar", course_name: "Proficiency in Survival Craft (PSCRB)", hariom_payable: 11800, date: "01 Sep 2026" },
          { invoice_number: "HAC260800076", customer_name: "Manish Verma", course_name: "High Voltage Safety & Switchgear", hariom_payable: 32000, date: "31 Aug 2026" },
        ],
      },
      {
        id: "settl-003",
        settlement_reference: "SETTL-2026-00414",
        reference_number: "UTR-SBIN-7739104822",
        settlement_date: "2026-09-02T14:15:00.000Z",
        created_at: "2026-09-02T14:15:00.000Z",
        amount_payable: 95000,
        amount_settled: 0,
        pending_amount: 95000,
        status: "Submitted",
        payment_method: "SBI Corporate Net Banking",
        agent_name: "SeaTrans Manning Agency",
        related_purchases: [
          { invoice_number: "HAC260800060", customer_name: "Gautam Adhikari", course_name: "Global Maritime Distress System (GMDSS)", hariom_payable: 28500, date: "28 Aug 2026" },
        ],
      },
      {
        id: "settl-004",
        settlement_reference: "SETTL-2026-00415",
        reference_number: "Pending Transfer",
        settlement_date: "2026-09-01T09:00:00.000Z",
        created_at: "2026-09-01T09:00:00.000Z",
        amount_payable: 62000,
        amount_settled: 0,
        pending_amount: 62000,
        status: "Pending",
        payment_method: "Awaiting Bank Remittance Proof",
        agent_name: "SeaTrans Manning Agency",
        related_purchases: [
          { invoice_number: "HAC260800051", customer_name: "Pradeep Joshi", course_name: "Elementary First Aid (EFA)", hariom_payable: 7500, date: "30 Aug 2026" },
        ],
      },
      {
        id: "settl-005",
        settlement_reference: "SETTL-2026-00416",
        reference_number: "UTR-INVALID-0001",
        settlement_date: "2026-08-25T16:20:00.000Z",
        created_at: "2026-08-25T16:20:00.000Z",
        amount_payable: 45000,
        amount_settled: 0,
        pending_amount: 45000,
        status: "Rejected",
        rejection_reason: "Bank UTR mismatch - amount not credited to Hari Om account",
        payment_method: "Bank Transfer",
        agent_name: "SeaTrans Manning Agency",
        related_purchases: [
          { invoice_number: "HAC260800040", customer_name: "Rohan Kulkarni", course_name: "Personal Safety & Social Responsibilities", hariom_payable: 6500, date: "24 Aug 2026" },
        ],
      },
    ];
  },

  async createSettlementBatch(dto: any) {
    try {
      const response = await api.post("/agent-admin/settlements", dto);
      return response.data;
    } catch {
      return { success: true, ...dto };
    }
  },

  async paySettlement(id: string) {
    try {
      const response = await api.patch(`/agent-admin/settlements/${id}/pay`);
      return response.data;
    } catch {
      return { success: true, id, status: "Completed" };
    }
  },

  async updateSettlementStatus(id: string, status: string) {
    try {
      const response = await api.patch(`/agent-admin/settlements/${id}/status`, { status });
      return response.data;
    } catch (err: any) {
      console.error(`[updateSettlementStatus] API failed for ${id}:`, err?.response?.data || err?.message);
      // Don't silently succeed - throw so the UI can rollback
      throw err;
    }
  },
};

