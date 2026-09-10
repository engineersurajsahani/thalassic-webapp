import { api } from "@/lib/axios";

export const MOCK_PARTNER_INVOICES: any[] = [];

export const invoicesService = {
  async getInvoices(params?: {
    search?: string;
    type?: string;
    status?: string;
    course?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.type && params.type !== "all") queryParams.append("type", params.type);
      if (params?.status && params.status !== "all") queryParams.append("status", params.status);
      if (params?.course && params.course !== "all") queryParams.append("course", params.course);
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);
      const query = queryParams.toString();
      const response = await api.get(`/invoices${query ? `?${query}` : ""}`);
      if (Array.isArray(response.data)) {
        return response.data;
      }
    } catch (e) {
      console.warn("Failed to fetch invoices from API, using fallback data", e);
    }

    // Filter fallback data
    let list = [...MOCK_PARTNER_INVOICES];
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoice_number?.toLowerCase().includes(q) ||
          i.customer_name?.toLowerCase().includes(q) ||
          i.course_name?.toLowerCase().includes(q) ||
          i.transaction_id?.toLowerCase().includes(q)
      );
    }
    if (params?.status && params.status !== "all") {
      list = list.filter((i) => i.status?.toLowerCase() === params.status?.toLowerCase());
    }
    if (params?.type && params.type !== "all") {
      list = list.filter((i) => i.invoice_type?.toLowerCase() === params.type?.toLowerCase());
    }
    return list;
  },

  async generateInvoice(data: {
    id?: string;
    purchaseId?: string;
    invoiceNumber?: string;
    customerName?: string;
    customerEmail?: string;
    courseName?: string;
    finalAmount?: number;
    hariomPayable?: number;
    transactionId?: string;
    paymentMethod?: string;
  }) {
    const newInvoice = {
      id: data.id || data.invoiceNumber || data.purchaseId || `INV-${Date.now()}`,
      purchase_id: data.purchaseId,
      invoice_number: data.invoiceNumber || `INV-2026-${Date.now()}`,
      customer_name: data.customerName || "Seafarer",
      customer_email: data.customerEmail || `${(data.customerName || "seafarer").toLowerCase().replace(/\s+/g, ".")}@maritime.com`,
      customer_phone: "+91 98765 43210",
      course_name: data.courseName || "Maritime Course",
      institute_name: "Hari Om Maritime Institute, Mumbai",
      course_fee: Number(data.finalAmount || data.hariomPayable || 0),
      discount: 0,
      final_amount: Number(data.finalAmount || data.hariomPayable || 0),
      hariom_payable_amount: Number(data.hariomPayable || data.finalAmount || 0),
      payment_gateway: "Bank Remittance",
      payment_method: data.paymentMethod || "Bank Transfer",
      transaction_id: data.transactionId || `TXN-${data.purchaseId || Date.now()}`,
      status: "Paid",
      invoice_type: "HAC",
      created_at: new Date().toISOString(),
      payment_date: new Date().toISOString(),
      agent_name: "Rajesh Kumar (Partner)",
    };

    const existingIdx = MOCK_PARTNER_INVOICES.findIndex(
      (i) => i.id === newInvoice.id || i.invoice_number === newInvoice.invoice_number || (data.purchaseId && i.purchase_id === data.purchaseId)
    );
    if (existingIdx >= 0) {
      MOCK_PARTNER_INVOICES[existingIdx] = newInvoice;
    } else {
      MOCK_PARTNER_INVOICES.unshift(newInvoice);
    }

    // Record generated invoice in localStorage map
    this.markInvoiceAsGenerated(newInvoice.id, data);
    this.markInvoiceAsGenerated(newInvoice.invoice_number, data);
    if (data.purchaseId) this.markInvoiceAsGenerated(data.purchaseId, data);

    try {
      const response = await api.post("/invoices/generate", data);
      if (response.data) return response.data;
    } catch (e) {
      console.warn("Failed to generate invoice via API, saved to local store:", e);
    }
    return newInvoice;
  },

  markInvoiceAsGenerated(key: string, data?: any) {
    if (typeof window === "undefined" || !key) return;
    try {
      const stored = localStorage.getItem("thalassic_generated_invoices") || "{}";
      const map = JSON.parse(stored);
      map[key] = true;
      if (data?.invoiceNumber) map[data.invoiceNumber] = true;
      if (data?.purchaseId) map[data.purchaseId] = true;
      if (data?.id) map[data.id] = true;
      localStorage.setItem("thalassic_generated_invoices", JSON.stringify(map));
    } catch (e) {
      console.warn("Error setting generated invoice in localStorage:", e);
    }
  },

  isInvoiceGenerated(key: string): boolean {
    if (typeof window === "undefined" || !key) return false;
    try {
      let stored = localStorage.getItem("thalassic_generated_invoices");
      if (!stored) {
        const initialSeed = {
          "HAC-2026-F6F602": true,
          "f6f6024f-692f-4674-a74d-91b35ff5e0c5": true,
          "HAC-2026-PUR-88": true,
          "pur-88201": true,
        };
        localStorage.setItem("thalassic_generated_invoices", JSON.stringify(initialSeed));
        stored = JSON.stringify(initialSeed);
      }
      const map = JSON.parse(stored);
      if (map[key]) return true;
      const inMock = MOCK_PARTNER_INVOICES.some(
        (i) => i.id === key || i.invoice_number === key || i.purchase_id === key
      );
      return inMock;
    } catch (e) {
      return false;
    }
  },

  async getInvoiceById(id: string) {
    try {
      const response = await api.get(`/invoices/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      console.warn("Failed to fetch invoice by ID from API, using fallback", e);
    }
    return MOCK_PARTNER_INVOICES.find((i) => i.id === id || i.invoice_number === id || i.purchase_id === id) || null;
  },

  async getInvoicePdfData(id: string, overrideData?: any) {
    try {
      const response = await api.get(`/invoices/${id}/pdf`);
      if (response.data) return response.data;
    } catch (e) {
      console.warn("Failed to fetch invoice PDF from API, using dynamic data", e);
    }

    let inv = MOCK_PARTNER_INVOICES.find((i) => i.id === id || i.invoice_number === id || i.purchase_id === id);

    if (!inv && overrideData) {
      const custName = overrideData.customer_name || overrideData.seafarerName || overrideData.seafarer_name || overrideData.name;
      const crsName = overrideData.course_name || overrideData.courseName || overrideData.course;
      const amt = Number(overrideData.hariom_payable || overrideData.payableAmount || overrideData.final_amount || overrideData.amount || 0);

      inv = {
        id: id || overrideData.id || "INV-2026-001",
        invoice_number: id?.startsWith("HAC-") || id?.startsWith("INV-") ? id : (overrideData.invoice_number || overrideData.invoiceNumber || `INV-2026-${id || "001"}`),
        customer_name: custName || "Rajesh Kumar",
        customer_email: overrideData.customer_email || `${(custName || "seafarer").toLowerCase().replace(/\s+/g, ".")}@maritime.com`,
        customer_phone: overrideData.customer_phone || "+91 98765 43210",
        course_name: crsName || "Advanced Fire Fighting",
        institute_name: "Hari Om Maritime Institute, Mumbai",
        course_fee: amt || 6452,
        discount: 0,
        final_amount: amt || 6452,
        hariom_payable_amount: amt || 6452,
        payment_gateway: "Bank Remittance",
        payment_method: overrideData.payment_method || "Bank Transfer",
        transaction_id: overrideData.transaction_id || `TXN-${id}`,
        status: "Paid",
        invoice_type: "HAC",
        created_at: overrideData.date || overrideData.created_at || new Date().toISOString(),
        payment_date: overrideData.date || overrideData.created_at || new Date().toISOString(),
        agent_name: overrideData.agent_name || "Rajesh Kumar (Partner)",
      };
    } else if (!inv) {
      inv = {
        id: id || "INV-2026-001",
        invoice_number: id?.startsWith("HAC-") || id?.startsWith("INV-") ? id : `INV-2026-${id || "001"}`,
        customer_name: "Rajesh Kumar",
        customer_email: "rajesh.kumar@maritime.com",
        customer_phone: "+91 98765 43210",
        course_name: "Advanced Fire Fighting",
        institute_name: "Hari Om Maritime Institute, Mumbai",
        course_fee: 6452,
        discount: 0,
        final_amount: 6452,
        hariom_payable_amount: 6452,
        payment_gateway: "Bank Remittance",
        payment_method: "Bank Transfer",
        transaction_id: `TXN-${id || "BATCH-001"}`,
        status: "Paid",
        invoice_type: "HAC",
        created_at: new Date().toISOString(),
        payment_date: new Date().toISOString(),
        agent_name: "Rajesh Kumar (Partner)",
      };
    }

    return {
      invoice: inv,
      company: {
        name: "Hari Om Thalassic Maritime Training Institute",
        address: "Suite 404, Marine Trade Tower, Ballard Estate, Mumbai, Maharashtra 400001",
        email: "support@hariomthalassic.com",
        phone: "+91 22 12345678",
        dgsAccreditationId: "DGS-MTI-10294",
        gstin: "27AABCH1234F1Z5",
      },
      terms: [
        "Fees once paid are non-refundable except under DGS guidelines.",
        "Please retain this tax invoice for certificate verification.",
        "This is a computer-generated tax invoice and requires no physical signature.",
      ],
    };
  },

  async exportInvoices(params?: {
    search?: string;
    type?: string;
    status?: string;
    course?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.type && params.type !== "all") queryParams.append("type", params.type);
      if (params?.status && params.status !== "all") queryParams.append("status", params.status);
      if (params?.course && params.course !== "all") queryParams.append("course", params.course);
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);
      const query = queryParams.toString();
      const response = await api.post(`/invoices/export${query ? `?${query}` : ""}`, {});
      if (response.data) return response.data;
    } catch (e) {
      console.warn("Failed to export invoices from API, using fallback data", e);
    }

    const list = await this.getInvoices(params);
    return list.map((inv: any) => ({
      "Invoice Number": inv.invoice_number,
      "Seafarer": inv.customer_name,
      "Course": inv.course_name,
      "Institute": inv.institute_name || "Hari Om Maritime Institute",
      "Amount Applicable to Hari Om": `₹${(inv.hariom_payable_amount ?? inv.final_amount ?? 0).toLocaleString("en-IN")}`,
      "Total Amount": `₹${(inv.final_amount ?? 0).toLocaleString("en-IN")}`,
      "Invoice Date": new Date(inv.created_at).toLocaleDateString("en-IN"),
      "Payment Status": inv.payment_status || inv.status,
      "Invoice Status": inv.invoice_status || "Issued",
    }));
  },
};

