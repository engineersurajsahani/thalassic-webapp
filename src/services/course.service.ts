import { api } from "@/lib/axios";

export const courseService = {
  async getAllCourses() {
    const response = await api.get("/courses");
    return response.data;
  },

  async getMyEnrollments() {
    const response = await api.get("/courses/my");
    return response.data;
  },

  async enrollInCourse(courseId: string) {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  async updateCourseProgress(courseId: string, progress: number) {
    const response = await api.put(`/courses/${courseId}/progress`, { progress });
    return response.data;
  },
};
