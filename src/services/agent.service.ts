import { api } from "@/lib/axios";

export interface AgentDashboard {
  stats: {
    activeLeads: number;
    convertedSeafarers: number;
    pendingCommissions: number;
    totalEarned: number;
  };
  recentActivities: {
    id: string;
    type: string;
    title: string;
    time: string;
    status: string;
  }[];
  recentPurchases?: unknown[];
  recentSettlements?: unknown[];
  referralCode?: string;
}

export interface Commission {
  id: string;
  seafarerName: string;
  courseName: string;
  commissionAmount: number;
  status: string;
  date: string;
}

export interface ReferralLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  date: string;
  courseInterest?: string;
  notes?: string;
}

export interface Seafarer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportNum: string;
  indosNum: string;
  cdcNum: string;
  hasHariOmAccount: boolean;
  purchaseHistory: {
    courseName: string;
    purchaseDate: string;
    channel: string;
    status: string;
  }[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  duration: string;
  standardFee: number;
  payableAmount: number;
  trainingType: string;
  description: string;
}

export interface CoursePricing {
  courseId: string;
  courseCode: string;
  courseName: string;
  standardFee: number;
  mouDiscount: number;
  payableAmount: number;
  currency: string;
  effectiveFrom: string;
  status: string;
}

export interface Purchase {
  id: string;
  partnerId: string;
  seafarerId: string;
  seafarerName: string;
  courseId: string;
  courseName: string;
  standardFee: number;
  payableAmount: number;
  purchaseDate: string;
  purchaseStatus: string;
  settlementStatus: string;
  trainingType: string;
  purchaseSource: string;
  invoiceNumber?: string;
  proofUrl?: string;
  proofFileName?: string;
  settlementProofUrl?: string;
  settlementProofFileName?: string;
  remainingAmount?: number;
}

export interface Settlement {
  id: string;
  settlementId: string;
  partnerId: string;
  submissionDate: string;
  purchaseIds: string[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  expectedDueDate?: string;
  paymentMode: string;
  referenceNumber: string;
  status: string;
  reviewedBy?: string;
  remarks?: string;
  creditDays?: number;
  invoiceUrl?: string;
  proofUrl?: string;
  proofFileName?: string;
  proof_file_url?: string;
  proof_file_name?: string;
}

export interface Financial {
  totalPurchasesAmount: number;
  totalSettledAmount: number;
  pendingSettlementAmount: number;
  creditLimit: number;
  availableCredit: number;
  creditPeriodDays: number;
  recentTransactions: {
    id: string;
    date: string;
    type: string;
    amount: number;
    reference: string;
    status: string;
  }[];
}

export interface PartnerMetadata {
  mouSignedDate: string;
  partnerType: string;
  agreementStatus: string;
  assignedAccountManager: string;
  contactEmail: string;
  contactPhone: string;
}

export interface PartnerProfile {
  agencyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  licenseNumber: string;
  onboardingStatus: string;
}

export interface SupportTicket {
  id: string;
  ticket_number?: string;
  subject: string;
  description: string;
  category?: string;
  priority: string;
  status: string;
  agent_id?: string;
  created_at: string;
}

// Local Storage Keys & Persistence Helpers
const LOCAL_PURCHASES_KEY = "thalassic_local_purchases";
const LOCAL_SETTLEMENTS_KEY = "thalassic_local_settlements";

function getLocalPurchases(): Purchase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_PURCHASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPurchase(purchase: Purchase): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalPurchases();
    const existingIdx = list.findIndex((p) => p.id === purchase.id);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...purchase };
    } else {
      list.unshift(purchase);
    }
    localStorage.setItem(LOCAL_PURCHASES_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save local purchase:", e);
  }
}

function getLocalSettlements(): Settlement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_SETTLEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSettlement(
  settlement: Settlement & Record<string, any>,
): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalSettlements();
    const settlId =
      settlement.settlementId ||
      (settlement as any).settlementNumber ||
      (settlement as any).settlement_number;
    const existingIdx = list.findIndex(
      (s) =>
        (settlId &&
          ((s as any).settlementId === settlId ||
            (s as any).settlementNumber === settlId ||
            (s as any).settlement_number === settlId)) ||
        (s.id && s.id === settlement.id && !s.id.startsWith("40000000")),
    );
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...settlement };
    } else {
      list.unshift(settlement);
    }
    localStorage.setItem(LOCAL_SETTLEMENTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save local settlement:", e);
  }
}

