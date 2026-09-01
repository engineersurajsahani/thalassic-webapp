import { api } from "@/lib/axios";

export const notificationService = {
  async getNotifications() {
    try {
      const response = await api.get("/notifications");
      return response.data || [];
    } catch (err: any) {
      // Gracefully return empty array on 401 or network error without throwing UI exception
      return [];
    }
  },

  async markAsRead(id: string) {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (err: any) {
      return null;
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.post("/notifications/read-all");
      return response.data;
    } catch (err: any) {
      return null;
    }
  },
};
