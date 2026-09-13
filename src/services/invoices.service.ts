import { api } from "@/lib/axios";

export const invoicesService = {
  async getInvoices(params?: {
    search?: string;
    type?: string;
    status?: string;
    course?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type && params.type !== "all") queryParams.append("type", params.type);
    if (params?.status && params.status !== "all") queryParams.append("status", params.status);
    if (params?.course && params.course !== "all") queryParams.append("course", params.course);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    const query = queryParams.toString();
    const response = await api.get(`/invoices${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getInvoiceById(id: string) {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  async getInvoicePdfData(id: string) {
    const response = await api.get(`/invoices/${id}/pdf`);
    return response.data;
  },

  async exportInvoices(params?: {
    search?: string;
    type?: string;
    status?: string;
    course?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type && params.type !== "all") queryParams.append("type", params.type);
    if (params?.status && params.status !== "all") queryParams.append("status", params.status);
    if (params?.course && params.course !== "all") queryParams.append("course", params.course);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    const query = queryParams.toString();
    const response = await api.post(`/invoices/export${query ? `?${query}` : ""}`, {});
    return response.data;
  },
};
