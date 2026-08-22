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

  async uploadDocument(
    type: string,
    file: File,
    serializedName: string,
    metadata?: { expiryDate?: string }
  ) {
    const formData = new FormData();
    formData.append("file", file, serializedName);
    formData.append("type", type);
    if (metadata?.expiryDate) formData.append("expiryDate", metadata.expiryDate);

    const response = await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async downloadDocument(docId: string) {
    const response = await api.get(`/documents/${docId}/download`);
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

  async changePassword(passwordData: any) {
    const response = await api.put("/agent/settings/password", passwordData);
    return response.data;
  }
};
