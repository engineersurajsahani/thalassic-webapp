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

const INITIAL_PRICING_DATA: CoursePricingItem[] = [
  {
    id: "c-bst-001",
    courseCode: "BST-001",
    courseName: "STCW Basic Safety Training (BST)",
    category: "Safety & Emergency",
    standardFee: 12000,
    activePayableAmount: 10000,
    proposedPayableAmount: null,
    status: "Active",
    lastUpdated: "2026-08-15T10:00:00.000Z",
  },
  {
    id: "c-aff-002",
    courseCode: "AFF-002",
    courseName: "Advanced Fire Fighting (AFF)",
    category: "Fire & Safety Ops",
    standardFee: 15000,
    activePayableAmount: 12500,
    proposedPayableAmount: 13000,
    proposedDate: "2026-08-28T14:30:00.000Z",
    status: "Pending Approval",
    lastUpdated: "2026-08-28T14:30:00.000Z",
  },
  {
    id: "c-mfa-003",
    courseCode: "MFA-003",
    courseName: "Medical First Aid (MFA)",
    category: "Medical Care",
    standardFee: 8000,
    activePayableAmount: 6500,
    proposedPayableAmount: null,
    status: "Active",
    lastUpdated: "2026-08-10T12:00:00.000Z",
  },
  {
    id: "c-pscrb-004",
    courseCode: "PSCRB-004",
    courseName: "Proficiency in Survival Craft & Rescue Boats",
    category: "Lifeboat & Survival",
    standardFee: 14000,
    activePayableAmount: 11000,
    proposedPayableAmount: null,
    status: "Active",
    lastUpdated: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "c-tco-005",
    courseCode: "TCO-005",
    courseName: "Tanker Cargo Operations (TCO)",
    category: "Cargo & Vessel Ops",
    standardFee: 18000,
    activePayableAmount: 15000,
    proposedPayableAmount: 16000,
    proposedDate: "2026-08-30T11:15:00.000Z",
    status: "Pending Approval",
    lastUpdated: "2026-08-30T11:15:00.000Z",
  },
  {
    id: "c-snr-006",
    courseCode: "SNR-006",
    courseName: "Ship Navigation & Radar Operations",
    category: "Nautical & Bridge",
    standardFee: 22000,
    activePayableAmount: 18500,
    proposedPayableAmount: null,
    status: "Active",
    lastUpdated: "2026-08-20T16:45:00.000Z",
  },
];

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

  async submitProposedPrice(courseId: string, proposedPayableAmount: number): Promise<CoursePricingItem> {
    try {
      const res = await api.post(`/partner/pricing/${courseId}/propose`, { proposedPayableAmount });
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
    const newPrice = current.proposedPayableAmount ?? current.activePayableAmount;

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

  async rejectProposedPrice(courseId: string, reason?: string): Promise<CoursePricingItem> {
    try {
      const res = await api.post(`/partner/pricing/${courseId}/reject`, { reason });
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
      rejectionReason: reason || "Price change request was rejected by Master Admin.",
      lastUpdated: new Date().toISOString(),
    };

    items[idx] = updated;
    saveStoredData(items);
    return updated;
  },
};
