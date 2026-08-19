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
    if (params?.search)                            q.append("search",    params.search);
    if (params?.status   && params.status   !== "all") q.append("status",    params.status);
    if (params?.type     && params.type     !== "all") q.append("type",      params.type);
    if (params?.course   && params.course   !== "all") q.append("course",    params.course);
    if (params?.startDate)                         q.append("startDate", params.startDate);
    if (params?.endDate)                           q.append("endDate",   params.endDate);
    const response = await api.get(`/master/finance/payments${q.toString() ? `?${q}` : ""}`);
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
    if (params?.search)                            q.append("search",    params.search);
    if (params?.type   && params.type   !== "all") q.append("type",      params.type);
    if (params?.status && params.status !== "all") q.append("status",    params.status);
    if (params?.course && params.course !== "all") q.append("course",    params.course);
    if (params?.startDate)                         q.append("startDate", params.startDate);
    if (params?.endDate)                           q.append("endDate",   params.endDate);
    const response = await api.get(`/master/finance/invoices${q.toString() ? `?${q}` : ""}`);
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
    const response = await api.get("/master/finance/settlements");
    return response.data;
  },

  async approveSettlement(id: string) {
    const response = await api.post(`/master/finance/settlements/${id}/approve`);
    return response.data;
  },

  async paySettlement(id: string) {
    const response = await api.post(`/master/finance/settlements/${id}/pay`);
    return response.data;
  },
};
