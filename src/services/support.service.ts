import { api } from "@/lib/axios";

export const supportService = {
  async getTickets() {
    const response = await api.get("/support");
    return response.data;
  },

  async getTicketById(id: string) {
    const response = await api.get(`/support/${id}`);
    return response.data;
  },

  async createTicket(subject: string, description: string) {
    const response = await api.post("/support", { subject, description });
    return response.data;
  },

  async addReply(id: string, message: string) {
    const response = await api.post(`/support/${id}/reply`, { message });
    return response.data;
  },
};
