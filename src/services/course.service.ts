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

  async enrollInCourse(
    courseId: string,
    optionsOrReferralCode?: string | { referralCode?: string; instituteId?: string; instituteName?: string; batchSchedule?: string }
  ) {
    const payload = typeof optionsOrReferralCode === 'string'
      ? { referralCode: optionsOrReferralCode || null }
      : {
          referralCode: optionsOrReferralCode?.referralCode || null,
          instituteId: optionsOrReferralCode?.instituteId || null,
          instituteName: optionsOrReferralCode?.instituteName || null,
          batchSchedule: optionsOrReferralCode?.batchSchedule || null,
        };

    console.log("[courseService] Enrolling in course with payload:", payload);

    const response = await api.post(`/courses/${courseId}/enroll`, payload);
    return response.data;
  },

  async updateCourseProgress(courseId: string, progress: number) {
    const response = await api.put(`/courses/${courseId}/progress`, { progress });
    return response.data;
  },
};
