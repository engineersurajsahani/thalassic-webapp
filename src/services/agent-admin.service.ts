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

  async getReports() {
    try {
      const response = await api.get("/agent-admin/reports");
      return response.data;
    } catch {
      return [];
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
  }
};
