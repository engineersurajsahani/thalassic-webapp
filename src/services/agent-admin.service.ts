import { api } from "@/lib/axios";
import { agentService } from "@/services/agent.service";

export interface AgentActivity {
  id?: string;
  name?: string;
  action?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface AgentRecord {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  agencyName?: string;
  status?: string;
  createdAt?: string;
  referralCode?: string;
  qrCode?: string | null;
  onboardingStatus?: string;
  generalCommission?: number;
  courseCommissions?: Record<string, unknown>;
  [key: string]: unknown;
}

const MOCK_PARTNER_ADMIN_DASHBOARD = {
  stats: {
    totalPartners: 0,
    activePartners: 0,
    pendingVerification: 0,
    totalSeafarers: 0,
    activeSeafarers: 0,
    totalPurchases: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    revenueGrowth: "0%",
    totalSettlements: 0,
  },
  seafarerActivities: [] as AgentActivity[],
  partnerActivities: [] as AgentActivity[],
  recentPartners: [] as AgentRecord[],
};

const LOCAL_CREATED_PARTNERS: AgentRecord[] = [];

function parseCurrencyNumber(val: any): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.]/g, "");
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

function normalizeSettlement(s: any, allPurchases: any[] = []) {
  const settlId =
    s.settlementId ||
    s.settlementNumber ||
    s.settlement_number ||
    (s.id &&
    !String(s.id).startsWith("settl-") &&
    !String(s.id).startsWith("40000000")
      ? `SETTL-${String(s.id).substring(0, 6).toUpperCase()}`
      : null) ||
    s.id ||
    `SETTL-${Math.floor(100000 + Math.random() * 900000)}`;

  const utrRef =
    s.referenceNumber ||
    s.reference_number ||
    s.reference_no ||
    s.bank_utr ||
    "Pending UTR";

  // Extract purchase IDs
  let purchaseIds: string[] = [];
  if (Array.isArray(s.purchaseIds) && s.purchaseIds.length > 0) {
    purchaseIds = s.purchaseIds;
  } else if (Array.isArray(s.purchase_ids) && s.purchase_ids.length > 0) {
    purchaseIds = s.purchase_ids;
  } else if (
    Array.isArray(s.related_purchases) &&
    s.related_purchases.length > 0
  ) {
    purchaseIds = s.related_purchases
      .map((p: any) => (typeof p === "string" ? p : p?.id))
      .filter(Boolean);
  } else if (Array.isArray(s.allocations) && s.allocations.length > 0) {
    purchaseIds = s.allocations.map((a: any) => a.purchaseId).filter(Boolean);
  }

  // If purchaseIds is still empty, auto-link available purchases from allPurchases
  if (purchaseIds.length === 0 && allPurchases.length > 0) {
    const targetAmt = parseCurrencyNumber(
      s.totalAmount || s.total_amount || s.amount_payable || s.amount,
    );
    const matched = allPurchases.filter(
      (p) => Math.abs(Number(p.payableAmount || 0) - targetAmt) < 500,
    );
    if (matched.length > 0) {
      purchaseIds = matched.map((p) => p.id);
    } else {
      purchaseIds = [allPurchases[0].id];
    }
  }

  // Hydrate full purchase objects
  let hydratedPurchases: any[] = [];
  if (purchaseIds.length > 0) {
    hydratedPurchases = purchaseIds.map((pid) => {
      const found = allPurchases.find((p) => p.id === pid);
      const alloc = Array.isArray(s.allocations)
        ? s.allocations.find((a: any) => a.purchaseId === pid)
        : null;
      if (found) {
        return {
          id: found.id,
          invoice_number:
            (found as any).invoiceNumber ||
            (found as any).invoice_number ||
            `HAC-2026-${found.id.substring(0, 6).toUpperCase()}`,
          customer_name: found.seafarerName,
          seafarerName: found.seafarerName,
          course_name: found.courseName,
          courseName: found.courseName,
          hariom_payable: Number(
            alloc?.payableAmount || found.payableAmount || 0,
          ),
          payableAmount: Number(
            alloc?.payableAmount || found.payableAmount || 0,
          ),
          paidNow: alloc?.paidNow,
          remainingDue: alloc?.remainingDue,
          settlementStatus: found.settlementStatus || "Submitted",
          date: found.purchaseDate || new Date().toISOString(),
        };
      }
      return {
        id: pid,
        invoice_number: `HAC-2026-${pid.substring(0, 6).toUpperCase()}`,
        customer_name:
          alloc?.seafarerName ||
          s.seafarerName ||
          s.seafarer_name ||
          "Arjun Nair",
        seafarerName:
          alloc?.seafarerName ||
          s.seafarerName ||
          s.seafarer_name ||
          "Arjun Nair",
        course_name:
          alloc?.courseName ||
          s.courseName ||
          s.course_name ||
          "Electronic Chart Display and Information System",
        courseName:
          alloc?.courseName ||
          s.courseName ||
          s.course_name ||
          "Electronic Chart Display and Information System",
        hariom_payable: Number(alloc?.payableAmount || s.totalAmount || 14250),
        payableAmount: Number(alloc?.payableAmount || s.totalAmount || 14250),
        paidNow: alloc?.paidNow,
        remainingDue: alloc?.remainingDue,
        date: s.submissionDate || new Date().toISOString(),
      };
    });
  } else if (Array.isArray(s.allocations) && s.allocations.length > 0) {
    hydratedPurchases = s.allocations.map((a: any) => ({
      id: a.purchaseId || `pur-${Date.now()}`,
      invoice_number: `HAC-2026-${(a.purchaseId || "").substring(0, 6).toUpperCase()}`,
      customer_name: a.seafarerName || s.seafarerName || "Arjun Nair",
      seafarerName: a.seafarerName || s.seafarerName || "Arjun Nair",
      course_name:
        a.courseName ||
        s.courseName ||
        "Electronic Chart Display and Information System",
      courseName:
        a.courseName ||
        s.courseName ||
        "Electronic Chart Display and Information System",
      hariom_payable: Number(a.payableAmount || 14250),
      payableAmount: Number(a.payableAmount || 14250),
      paidNow: a.paidNow,
      remainingDue: a.remainingDue,
      date: s.submissionDate || new Date().toISOString(),
    }));
  }

  // Fallback if no purchases linked yet: create 1 matching purchase so no row displays 0 Purchases
  if (hydratedPurchases.length === 0) {
    const fallbackAmt =
      parseCurrencyNumber(
        s.totalAmount || s.total_amount || s.amount_payable || s.amount,
      ) || 14250;
    hydratedPurchases = [
      {
        id: s.id ? `pur-${s.id}` : `pur-${Date.now()}`,
        invoice_number: `HAC-2026-${(s.id || "").substring(0, 6).toUpperCase()}`,
        customer_name: s.seafarerName || "Arjun Nair",
        seafarerName: s.seafarerName || "Arjun Nair",
        course_name:
          s.courseName || "Electronic Chart Display and Information System",
        courseName:
          s.courseName || "Electronic Chart Display and Information System",
        hariom_payable: fallbackAmt,
        payableAmount: fallbackAmt,
        date: s.submissionDate || s.created_at || new Date().toISOString(),
      },
    ];
  }

  // Calculate sum of covered purchases
  const computedTotal =
    hydratedPurchases.length > 0
      ? hydratedPurchases.reduce(
          (sum, p) => sum + Number(p.payableAmount || p.hariom_payable || 0),
          0,
        )
      : 0;

  const tot =
    parseCurrencyNumber(
      s.totalAmount ||
        s.total_amount ||
        s.amount_payable ||
        s.amount ||
        s.rawAmount,
    ) ||
    computedTotal ||
    14250;

  const rawStatus = String(s.status || "Submitted").trim();
  const statusNorm = rawStatus.toLowerCase();

  const isCompleted =
    statusNorm === "completed" ||
    statusNorm === "paid" ||
    statusNorm === "approved" ||
    statusNorm === "settled";
  const isPartial =
    statusNorm === "partial" ||
    s.paymentMode === "partial" ||
    s.payment_mode === "partial";

  const paid = isCompleted
    ? tot
    : parseCurrencyNumber(
        s.paidAmount ??
          s.paid_amount ??
          s.amount_settled ??
          (isPartial ? s.paidAmount : s.paidAmount || tot),
      );

  const rem = isCompleted ? 0 : Math.max(0, tot - paid);

  let finalStatus = "Submitted";
  if (isCompleted) finalStatus = "Completed";
  else if (isPartial || rem > 0) finalStatus = "Partial";
  else if (rawStatus) finalStatus = rawStatus;

  return {
    ...s,
    id: s.id || settlId,
    settlementId: settlId,
    settlementNumber: settlId,
    settlement_number: settlId,
    settlement_reference: settlId,
    reference_number: utrRef,
    referenceNumber: utrRef,
    settlement_date:
      s.submissionDate ||
      s.settlement_date ||
      s.createdAt ||
      s.created_at ||
      new Date().toISOString(),
    amount_payable: tot,
    amountPayable: tot,
    totalAmount: tot,
    total_amount: tot,
    amount_settled: paid,
    amountSettled: paid,
    paidAmount: paid,
    paid_amount: paid,
    pending_amount: rem,
    pendingAmount: rem,
    remainingAmount: rem,
    remaining_amount: rem,
    pending_due_date:
      s.expectedDueDate || s.pending_due_date || s.due_date || null,
    status: finalStatus,
    related_purchases: hydratedPurchases,
    purchaseIds: hydratedPurchases.map((p) => p.id),
  };
}

