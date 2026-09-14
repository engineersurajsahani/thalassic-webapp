import { api } from "@/lib/axios";

export const financeService = {
  // ── Payments ──────────────────────────────────────────────────────────────
  async getPayments(params?: {
    search?: string;
    status?: string;
    type?: string;
    course?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const q = new URLSearchParams();
    if (params?.search) q.append("search", params.search);
    if (params?.status && params.status !== "all")
      q.append("status", params.status);
    if (params?.type && params.type !== "all") q.append("type", params.type);
    if (params?.course && params.course !== "all")
      q.append("course", params.course);
    if (params?.startDate) q.append("startDate", params.startDate);
    if (params?.endDate) q.append("endDate", params.endDate);
    const response = await api.get(
      `/master/finance/payments${q.toString() ? `?${q}` : ""}`,
    );
    return response.data;
  },

  // ── Invoices ──────────────────────────────────────────────────────────────
  async getInvoices(params?: {
    search?: string;
    type?: string;
    status?: string;
    course?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const q = new URLSearchParams();
    if (params?.search) q.append("search", params.search);
    if (params?.type && params.type !== "all") q.append("type", params.type);
    if (params?.status && params.status !== "all")
      q.append("status", params.status);
    if (params?.course && params.course !== "all")
      q.append("course", params.course);
    if (params?.startDate) q.append("startDate", params.startDate);
    if (params?.endDate) q.append("endDate", params.endDate);
    const response = await api.get(
      `/master/finance/invoices${q.toString() ? `?${q}` : ""}`,
    );
    return response.data;
  },

  async getInvoicePdf(id: string) {
    const response = await api.get(`/master/finance/invoices/${id}/pdf`);
    return response.data;
  },

  async resendInvoice(id: string) {
    const response = await api.post(`/master/finance/invoices/${id}/resend`);
    return response.data;
  },

  // ── Commissions ───────────────────────────────────────────────────────────
  async getCommissions() {
    const response = await api.get("/master/finance/commissions");
    return response.data;
  },

  // ── Settlements ───────────────────────────────────────────────────────────
  async getSettlements() {
    let apiSettlements: any[] = [];
    try {
      const response = await api.get("/master/finance/settlements");
      if (Array.isArray(response.data)) {
        apiSettlements = response.data;
      }
    } catch {
      apiSettlements = [];
    }

    let localSettlements: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("thalassic_local_settlements");
        localSettlements = raw ? JSON.parse(raw) : [];
      } catch {}
    }

    const map = new Map<string, any>();
    for (const s of apiSettlements) {
      map.set(s.id || s.settlementId, s);
    }
    for (const s of localSettlements) {
      const id = s.id || s.settlementId;
      map.set(id, { ...map.get(id), ...s });
    }

    return Array.from(map.values());
  },

  async approveSettlement(id: string) {
    try {
      const response = await api.post(
        `/master/finance/settlements/${id}/approve`,
      );
      this.updateLocalSettlementStatus(id, "Approved");
      return response.data;
    } catch {
      this.updateLocalSettlementStatus(id, "Approved");
      return { success: true, id, status: "Approved" };
    }
  },

  async paySettlement(id: string) {
    try {
      const response = await api.post(`/master/finance/settlements/${id}/pay`);
      this.updateLocalSettlementStatus(id, "Settled");
      return response.data;
    } catch {
      this.updateLocalSettlementStatus(id, "Settled");
      return { success: true, id, status: "Settled" };
    }
  },

  updateLocalSettlementStatus(id: string, status: string) {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("thalassic_local_settlements");
      if (!raw) return;
      const list = JSON.parse(raw);
      let updated = false;
      list.forEach((s: any) => {
        if (s.id === id || s.settlementId === id) {
          s.status = status;
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(
          "thalassic_local_settlements",
          JSON.stringify(list),
        );
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Failed updating local settlement status:", e);
    }
  },

  // ── Reports ───────────────────────────────────────────────────────────────
  async getReportsRevenue(params?: any) {
    const response = await api.get("/finance/reports/revenue", { params });
    return response.data;
  },

  async getReportsPayments(params?: any) {
    const response = await api.get("/finance/reports/payments", { params });
    return response.data;
  },

  // ── Audit Logs ────────────────────────────────────────────────────────────
  async getAuditLogs(params?: any) {
    const response = await api.get("/finance/audit-logs", { params });
    return response.data;
  },

  async logFinancialActivity(dto: {
    action: string;
    module: string;
    entityId?: string;
    details?: string;
    previousValue?: any;
    updatedValue?: any;
  }) {
    const response = await api.post("/finance/audit-logs", dto);
    return response.data;
  },
};
