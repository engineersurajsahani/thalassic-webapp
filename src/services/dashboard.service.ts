import { api } from "@/lib/axios";

export const dashboardService = {
  async getDashboardData() {
    try {
      const response = await api.get("/seafarer/dashboard");
      return response.data;
    } catch {
      const fallbackRes = await api
        .get("/dashboard")
        .catch(() => ({ data: null }));
      return fallbackRes.data;
    }
  },
};