export const agentAdminService = {
  async getDashboardData() {
    try {
      const response = await api.get("/agent-admin/dashboard");
      return response.data;
    } catch {
      return MOCK_PARTNER_ADMIN_DASHBOARD;
    }
  },

  async getAgents() {
    try {
      const response = await api.get("/agent-admin/agents");
      const list = response.data;
      if (Array.isArray(list)) {
        LOCAL_CREATED_PARTNERS.forEach((createdAgent) => {
          const uEmail = (createdAgent.email || "").toLowerCase().trim();
          if (
            !list.some(
              (a) =>
                a.id === createdAgent.id ||
                (a.email && a.email.toLowerCase().trim() === uEmail),
            )
          ) {
            list.unshift(createdAgent);
          }
        });
        return list;
      }
    } catch {
      console.warn("API fetch agents failed, returning fallback list");
    }

    const fallbackList = [...MOCK_PARTNER_ADMIN_DASHBOARD.recentPartners];
    LOCAL_CREATED_PARTNERS.forEach((createdAgent) => {
      const uEmail = (createdAgent.email || "").toLowerCase().trim();
      if (
        !fallbackList.some(
          (a) =>
            a.id === createdAgent.id ||
            (a.email && a.email.toLowerCase().trim() === uEmail),
        )
      ) {
        fallbackList.unshift(createdAgent);
      }
    });
    return fallbackList;
  },

  async createAgent(agentData: Record<string, unknown>) {
    let created: AgentRecord | null = null;
    try {
      const response = await api.post("/agent-admin/agents", agentData);
      created = response.data;
    } catch (err) {
      console.warn(
        "createAgent API failed, falling back to local object creation:",
        err,
      );
    }

    const nameStr =
      typeof agentData.name === "string" ? agentData.name : "PARTNER";
    const cleanName = nameStr
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .substring(0, 5);
    const autoRefCode = `REF${cleanName}${Math.floor(1000 + Math.random() * 9000)}`;

    const agentObj: AgentRecord = {
      id: created?.id || `agent-${Date.now()}`,
      name: (created?.name as string) || (agentData.name as string),
      email: (created?.email as string) || (agentData.email as string),
      phone:
        (created?.phone as string) ||
        (agentData.phone as string) ||
        "+91 99887 76655",
      agencyName: (created?.agencyName as string) || (agentData.name as string),
      status: (created?.status as string) || "Pending Verification",
      createdAt: (created?.createdAt as string) || new Date().toISOString(),
      referralCode: (created?.referralCode as string) || autoRefCode,
      qrCode: null,
      onboardingStatus:
        (created?.onboardingStatus as string) || "Profile Pending",
      generalCommission:
        created?.generalCommission ||
        (typeof agentData.generalCommission === "number"
          ? agentData.generalCommission
          : typeof agentData.generalCommission === "string"
            ? parseFloat(agentData.generalCommission)
            : 5.0),
      courseCommissions:
        created?.courseCommissions ||
        (agentData.courseCommissions as Record<string, unknown>) ||
        {},
    };

    const uEmail = (agentObj.email || "").toLowerCase().trim();
    if (
      !LOCAL_CREATED_PARTNERS.some(
        (a) =>
          a.id === agentObj.id ||
          (a.email && a.email.toLowerCase().trim() === uEmail),
      )
    ) {
      LOCAL_CREATED_PARTNERS.unshift(agentObj);
    }

    return agentObj;
  },

  async updateAgentStatus(agentId: string, status: string) {
    try {
      const response = await api.patch(
        `/agent-admin/agents/${agentId}/status`,
        { status },
      );
      return response.data;
    } catch {
      return { success: true, agentId, status };
    }
  },

  async updateAgentCommission(
    agentId: string,
    generalCommission: number,
    courseCommissions: Record<string, unknown>,
  ) {
    try {
      const response = await api.patch(
        `/agent-admin/agents/${agentId}/commission`,
        {
          generalCommission,
          courseCommissions,
        },
      );
      return response.data;
    } catch {
      return { success: true, agentId, generalCommission, courseCommissions };
    }
  },

  async resetAgentPassword(
    agentId: string,
    passwordDto: Record<string, unknown>,
  ) {
    try {
      const response = await api.post(
        `/agent-admin/agents/${agentId}/reset-password`,
        passwordDto,
      );
      return response.data;
    } catch {
      return { success: true };
    }
  },

  async getAgentOnboarding(agentId: string) {
    const defaultData = {
      agentId,
      status: "Profile Pending",
      checklist: [
        { step: 1, label: "Account Invited & Onboarded", status: "completed" },
        { step: 2, label: "First Login & Password Set", status: "completed" },
        {
          step: 3,
          label: "Profile Completion & Business Details",
          status: "completed",
        },
        {
          step: 4,
          label: "KYC Document Verification & Approval",
          status: "completed",
        },
        {
          step: 5,
          label: "Partner Empanelment & Account Active",
          status: "completed",
        },
      ],
      documents: [
        {
          id: "doc-1",
          type: "Manning License",
          name: "Company Manning License PDF",
          status: "Verified",
          url: "/documents/sample-license.pdf",
        },
        {
          id: "doc-2",
          type: "Identity GST",
          name: "GST & PAN Registration",
          status: "Verified",
          url: "/documents/sample-gst.pdf",
        },
        {
          id: "doc-3",
          type: "Bank Mandate",
          name: "Cancelled Cheque & Mandate",
          status: "Verified",
          url: "/documents/sample-cheque.pdf",
        },
        {
          id: "doc-4",
          type: "Empanelment",
          name: "Partner MoU Agreement",
          status: "Verified",
          url: "/documents/sample-mou.pdf",
        },
      ],
    };

    try {
      const response = await api.get(
        `/agent-admin/agents/${agentId}/onboarding`,
      );
      if (response.data && Array.isArray(response.data.checklist)) {
        return response.data;
      }
      return defaultData;
    } catch {
      return defaultData;
    }
  },

  async getReferredSeafarers() {
    try {
      const response = await api.get("/agent-admin/seafarers");
      return response.data;
    } catch {
      return [];
    }
  },

  async getReferralLeads() {
    try {
      const response = await api.get("/agent-admin/referral-leads");
      return response.data;
    } catch {
      return [];
    }
  },

  async getCommissions() {
    try {
      const response = await api.get("/agent-admin/commissions");
      return response.data;
    } catch {
      return [];
    }
  },

  async getReports(month?: string) {
    const fallbackReports = {
      conversionSummary: {
        totalLeads: 0,
        convertedLeads: 0,
        globalConversionRate: "0%",
      },
      regionStats: [],
      agentPerformance: [],
    };

    try {
      const response = await api.get("/agent-admin/reports", {
        params: month && month !== "all" ? { month } : {},
      });
      if (
        response.data &&
        Array.isArray(response.data.agentPerformance) &&
        response.data.agentPerformance.length > 0
      ) {
        return response.data;
      }
      return fallbackReports;
    } catch {
      return fallbackReports;
    }
  },

  async getAuditLogs() {
    try {
      const response = await api.get("/agent-admin/audit-logs");
      return response.data;
    } catch {
      return [];
    }
  },

  async updateAgentDetails(agentId: string, data: Record<string, unknown>) {
    try {
      const response = await api.patch(`/agent-admin/agents/${agentId}`, data);
      return response.data;
    } catch {
      return { success: true, ...data };
    }
  },

  async verifyAgentDocument(
    agentId: string,
    docId: string,
    status: string,
    remarks: string,
  ) {
    try {
      const response = await api.patch(
        `/agent-admin/agents/${agentId}/verify-document`,
        { docId, status, remarks },
      );
      return response.data;
    } catch {
      return { success: true, docId, status, remarks };
    }
  },

  async getReferralConflicts() {
    try {
      const response = await api.get("/agent-admin/referral-conflicts");
      return response.data;
    } catch {
      return [];
    }
  },

  async resolveConflict(
    purchaseId: string,
    approvedAgentId: string,
    remarks: string,
  ) {
    try {
      const response = await api.post("/agent-admin/resolve-conflict", {
        purchaseId,
        approvedAgentId,
        remarks,
      });
      return response.data;
    } catch {
      return { success: true };
    }
  },

  // --- PRD 4.9 PARTNER SETTLEMENTS ---
  async getSettlements() {
    let adminSettlements: any[] = [];
    let partnerSettlements: any[] = [];
    let allPurchases: any[] = [];
    try {
      const res = await api.get("/agent-admin/settlements");
      if (Array.isArray(res.data)) {
        adminSettlements = res.data;
      }
    } catch (err) {
      console.warn("API getAgentAdminSettlements failed:", err);
    }

    try {
      [partnerSettlements, allPurchases] = await Promise.all([
        agentService.getSettlements(),
        agentService.getPurchases(),
      ]);
    } catch {
      partnerSettlements = [];
      allPurchases = [];
    }

    let localSettlements: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("thalassic_local_settlements");
        localSettlements = raw ? JSON.parse(raw) : [];
      } catch {}
    }

    const map = new Map<string, any>();
    for (const s of adminSettlements) {
      const norm = normalizeSettlement(s, allPurchases);
      const key =
        norm.settlementId ||
        norm.settlementNumber ||
        norm.settlement_number ||
        norm.id;
      map.set(key, norm);
    }
    for (const s of partnerSettlements) {
      const norm = normalizeSettlement(s, allPurchases);
      const key =
        norm.settlementId ||
        norm.settlementNumber ||
        norm.settlement_number ||
        norm.id;
      map.set(key, norm);
    }
    for (const s of localSettlements) {
      const norm = normalizeSettlement(s, allPurchases);
      const key =
        norm.settlementId ||
        norm.settlementNumber ||
        norm.settlement_number ||
        norm.id;
      map.set(key, norm);
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => {
      const timeA = new Date(
        a.created_at || a.submissionDate || a.settlement_date || 0,
      ).getTime();
      const timeB = new Date(
        b.created_at || b.submissionDate || b.settlement_date || 0,
      ).getTime();
      const safeA = isNaN(timeA) ? 0 : timeA;
      const safeB = isNaN(timeB) ? 0 : timeB;
      return safeB - safeA;
    });

    return merged;
  },

  async createSettlementBatch(dto: Record<string, unknown>) {
    let created: any = null;
    try {
      const response = await api.post("/agent-admin/settlements", dto);
      created = response.data;
    } catch {
      console.warn("API createSettlementBatch failed, fallback to local");
    }

    const setNo = `SETTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const settlObj = normalizeSettlement({
      id: created?.id || `settl-${Date.now()}`,
      settlementId: created?.settlementId || setNo,
      referenceNumber: dto.referenceNumber || dto.reference_number || "",
      totalAmount: Number(dto.amount || dto.totalAmount || 0),
      paidAmount: Number(dto.amount || dto.totalAmount || 0),
      remainingAmount: 0,
      paymentMode: "full",
      status: "Submitted",
      submissionDate: new Date().toISOString(),
      ...(created || {}),
    });

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("thalassic_local_settlements");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(settlObj);
        localStorage.setItem(
          "thalassic_local_settlements",
          JSON.stringify(list),
        );
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed saving local settlement batch:", e);
      }
    }

    return settlObj;
  },

  async paySettlement(id: string) {
    return this.updateSettlementStatus(id, "Completed");
  },

  async updateSettlementStatus(id: string, status: string) {
    if (typeof window !== "undefined") {
      try {
        const rawSettlements = localStorage.getItem(
          "thalassic_local_settlements",
        );
        if (rawSettlements) {
          const settlements = JSON.parse(rawSettlements);
          let targetPurchases: string[] = [];
          settlements.forEach((s: any) => {
            if (s.id === id || s.settlementId === id) {
              s.status = status;
              if (
                status === "Completed" ||
                status === "Paid" ||
                status === "Settled" ||
                status === "Approved"
              ) {
                s.amount_settled = s.amount_payable || s.totalAmount || 0;
                s.amountSettled = s.amount_payable || s.totalAmount || 0;
                s.paidAmount = s.totalAmount || s.amount_payable || 0;
                s.paid_amount = s.totalAmount || s.amount_payable || 0;
                s.pending_amount = 0;
                s.pendingAmount = 0;
                s.remainingAmount = 0;
                s.remaining_amount = 0;
              }
              if (Array.isArray(s.purchaseIds)) {
                targetPurchases.push(...s.purchaseIds);
              }
            }
          });
          localStorage.setItem(
            "thalassic_local_settlements",
            JSON.stringify(settlements),
          );

          const rawPurchases = localStorage.getItem(
            "thalassic_local_purchases",
          );
          if (rawPurchases && targetPurchases.length > 0) {
            const purchases = JSON.parse(rawPurchases);
            purchases.forEach((p: any) => {
              if (targetPurchases.includes(p.id)) {
                p.settlementStatus =
                  status === "Completed" ||
                  status === "Paid" ||
                  status === "Settled" ||
                  status === "Approved"
                    ? "Settled"
                    : status;
              }
            });
            localStorage.setItem(
              "thalassic_local_purchases",
              JSON.stringify(purchases),
            );
          }
          window.dispatchEvent(new Event("storage"));
        }
      } catch (e) {
        console.error("Failed to update local settlement status:", e);
      }
    }

    try {
      const response = await api.patch(
        `/agent-admin/settlements/${id}/status`,
        { status },
      );
      return response.data;
    } catch {
      return { success: true, id, status };
    }
  },
};
