import { api } from "@/lib/axios";

export const masterService = {
  async getCourses() {
    const response = await api.get("/master/courses");
    return response.data;
  },

  async getDashboard() {
    const response = await api.get("/master/dashboard");
    return response.data;
  },

  async createCourse(dto: {
    code: string;
    name: string;
    category: string;
    duration: string;
    fees: string;
    description: string;
  }) {
    const response = await api.post("/master/courses", dto);
    return response.data;
  },

  async updateCourse(id: string, dto: Record<string, unknown>) {
    const response = await api.patch(`/master/courses/${id}`, dto);
    return response.data;
  },

  async deleteCourse(id: string) {
    const response = await api.delete(`/master/courses/${id}`);
    return response.data;
  },

  async getUsers(role?: string) {
    const response = await api.get("/master/users", { params: { role } });
    return response.data;
  },

  async getReports(days?: string) {
    const response = await api.get("/master/reports", { params: { days } });
    return response.data;
  },

  async createUser(dto: Record<string, unknown>) {
    const response = await api.post("/master/users", dto);
    return response.data;
  },

  async updateUserStatus(id: string, status: string) {
    const response = await api.patch(`/master/users/${id}/status`, { status });
    return response.data;
  },

  async getSettings() {
    const response = await api.get("/master/settings");
    return response.data;
  },

  async updateSettings(dto: Record<string, unknown>) {
    const response = await api.patch("/master/settings", dto);
    return response.data;
  },

  async getAdminProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  async updateAdminProfile(dto: {
    name?: string;
    email?: string;
    password?: string;
  }) {
    const response = await api.patch("/master/profile", dto);
    return response.data;
  },

  async changePassword(dto: { currentPassword?: string; newPassword: string }) {
    const response = await api.post("/master/settings/change-password", dto);
    return response.data;
  },
};
