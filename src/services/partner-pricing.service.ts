import { api } from "@/lib/axios";

export interface CoursePricingItem {
  id: string;
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

const STORAGE_KEY = "thalassic_partner_course_pricings_v1";

const INITIAL_PRICING_DATA: CoursePricingItem[] = [];

function getStoredData(): CoursePricingItem[] {
  if (typeof window === "undefined") return INITIAL_PRICING_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRICING_DATA));
      return INITIAL_PRICING_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PRICING_DATA;
  }
}

function saveStoredData(items: CoursePricingItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to persist course pricing in localStorage:", e);
  }
}

export const partnerPricingService = {
  async getCoursePricings(): Promise<CoursePricingItem[]> {
    try {
      const res = await api.get("/partner/pricing");
      if (res.data && Array.isArray(res.data)) return res.data;
    } catch (e) {
      // Fallback to client state
    }
    return getStoredData();
  },

  async submitProposedPrice(
    courseId: string,
    proposedPayableAmount: number,
  ): Promise<CoursePricingItem> {
    try {
      const res = await api.post(`/partner/pricing/${courseId}/propose`, {
        proposedPayableAmount,
      });
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const items = getStoredData();
    const idx = items.findIndex((x) => x.id === courseId);
    if (idx === -1) throw new Error("Course pricing record not found");

    const updated: CoursePricingItem = {
      ...items[idx],
      proposedPayableAmount,
      proposedDate: new Date().toISOString(),
      status: "Pending Approval",
      rejectionReason: undefined,
      lastUpdated: new Date().toISOString(),
    };

    items[idx] = updated;
    saveStoredData(items);
    return updated;
  },

  async approveProposedPrice(courseId: string): Promise<CoursePricingItem> {
    try {
      const res = await api.post(`/partner/pricing/${courseId}/approve`);
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const items = getStoredData();
    const idx = items.findIndex((x) => x.id === courseId);
    if (idx === -1) throw new Error("Course pricing record not found");

    const current = items[idx];
    const newPrice =
      current.proposedPayableAmount ?? current.activePayableAmount;

    const updated: CoursePricingItem = {
      ...current,
      activePayableAmount: newPrice,
      proposedPayableAmount: null,
      proposedDate: null,
      status: "Active",
      rejectionReason: undefined,
      lastUpdated: new Date().toISOString(),
    };

    items[idx] = updated;
    saveStoredData(items);
    return updated;
  },

  async rejectProposedPrice(
    courseId: string,
    reason?: string,
  ): Promise<CoursePricingItem> {
    try {
      const res = await api.post(`/partner/pricing/${courseId}/reject`, {
        reason,
      });
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const items = getStoredData();
    const idx = items.findIndex((x) => x.id === courseId);
    if (idx === -1) throw new Error("Course pricing record not found");

    const current = items[idx];

    const updated: CoursePricingItem = {
      ...current,
      proposedPayableAmount: null,
      proposedDate: null,
      status: "Rejected",
      rejectionReason:
        reason || "Price change request was rejected by Master Admin.",
      lastUpdated: new Date().toISOString(),
    };

    items[idx] = updated;
    saveStoredData(items);
    return updated;
  },
};
