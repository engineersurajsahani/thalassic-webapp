import { api } from "@/lib/axios";

export const notificationService = {
  async getNotifications() {
    try {
      const response = await api.get("/master/notifications");
      return response.data || [];
    } catch {
      return [];
    }
  },

  async markAsRead(id: string) {
    try {
      const response = await api.patch(`/master/notifications/${id}/read`);
      return response.data;
    } catch {
      return null;
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.post("/master/notifications/read-all");
      return response.data;
    } catch {
      return null;
    }
  },
};
