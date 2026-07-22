import { api } from "@/lib/axios";

export const agentService = {
  async getDashboard() {
    const response = await api.get("/agent/dashboard");
    return response.data;
  },

  async getMetadata() {
    const response = await api.get("/agent/metadata");
    return response.data;
  },

  async onboard(data: any) {
    const response = await api.post("/agent/onboard", data);
    return response.data;
  },

  async getLeads() {
    const response = await api.get("/agent/leads");
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

  async getPurchases() {
    const response = await api.get("/agent/purchases");
    return response.data;
  },

  async getCommissions() {
    const response = await api.get("/agent/commissions");
    return response.data;
  },

  async getDocuments() {
    const response = await api.get("/agent/documents");
    return response.data;
  },

  async uploadDocument(type: string, expiryDate?: string, fileName?: string) {
    const response = await api.post("/agent/documents", { type, expiryDate, fileName });
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/agent/profile");
    return response.data;
  },

  async updateProfile(profileData: any) {
    const response = await api.put("/agent/profile", profileData);
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
  }
};