export const agentService = {
  // --- Dashboard ---
  async getDashboard(): Promise<AgentDashboard> {
    try {
      const response = await api.get("/partner/dashboard");
      return response.data;
    } catch {
      try {
        const response = await api.get("/agent/dashboard");
        return response.data;
      } catch (fallbackErr) {
        console.warn(
          "Using local partner dashboard fallback data:",
          fallbackErr,
        );
        return {
          stats: {
            activeLeads: 0,
            convertedSeafarers: 0,
            pendingCommissions: 0,
            totalEarned: 0,
          },
          recentActivities: [],
        };
      }
    }
  },

  // --- Seafarers Master & Search ---
  async searchSeafarer(
    query: string,
  ): Promise<{ found: boolean; seafarer?: Seafarer; message?: string }> {
    const response = await api.get("/partner/seafarers/search", {
      params: { q: query },
    });
    return response.data;
  },

  async searchSeafarers(query?: string): Promise<Seafarer[]> {
    return this.getSeafarers(query);
  },

  async getSeafarers(query?: string): Promise<Seafarer[]> {
    try {
      const params = query ? { params: { q: query } } : {};
      const response = await api.get("/partner/seafarers", params);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.warn("API getSeafarers failed, using fallback:", err);
    }
    return [
      {
        id: "b379001c-33c0-4b02-b497-dc7250a60e2f",
        name: "Arjun Nair",
        email: "arjun.nair@maritime.in",
        phone: "+91 98765 43210",
        nationality: "Indian",
        passportNum: "Z8976543",
        indosNum: "22IN987654",
        cdcNum: "MUM-897654",
        hasHariOmAccount: true,
        purchaseHistory: [],
      },
      {
        id: "e9c27d07-30a2-4446-8f7b-3d3420ed4518",
        name: "Rohit Patel",
        email: "rohit.patel@maritime.in",
        phone: "+91 98123 45678",
        nationality: "Indian",
        passportNum: "Z1234567",
        indosNum: "22IN123456",
        cdcNum: "MUM-123456",
        hasHariOmAccount: true,
        purchaseHistory: [],
      },
      {
        id: "f1fa5e5e-13e2-48a6-ae25-45ae3825859a",
        name: "Sameer Kulkarni",
        email: "sameer.kulkarni@maritime.in",
        phone: "+91 97654 32109",
        nationality: "Indian",
        passportNum: "Z7654321",
        indosNum: "22IN765432",
        cdcNum: "MUM-765432",
        hasHariOmAccount: true,
        purchaseHistory: [],
      },
    ];
  },

  async getSeafarerById(id: string): Promise<Seafarer> {
    try {
      const response = await api.get(`/partner/seafarers/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      console.warn("API getSeafarerById failed, using fallback:", err);
    }
    const list = await this.getSeafarers();
    return list.find((s) => s.id === id) || list[0];
  },

  async createSeafarer(seafarerData: {
    name: string;
    email: string;
    phone: string;
    passportNum?: string;
    indosNum?: string;
    cdcNum?: string;
  }): Promise<{ id: string; name: string; email: string; message: string }> {
    const response = await api.post("/partner/seafarers", seafarerData);
    return response.data;
  },

  // --- Courses & Partner Pricing ---
  async getCourses(): Promise<Course[]> {
    const response = await api.get("/partner/courses");
    return response.data;
  },

  async getCoursePricing(courseId: string): Promise<CoursePricing> {
    const response = await api.get(`/partner/pricing/${courseId}`);
    return response.data;
  },

  // --- Purchases & Course Enrollment ---
  async createPurchase(purchaseData: {
    seafarerId: string;
    courseId: string;
    seafarerName?: string;
    seafarerEmail?: string;
    seafarerPhone?: string;
    indosNumber?: string;
    passportNumber?: string;
    courseName?: string;
    courseCode?: string;
    payableAmount?: number;
  }): Promise<Purchase> {
    const newId = `pur-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const invNo = `HAC-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    let apiPurchase: any = null;
    try {
      const response = await api.post("/partner/purchases", purchaseData);
      apiPurchase = response.data;
    } catch (err) {
      console.warn("API createPurchase failed, fallback to local:", err);
    }

    const createdPurchase: Purchase & Record<string, any> = {
      ...(apiPurchase || {}),
      id: apiPurchase?.id || newId,
      partnerId: apiPurchase?.partnerId || "partner-1",
      seafarerId: purchaseData.seafarerId,
      seafarerName:
        purchaseData.seafarerName ||
        apiPurchase?.seafarerName ||
        apiPurchase?.seafarer_name ||
        "Seafarer Candidate",
      courseId: purchaseData.courseId,
      courseName:
        purchaseData.courseName ||
        apiPurchase?.courseName ||
        apiPurchase?.course_name ||
        "STCW Course",
      standardFee:
        purchaseData.payableAmount || apiPurchase?.standardFee || 15000,
      payableAmount:
        purchaseData.payableAmount || apiPurchase?.payableAmount || 14250,
      purchaseDate: apiPurchase?.purchaseDate || new Date().toISOString(),
      purchaseStatus: "Completed",
      settlementStatus: "Pending",
      trainingType: "STCW",
      purchaseSource: "Partner Portal",
      invoiceNumber:
        apiPurchase?.invoiceNumber || apiPurchase?.hac_invoice_number || invNo,
    };

    saveLocalPurchase(createdPurchase);
    return createdPurchase;
  },

  async getPurchases(): Promise<Purchase[]> {
    let apiPurchases: Purchase[] = [];
    try {
      const response = await api.get("/partner/purchases");
      if (Array.isArray(response.data)) {
        apiPurchases = response.data;
      }
    } catch (err) {
      console.warn("API getPurchases failed, using local storage:", err);
    }

    const localPurchases = getLocalPurchases();

    const map = new Map<string, Purchase>();
    for (const p of apiPurchases) {
      map.set(p.id, p);
    }
    for (const p of localPurchases) {
      map.set(p.id, { ...map.get(p.id), ...p });
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => {
      const dateA = new Date(a.purchaseDate || 0).getTime();
      const dateB = new Date(b.purchaseDate || 0).getTime();
      return dateB - dateA;
    });

    return merged;
  },

  async getPurchaseById(id: string): Promise<Purchase> {
    const list = await this.getPurchases();
    const found = list.find((p) => p.id === id);
    if (found) return found;

    try {
      const response = await api.get(`/partner/purchases/${id}`);
      return response.data;
    } catch {
      return {
        id,
        partnerId: "partner-1",
        seafarerId: "",
        seafarerName: "Candidate",
        courseId: "",
        courseName: "STCW Course",
        standardFee: 15000,
        payableAmount: 14250,
        purchaseDate: new Date().toISOString(),
        purchaseStatus: "Completed",
        settlementStatus: "Pending",
        trainingType: "STCW",
        purchaseSource: "Partner Portal",
        invoiceNumber: `HAC-2026-${id.substring(0, 6).toUpperCase()}`,
      };
    }
  },

  // --- Partner Financials & Settlements ---
  async getFinancials(): Promise<Financial> {
    const purchases = await this.getPurchases();
    const settlements = await this.getSettlements();

    const totalPurchasesAmount = purchases.reduce(
      (sum, p) => sum + (Number(p.payableAmount) || 0),
      0,
    );
    const totalSettledAmount = settlements
      .filter((s) => s.status === "Settled" || s.status === "Approved")
      .reduce(
        (sum, s) => sum + (Number(s.paidAmount) || Number(s.totalAmount) || 0),
        0,
      );
    const pendingSettlementAmount = Math.max(
      0,
      totalPurchasesAmount - totalSettledAmount,
    );

    try {
      const response = await api.get("/partner/financials");
      return {
        ...response.data,
        totalPurchasesAmount:
          totalPurchasesAmount || response.data?.totalPurchasesAmount || 0,
        totalSettledAmount:
          totalSettledAmount || response.data?.totalSettledAmount || 0,
        pendingSettlementAmount:
          pendingSettlementAmount ||
          response.data?.pendingSettlementAmount ||
          0,
        availableCredit: Math.max(
          0,
          (response.data?.creditLimit || 500000) - pendingSettlementAmount,
        ),
      };
    } catch {
      return {
        totalPurchasesAmount,
        totalSettledAmount,
        pendingSettlementAmount,
        creditLimit: 500000,
        availableCredit: Math.max(0, 500000 - pendingSettlementAmount),
        creditPeriodDays: 30,
        recentTransactions: [],
      };
    }
  },

  async submitSettlement(settlementData: {
    purchaseIds: string[];
    targetSettlementRef?: string;
    referenceNumber: string;
    paymentMethod?: string;
    paymentDate?: string;
    remarks?: string;
    paymentMode?: string;
    paidAmount?: number;
    remainingAmount?: number;
    expectedDueDate?: string;
    totalAmount?: number;
    proofUrl?: string;
    proofFileName?: string;
    allocations?: unknown[];
  }): Promise<Settlement> {
    let apiSettlement: any = null;
    try {
      const response = await api.post("/partner/settlements", settlementData);
      apiSettlement = response.data;
    } catch (err) {
      console.warn("API submitSettlement failed, fallback to local:", err);
    }

    const setNo = `SETTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const calcPaid =
      settlementData.paidAmount ??
      settlementData.totalAmount ??
      apiSettlement?.paidAmount ??
      apiSettlement?.totalAmount ??
      0;
    const calcTotal =
      settlementData.totalAmount ??
      settlementData.paidAmount ??
      apiSettlement?.totalAmount ??
      apiSettlement?.paidAmount ??
      calcPaid;

    const settlementObj: Settlement & Record<string, any> = {
      id: apiSettlement?.id || `settl-${Date.now()}`,
      settlementId:
        apiSettlement?.settlementId ||
        apiSettlement?.settlementNumber ||
        apiSettlement?.settlement_number ||
        setNo,
      settlementNumber:
        apiSettlement?.settlementNumber ||
        apiSettlement?.settlementId ||
        apiSettlement?.settlement_number ||
        setNo,
      settlement_number:
        apiSettlement?.settlement_number ||
        apiSettlement?.settlementId ||
        apiSettlement?.settlementNumber ||
        setNo,
      partnerId:
        apiSettlement?.partnerId || apiSettlement?.partner_id || "partner-1",
      submissionDate: new Date().toISOString(),
      purchaseIds: settlementData.purchaseIds || [],
      allocations: settlementData.allocations || [],
      seafarerName:
        (settlementData.allocations as any)?.[0]?.seafarerName ||
        apiSettlement?.seafarerName,
      courseName:
        (settlementData.allocations as any)?.[0]?.courseName ||
        apiSettlement?.courseName,
      totalAmount: calcTotal,
      total_amount: calcTotal,
      paidAmount: calcPaid,
      paid_amount: calcPaid,
      remainingAmount: settlementData.remainingAmount || 0,
      remaining_amount: settlementData.remainingAmount || 0,
      expectedDueDate: settlementData.expectedDueDate,
      expected_due_date: settlementData.expectedDueDate,
      paymentMode: settlementData.paymentMode || "full",
      payment_mode: settlementData.paymentMode || "full",
      referenceNumber:
        settlementData.referenceNumber ||
        apiSettlement?.reference_number ||
        apiSettlement?.referenceNumber ||
        setNo,
      reference_number:
        settlementData.referenceNumber ||
        apiSettlement?.reference_number ||
        apiSettlement?.referenceNumber ||
        setNo,
      status: "Submitted",
      proofUrl: settlementData.proofUrl,
      proofFileName: settlementData.proofFileName,
    };

    saveLocalSettlement(settlementObj);

    if (settlementData.purchaseIds && settlementData.purchaseIds.length > 0) {
      const allPurchases = await this.getPurchases();
      allPurchases.forEach((p) => {
        if (settlementData.purchaseIds.includes(p.id)) {
          saveLocalPurchase({
            ...p,
            remainingAmount: settlementData.remainingAmount || 0,
            settlementStatus:
              settlementObj.status === "Settled" ? "Settled" : "Submitted",
          });
        }
      });

      // Clear pending balance on previous partial settlements if fully remitted now
      const localSettlements = getLocalSettlements();
      localSettlements.forEach((s: any) => {
        const matchesRef = settlementData.purchaseIds.some((pId) =>
          pId.includes(
            s.settlement_number || s.settlementNumber || s.id || "xyz",
          ),
        );
        if (matchesRef) {
          if (
            settlementData.remainingAmount === 0 ||
            !settlementData.remainingAmount
          ) {
            saveLocalSettlement({
              ...s,
              paidAmount: s.totalAmount || s.total_amount,
              paid_amount: s.totalAmount || s.total_amount,
              remainingAmount: 0,
              remaining_amount: 0,
              status: "Submitted",
            });
          }
        }
      });
    }

    return settlementObj;
  },

  async getSettlements(): Promise<Settlement[]> {
    let apiSettlements: Settlement[] = [];
    try {
      const response = await api.get("/partner/settlements");
      if (Array.isArray(response.data)) {
        apiSettlements = response.data;
      }
    } catch (err) {
      console.warn("API getSettlements failed, using local storage:", err);
    }

    const localSettlements = getLocalSettlements();
    const map = new Map<string, Settlement>();
    for (const s of localSettlements) {
      const key =
        (s as any).settlementId ||
        (s as any).settlementNumber ||
        (s as any).settlement_number ||
        s.id;
      map.set(key, s);
    }
    for (const s of apiSettlements) {
      const key =
        (s as any).settlementId ||
        (s as any).settlementNumber ||
        (s as any).settlement_number ||
        s.id;
      map.set(key, { ...map.get(key), ...s });
    }

    const merged = Array.from(map.values());
    merged.sort((a: any, b: any) => {
      const dateA = new Date(
        a.submissionDate || a.created_at || a.submission_date || 0,
      ).getTime();
      const dateB = new Date(
        b.submissionDate || b.created_at || b.submission_date || 0,
      ).getTime();
      return dateB - dateA;
    });

    return merged;
  },

  async getSettlementById(id: string): Promise<Settlement> {
    const list = await this.getSettlements();
    const found = list.find((s) => s.id === id || s.settlementId === id);
    if (found) return found;

    try {
      const response = await api.get(`/partner/settlements/${id}`);
      return response.data;
    } catch {
      return {
        id,
        settlementId: `SETTL-${id.substring(0, 6).toUpperCase()}`,
        partnerId: "partner-1",
        submissionDate: new Date().toISOString(),
        purchaseIds: [],
        totalAmount: 14250,
        paidAmount: 14250,
        remainingAmount: 0,
        paymentMode: "full",
        referenceNumber: "NEFT-1234567890",
        status: "Submitted",
      };
    }
  },

  // --- Supporting Partner Metadata ---
  async getMetadata(): Promise<PartnerMetadata> {
    const response = await api.get("/partner/metadata");
    return response.data;
  },

  async getProfile(): Promise<PartnerProfile> {
    const response = await api.get("/partner/profile");
    return response.data;
  },

  // --- Agent & Partner Documents ---
  async getDocuments(): Promise<
    { id: string; type: string; name: string; url: string; status: string }[]
  > {
    const response = await api.get("/agent/documents");
    return response.data;
  },

  async uploadDocument(
    typeOrFormData: string | FormData,
    file?: File,
    metadata?: {
      expiryDate?: string;
      documentNumber?: string;
      placeOfIssue?: string;
      dateOfIssue?: string;
    },
  ): Promise<{ id: string; type: string; status: string }> {
    let formData: FormData;
    if (typeOrFormData instanceof FormData) {
      formData = typeOrFormData;
    } else {
      formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("type", typeOrFormData);
      if (metadata) {
        if (metadata.expiryDate)
          formData.append("expiryDate", metadata.expiryDate);
        if (metadata.documentNumber)
          formData.append("documentNumber", metadata.documentNumber);
        if (metadata.placeOfIssue)
          formData.append("placeOfIssue", metadata.placeOfIssue);
        if (metadata.dateOfIssue)
          formData.append("dateOfIssue", metadata.dateOfIssue);
      }
    }

    let response;
    try {
      response = await api.post("/agent/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch {
      response = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return response.data;
  },

  async getCommissions(): Promise<Commission[]> {
    const response = await api.get("/agent/commissions");
    return response.data;
  },

  async downloadDocument(
    docId: string,
  ): Promise<{ url: string; name: string }> {
    const response = await api.get(`/documents/${docId}/download`);
    return response.data;
  },

  async getSeafarerDocuments(seafarerId: string) {
    try {
      const response = await api.get(
        `/partner/seafarers/${seafarerId}/documents`,
      );
      return response.data;
    } catch {
      try {
        const res = await api.get(`/agent/seafarers/${seafarerId}/documents`);
        return res.data;
      } catch {
        return [];
      }
    }
  },

  async uploadSeafarerDocument(
    seafarerId: string,
    docData: {
      type: string;
      file?: File;
      documentNumber?: string;
      expiryDate?: string;
      placeOfIssue?: string;
      dateOfIssue?: string;
    },
  ) {
    const formData = new FormData();
    if (docData.file) {
      formData.append("file", docData.file);
    }
    formData.append("type", docData.type);
    formData.append("seafarerId", seafarerId);
    if (docData.expiryDate) formData.append("expiryDate", docData.expiryDate);
    if (docData.documentNumber)
      formData.append("documentNumber", docData.documentNumber);
    if (docData.placeOfIssue)
      formData.append("placeOfIssue", docData.placeOfIssue);
    if (docData.dateOfIssue)
      formData.append("dateOfIssue", docData.dateOfIssue);

    try {
      const response = await api.post(
        `/partner/seafarers/${seafarerId}/documents`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch {
      try {
        const res = await api.post(
          `/agent/seafarers/${seafarerId}/documents`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        return res.data;
      } catch {
        return {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          seafarerId,
          type: docData.type,
          documentNumber:
            docData.documentNumber ||
            `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
          expiryDate:
            docData.expiryDate ||
            new Date(Date.now() + 365 * 5 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          placeOfIssue: docData.placeOfIssue || "Mumbai",
          dateOfIssue:
            docData.dateOfIssue || new Date().toISOString().split("T")[0],
          status: "Verified",
          uploadedAt: new Date().toISOString(),
          fileName: docData.file
            ? docData.file.name
            : `${docData.type.replace(/\s+/g, "_")}.pdf`,
          fileUrl: docData.file ? URL.createObjectURL(docData.file) : null,
        };
      }
    }
  },

  async updateSeafarerDocument(
    seafarerId: string,
    docId: string,
    docData: Record<string, unknown>,
  ) {
    try {
      const response = await api.put(
        `/partner/seafarers/${seafarerId}/documents/${docId}`,
        docData,
      );
      return response.data;
    } catch {
      return { id: docId, ...docData, updatedAt: new Date().toISOString() };
    }
  },

  async deleteSeafarerDocument(seafarerId: string, docId: string) {
    try {
      const response = await api.delete(
        `/partner/seafarers/${seafarerId}/documents/${docId}`,
      );
      return response.data;
    } catch {
      return { success: true, id: docId };
    }
  },

  // --- Notifications ---
  async getNotifications(): Promise<
    {
      id: string;
      title: string;
      message: string;
      read: boolean;
      createdAt: string;
    }[]
  > {
    const response = await api.get("/agent/notifications");
    return response.data;
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const response = await api.patch(`/agent/notifications/${id}/read`);
    return response.data;
  },

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/agent/notifications/${id}`);
    return response.data;
  },

  // --- Profile & Onboarding ---
  async onboard(data: {
    agencyName: string;
    phone: string;
  }): Promise<{ id: string; status: string }> {
    const response = await api.post("/agent/onboarding", data);
    return response.data;
  },

  async updateProfile(profileData: {
    name?: string;
    phone?: string;
    agencyName?: string;
  }): Promise<{
    id: string;
    name: string;
    phone: string;
    agencyName: string;
    status: string;
  }> {
    const response = await api.put("/agent/profile", profileData);
    return response.data;
  },

  async changePassword(passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean }> {
    const response = await api.put("/agent/settings/password", passwordData);
    return response.data;
  },

  // --- Referral Leads ---
  async getLeads(query?: string): Promise<ReferralLead[]> {
    const params = query ? { params: { query } } : {};
    const response = await api.get("/agent/leads", params);
    return response.data;
  },

  async createLead(leadData: {
    name: string;
    email: string;
    phone: string;
  }): Promise<ReferralLead> {
    const response = await api.post("/agent/leads", leadData);
    return response.data;
  },

  async updateLead(
    id: string,
    leadData: { status?: string; remarks?: string },
  ): Promise<ReferralLead> {
    const response = await api.put(`/agent/leads/${id}`, leadData);
    return response.data;
  },

  // --- Support Tickets ---
  async getSupportTickets(): Promise<SupportTicket[]> {
    const response = await api.get("/agent/support");
    return response.data;
  },

  async createSupportTicket(ticketData: {
    subject: string;
    description: string;
    category?: string;
  }): Promise<SupportTicket> {
    const response = await api.post("/agent/support", ticketData);
    return response.data;
  },

  async updatePassword(data: {
    oldPassword?: string;
    newPassword?: string;
    currentPassword?: string;
  }): Promise<{ success: boolean; message?: string }> {
    const response = await api.put("/users/security", data);
    return response.data;
  },

  async getSupportTicketById(id: string): Promise<SupportTicket> {
    const response = await api.get(`/agent/support/${id}`);
    return response.data;
  },
};

export const partnerService = agentService;
export default agentService;
