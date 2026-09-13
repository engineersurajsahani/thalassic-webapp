import { api } from "@/lib/axios";

export interface CoursePricingItem {
  id: string;
  partnerId?: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  category: string;
  standardFee: number;
  activePayableAmount: number;
  proposedPayableAmount?: number | null;
  proposedDate?: string | null;
  status: "Active" | "Pending Approval" | "Rejected";
  rejectionReason?: string;
  lastUpdated: string;
}

export const partnerPricingService = {
  async getCoursePricings(partnerId?: string): Promise<CoursePricingItem[]> {
    const res = await api.get("/partner/pricing", {
      params: partnerId ? { partnerId } : undefined,
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  async submitProposedPrice(
    courseId: string,
    proposedPayableAmount: number,
    partnerId?: string,
    reason?: string,
  ): Promise<CoursePricingItem> {
    const res = await api.post(`/partner/pricing/${courseId}/propose`, {
      proposedPayableAmount,
      partnerId,
      reason,
    });
    return res.data;
  },

  async approveProposedPrice(
    courseId: string,
    partnerId?: string,
  ): Promise<CoursePricingItem> {
    const res = await api.post(`/partner/pricing/${courseId}/approve`, {
      partnerId,
    });
    return res.data;
  },

  async rejectProposedPrice(
    courseId: string,
    reason?: string,
    partnerId?: string,
  ): Promise<CoursePricingItem> {
    const res = await api.post(`/partner/pricing/${courseId}/reject`, {
      reason,
      partnerId,
    });
    return res.data;
  },
};
