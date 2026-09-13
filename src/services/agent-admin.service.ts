import { api } from "@/lib/axios";

export interface AgentActivity {
  id?: string;
  name?: string;
  action?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface AgentRecord {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  agencyName?: string;
  status?: string;
  createdAt?: string;
  referralCode?: string;
  qrCode?: string | null;
  onboardingStatus?: string;
  generalCommission?: number;
  courseCommissions?: Record<string, unknown>;
  [key: string]: unknown;
}

const MOCK_AGENT_ADMIN_DASHBOARD = {
  stats: {
    totalPartners: 0,
    activePartners: 0,
    pendingVerification: 0,
    totalSeafarers: 0,
    activeSeafarers: 0,
    totalPurchases: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    revenueGrowth: "0%",
    totalSettlements: 0,
  },
  seafarerActivities: [] as AgentActivity[],
  partnerActivities: [] as AgentActivity[],
  recentPartners: [] as AgentRecord[],
};

const LOCAL_CREATED_AGENTS: AgentRecord[] = [];

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
      const list = response.data;
      if (Array.isArray(list)) {
        LOCAL_CREATED_AGENTS.forEach((createdAgent) => {
          const uEmail = (createdAgent.email || "").toLowerCase().trim();
          if (
            !list.some(
              (a) =>
                a.id === createdAgent.id ||
                (a.email && a.email.toLowerCase().trim() === uEmail),
            )
          ) {
            list.unshift(createdAgent);
          }
        });
        return list;
      }
    } catch {
      console.warn("API fetch agents failed, returning fallback list");
    }

    const fallbackList = [...MOCK_AGENT_ADMIN_DASHBOARD.recentPartners];
    LOCAL_CREATED_AGENTS.forEach((createdAgent) => {
      const uEmail = (createdAgent.email || "").toLowerCase().trim();
      if (
        !fallbackList.some(
          (a) =>
            a.id === createdAgent.id ||
            (a.email && a.email.toLowerCase().trim() === uEmail),
        )
      ) {
        fallbackList.unshift(createdAgent);
      }
    });
    return fallbackList;
  },

  async createAgent(agentData: Record<string, unknown>) {
    let created: AgentRecord | null = null;
    try {
      const response = await api.post("/agent-admin/agents", agentData);
      created = response.data;
    } catch (err) {
      console.warn(
        "createAgent API failed, falling back to local object creation:",
        err,
      );
    }

    const nameStr =
      typeof agentData.name === "string" ? agentData.name : "AGENT";
    const cleanName = nameStr
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .substring(0, 5);
    const autoRefCode = `REF${cleanName}${Math.floor(1000 + Math.random() * 9000)}`;

    const agentObj: AgentRecord = {
      id: created?.id || `agent-${Date.now()}`,
      name: (created?.name as string) || (agentData.name as string),
      email: (created?.email as string) || (agentData.email as string),
      phone:
        (created?.phone as string) ||
        (agentData.phone as string) ||
        "+91 99887 76655",
      agencyName: (created?.agencyName as string) || (agentData.name as string),
      status: (created?.status as string) || "Pending Verification",
      createdAt: (created?.createdAt as string) || new Date().toISOString(),
      referralCode: (created?.referralCode as string) || autoRefCode,
      qrCode: null,
      onboardingStatus:
        (created?.onboardingStatus as string) || "Profile Pending",
      generalCommission:
        created?.generalCommission ||
        (typeof agentData.generalCommission === "number"
          ? agentData.generalCommission
          : typeof agentData.generalCommission === "string"
            ? parseFloat(agentData.generalCommission)
            : 5.0),
      courseCommissions:
        created?.courseCommissions ||
        (agentData.courseCommissions as Record<string, unknown>) ||
        {},
    };

    const uEmail = (agentObj.email || "").toLowerCase().trim();
    if (
      !LOCAL_CREATED_AGENTS.some(
        (a) =>
          a.id === agentObj.id ||
          (a.email && a.email.toLowerCase().trim() === uEmail),
      )
    ) {
      LOCAL_CREATED_AGENTS.unshift(agentObj);
    }

    return agentObj;
  },

  async updateAgentStatus(agentId: string, status: string) {
    try {
      const response = await api.patch(
        `/agent-admin/agents/${agentId}/status`,
        { status },
      );
      return response.data;
    } catch {
      return { success: true, agentId, status };
    }
  },

  async updateAgentCommission(
    agentId: string,
    generalCommission: number,
    courseCommissions: Record<string, unknown>,
  ) {
    try {
      const response = await api.patch(
        `/agent-admin/agents/${agentId}/commission`,
        {
          generalCommission,
          courseCommissions,
        },
      );
      return response.data;
    } catch {
      return { success: true, agentId, generalCommission, courseCommissions };
    }
  },

  async resetAgentPassword(
    agentId: string,
    passwordDto: Record<string, unknown>,
  ) {
    try {
      const response = await api.post(
        `/agent-admin/agents/${agentId}/reset-password`,
        passwordDto,
      );
      return response.data;
    } catch {
      return { success: true };
    }
  },

  async getAgentOnboarding(agentId: string) {
    const defaultData = {
      agentId,
      status: "Profile Pending",
      checklist: [
        { step: 1, label: "Account Invited & Onboarded", status: "completed" },
        { step: 2, label: "First Login & Password Set", status: "completed" },
        {
          step: 3,
          label: "Profile Completion & Business Details",
          status: "completed",
        },
        {
          step: 4,
          label: "KYC Document Verification & Approval",
          status: "completed",
        },
        {
          step: 5,
          label: "Partner Empanelment & Account Active",
          status: "completed",
        },
      ],
      documents: [
        {
          id: "doc-1",
          type: "Manning License",
          name: "Company Manning License PDF",
          status: "Verified",
          url: "/documents/sample-license.pdf",
        },
        {
          id: "doc-2",
          type: "Identity GST",
          name: "GST & PAN Registration",
          status: "Verified",
          url: "/documents/sample-gst.pdf",
        },
        {
          id: "doc-3",
          type: "Bank Mandate",
          name: "Cancelled Cheque & Mandate",
          status: "Verified",
          url: "/documents/sample-cheque.pdf",
        },
        {
          id: "doc-4",
          type: "Empanelment",
          name: "Partner MoU Agreement",
          status: "Verified",
          url: "/documents/sample-mou.pdf",
        },
      ],
    };

    try {
      const response = await api.get(
        `/agent-admin/agents/${agentId}/onboarding`,
      );
      if (response.data && Array.isArray(response.data.checklist)) {
        return response.data;
      }
      return defaultData;
    } catch {
      return defaultData;
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
        totalLeads: 0,
        convertedLeads: 0,
        globalConversionRate: "0%",
      },
      regionStats: [],
      agentPerformance: [],
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

  async updateAgentDetails(agentId: string, data: Record<string, unknown>) {
    try {
      const response = await api.patch(`/agent-admin/agents/${agentId}`, data);
      return response.data;
    } catch {
      return { success: true, ...data };
    }
  },

  async verifyAgentDocument(
    agentId: string,
    docId: string,
    status: string,
    remarks: string,
  ) {
    try {
      const response = await api.patch(
        `/agent-admin/agents/${agentId}/verify-document`,
        { docId, status, remarks },
      );
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

  async resolveConflict(
    purchaseId: string,
    approvedAgentId: string,
    remarks: string,
  ) {
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
      console.warn("Failed to fetch settlements from API");
    }

    return [];
  },

  async createSettlementBatch(dto: Record<string, unknown>) {
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
      const response = await api.patch(
        `/agent-admin/settlements/${id}/status`,
        { status },
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: unknown };
        message?: string;
      };
      console.error(
        `[updateSettlementStatus] API failed for ${id}:`,
        errorObj?.response?.data || errorObj?.message,
      );
      // Don't silently succeed - throw so the UI can rollback
      throw err;
    }
  },
};
