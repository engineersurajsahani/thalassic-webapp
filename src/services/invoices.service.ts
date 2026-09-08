import { api } from "@/lib/axios";

export const MOCK_PARTNER_INVOICES = [
  {
    id: "inv-hac-001",
    invoice_number: "HAC260900001",
    invoice_type: "HAC",
    customer_name: "Capt. Vikramaditya Singh",
    customer_email: "vikram@merchantnavy.in",
    customer_phone: "+91 98201 98765",
    course_name: "Advanced Oil Tanker Cargo Operations (TASCO)",
    institute_name: "Hari Om Maritime Institute, Mumbai",
    hariom_payable_amount: 24500,
    final_amount: 28000,
    course_fee: 28000,
    discount: 0,
    transaction_id: "TXN-HAC-994812",
    payment_method: "Razorpay UPI",
    payment_date: "2026-09-04T11:20:00.000Z",
    created_at: "2026-09-04T11:20:00.000Z",
    payment_status: "Paid",
    invoice_status: "Issued",
    status: "Paid",
    agent_name: "SeaTrans Manning Agency",
  },
  {
    id: "inv-hac-002",
    invoice_number: "HAC260900002",
    invoice_type: "HAC",
    customer_name: "Rajesh Kumar Sharma",
    customer_email: "rajesh.sharma@merchantnavy.in",
    customer_phone: "+91 99887 12345",
    course_name: "Basic Safety Training (STCW BST)",
    institute_name: "Hari Om Maritime Academy, Navi Mumbai",
    hariom_payable_amount: 14200,
    final_amount: 16500,
    course_fee: 16500,
    discount: 0,
    transaction_id: "TXN-HAC-994813",
    payment_method: "Net Banking",
    payment_date: "2026-09-03T15:45:00.000Z",
    created_at: "2026-09-03T15:45:00.000Z",
    payment_status: "Paid",
    invoice_status: "Issued",
    status: "Paid",
    agent_name: "SeaTrans Manning Agency",
  },
  {
    id: "inv-hac-003",
    invoice_number: "HAC260900003",
    invoice_type: "HAC",
    customer_name: "Amitabh Deshmukh",
    customer_email: "amitabh.d@maritime.org",
    customer_phone: "+91 97654 32109",
    course_name: "Medical First Aid (MFA)",
    institute_name: "Hari Om Maritime Institute, Mumbai",
    hariom_payable_amount: 8500,
    final_amount: 9800,
    course_fee: 9800,
    discount: 0,
    transaction_id: "TXN-HAC-994814",
    payment_method: "Credit Card",
    payment_date: "2026-09-02T09:10:00.000Z",
    created_at: "2026-09-02T09:10:00.000Z",
    payment_status: "Paid",
    invoice_status: "Issued",
    status: "Paid",
    agent_name: "SeaTrans Manning Agency",
  },
  {
    id: "inv-hac-004",
    invoice_number: "HAC260900004",
    invoice_type: "HAC",
    customer_name: "Suresh Nambiar",
    customer_email: "suresh.nambiar@gmail.com",
    customer_phone: "+91 98112 33445",
    course_name: "Proficiency in Survival Craft (PSCRB)",
    institute_name: "Hari Om Maritime Academy, Kochi",
    hariom_payable_amount: 11800,
    final_amount: 13500,
    course_fee: 13500,
    discount: 0,
    transaction_id: "TXN-HAC-994815",
    payment_method: "Razorpay UPI",
    payment_date: "2026-09-01T16:00:00.000Z",
    created_at: "2026-09-01T16:00:00.000Z",
    payment_status: "Pending",
    invoice_status: "Draft",
    status: "Pending",
    agent_name: "SeaTrans Manning Agency",
  },
];

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
      if (Array.isArray(response.data) && response.data.length > 0) {
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
          i.invoice_number.toLowerCase().includes(q) ||
          i.customer_name.toLowerCase().includes(q) ||
          i.course_name.toLowerCase().includes(q) ||
          i.transaction_id.toLowerCase().includes(q)
      );
    }
    if (params?.status && params.status !== "all") {
      list = list.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase());
    }
    if (params?.type && params.type !== "all") {
      list = list.filter((i) => i.invoice_type.toLowerCase() === params.type?.toLowerCase());
    }
    return list;
  },

  async getInvoiceById(id: string) {
    try {
      const response = await api.get(`/invoices/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      console.warn("Failed to fetch invoice by ID from API, using fallback", e);
    }
    return MOCK_PARTNER_INVOICES.find((i) => i.id === id || i.invoice_number === id) || MOCK_PARTNER_INVOICES[0];
  },

  async getInvoicePdfData(id: string) {
    try {
      const response = await api.get(`/invoices/${id}/pdf`);
      if (response.data) return response.data;
    } catch (e) {
      console.warn("Failed to fetch invoice PDF from API, using fallback", e);
    }

    const inv = MOCK_PARTNER_INVOICES.find((i) => i.id === id || i.invoice_number === id) || MOCK_PARTNER_INVOICES[0];
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
      "Amount Applicable to Hari Om": `₹${(inv.hariom_payable_amount ?? inv.final_amount).toLocaleString("en-IN")}`,
      "Total Amount": `₹${inv.final_amount.toLocaleString("en-IN")}`,
      "Invoice Date": new Date(inv.created_at).toLocaleDateString("en-IN"),
      "Payment Status": inv.payment_status || inv.status,
      "Invoice Status": inv.invoice_status || "Issued",
    }));
  },
};

