import { api } from "@/lib/axios";

export const notificationService = {
  async getNotifications() {
    const response = await api.get("/notifications");
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post("/notifications/read-all");
    return response.data;
  },
};
