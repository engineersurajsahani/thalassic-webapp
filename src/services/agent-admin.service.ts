import { api } from "@/lib/axios";

export const agentAdminService = {
  async getDashboardData() {
    const response = await api.get("/agent-admin/dashboard");
    return response.data;
  },

  async getAgents() {
    const response = await api.get("/agent-admin/agents");
    return response.data;
  },

  async createAgent(agentData: any) {
    const response = await api.post("/agent-admin/agents", agentData);
    return response.data;
  },

  async updateAgentStatus(agentId: string, status: string) {
    const response = await api.patch(`/agent-admin/agents/${agentId}/status`, { status });
    return response.data;
  },

  async updateAgentCommission(agentId: string, generalCommission: number, courseCommissions: any) {
    const response = await api.patch(`/agent-admin/agents/${agentId}/commission`, {
      generalCommission,
      courseCommissions,
    });
    return response.data;
  },

  async resetAgentPassword(agentId: string, passwordDto: any) {
    const response = await api.post(`/agent-admin/agents/${agentId}/reset-password`, passwordDto);
    return response.data;
  },

  async getAgentOnboarding(agentId: string) {
    const response = await api.get(`/agent-admin/agents/${agentId}/onboarding`);
    return response.data;
  },

  async getReferredSeafarers() {
    const response = await api.get("/agent-admin/seafarers");
    return response.data;
  },

  async getReferralLeads() {
    const response = await api.get("/agent-admin/referral-leads");
    return response.data;
  },

  async getCommissions() {
    const response = await api.get("/agent-admin/commissions");
    return response.data;
  },

  async getReports() {
    const response = await api.get("/agent-admin/reports");
    return response.data;
  },

  async getAuditLogs() {
    const response = await api.get("/agent-admin/audit-logs");
    return response.data;
  },

  async updateAgentDetails(agentId: string, data: any) {
    const response = await api.patch(`/agent-admin/agents/${agentId}`, data);
    return response.data;
  },

  async verifyAgentDocument(agentId: string, docId: string, status: string, remarks: string) {
    const response = await api.patch(`/agent-admin/agents/${agentId}/verify-document`, { docId, status, remarks });
    return response.data;
  },

  async getReferralConflicts() {
    const response = await api.get("/agent-admin/referral-conflicts");
    return response.data;
  },

  async resolveConflict(purchaseId: string, approvedAgentId: string, remarks: string) {
    const response = await api.post("/agent-admin/resolve-conflict", {
      purchaseId,
      approvedAgentId,
      remarks,
    });
    return response.data;
  }
};
