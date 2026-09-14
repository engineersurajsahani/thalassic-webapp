"use client";

import React, { useRef } from "react";
import { X, Printer, Receipt } from "lucide-react";

interface InvoiceModalProps {
  pdfData: {
    invoice: Record<string, any>;
    company: {
      name: string;
      address: string;
      email: string;
      phone: string;
      dgsAccreditationId: string;
      gstin: string;
    };
    terms: string[];
  };
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; text: string }> = {
    Paid: { bg: "#DCFCE7", text: "#16A34A" },
    Processing: { bg: "#FEF3C7", text: "#B45309" },
    Cancelled: { bg: "#FEE2E2", text: "#DC2626" },
  };
  const s = map[status] || { bg: "#EEF1FE", text: "#3D5EF6" };
  return (
    <span
      style={{ backgroundColor: s.bg, color: s.text }}
      className="text-xs font-bold px-2 py-1 rounded-full"
    >
      {status}
    </span>
  );
};

export function InvoiceModal({ pdfData, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  if (!pdfData) return null;

  const company = pdfData?.company || {
    name: "Hari Om Thalassic Maritime Training Institute",
    address:
      "Suite 404, Marine Trade Tower, Ballard Estate, Mumbai, Maharashtra 400001",
    email: "support@hariomthalassic.com",
    phone: "+91 22 12345678",
    dgsAccreditationId: "DGS-MTI-10294",
    gstin: "27AABCH1234F1Z5",
  };

  const terms = pdfData?.terms || [
    "Fees once paid are non-refundable except under DGS guidelines.",
    "Please retain this tax invoice for certificate verification.",
    "This is a computer-generated tax invoice and requires no physical signature.",
  ];

  const rawInvoice = pdfData?.invoice;
  const relatedItems = rawInvoice?.related_items || [];

  const activeItem =
    Array.isArray(relatedItems) && relatedItems.length > 0
      ? relatedItems[selectedIndex]
      : null;

  const baseInvoice = rawInvoice || {
    invoice_number: "INV-2026-SETTLEMENT",
    invoice_type: "HAC",
    status: "Paid",
    created_at: new Date().toISOString(),
    payment_date: new Date().toISOString(),
    customer_name: "Priya Singh",
    customer_email: "priyasingh@maritime.com",
    customer_phone: "+91 9876543210",
    course_name: "Medical Care on Board Ships",
    institute_name: "Hari Om Maritime Institute, Mumbai",
    course_fee: 10500,
    discount: 0,
    payment_gateway: "Partner Remittance Batch",
    payment_method: "Bank Transfer",
    transaction_id: "TXN-SETTLEMENT-REMIT",
    agent_name: "Rajesh Kumar (Partner)",
    hariom_payable_amount: 10500,
    final_amount: 10500,
  };

  const cName = activeItem
    ? activeItem.seafarerName ||
      activeItem.customer_name ||
      activeItem.seafarer_name ||
      baseInvoice.customer_name
    : baseInvoice.customer_name;
  const cEmail = activeItem
    ? activeItem.customer_email ||
      `${cName.toLowerCase().replace(/\s+/g, ".")}@maritime.com`
    : baseInvoice.customer_email;
  const cPhone = activeItem
    ? activeItem.customer_phone || "+91 98765 43210"
    : baseInvoice.customer_phone;
  const crsName = activeItem
    ? activeItem.courseName ||
      activeItem.course_name ||
      activeItem.course ||
      baseInvoice.course_name
    : baseInvoice.course_name;
  const amtVal = activeItem
    ? Number(
        activeItem.payableAmount ??
          activeItem.paidNow ??
          activeItem.hariom_payable ??
          activeItem.amount ??
          baseInvoice.course_fee ??
          4500,
      )
    : Number(baseInvoice.course_fee || baseInvoice.final_amount || 10500);

  const invoice: any = {
    ...baseInvoice,
    customer_name: cName,
    customer_email: cEmail,
    customer_phone: cPhone,
    course_name: crsName,
    course_fee: amtVal,
    final_amount: amtVal,
    hariom_payable_amount: amtVal,
    invoice_number: activeItem
      ? activeItem.invoice_number ||
        activeItem.hac_invoice_number ||
        (activeItem.id?.startsWith("HAC-")
          ? activeItem.id
          : `HAC-2026-${(activeItem.purchaseId || activeItem.id || "000000").substring(0, 6).toUpperCase()}`)
      : baseInvoice.invoice_number,
  };

  const isHac =
    (invoice?.invoice_type || invoice?.type) === "HAC" ||
    (invoice?.invoice_type || invoice?.type) === "HAC_PARTNER" ||
    true;

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', sans-serif; font-size: 13px; color: #111827; background: #fff; }
            .inv-root { max-width: 780px; margin: 0 auto; padding: 40px; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body><div class="inv-root">${printContents}</div></body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  const fmt = (val: number) =>
    `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "—";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[16px] card-elevated border-0 shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden relative">
        {/* Modal Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-[#111827] font-semibold">
            <Receipt className="w-5 h-5 text-[#3D5EF6]" />
            <span>Invoice: {invoice.invoice_number}</span>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-[10px] bg-[#3D5EF6] text-white hover:bg-[#2E4FE0] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Download
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close Invoice Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Batch Settlement Candidate Selector Tabs */}
        {relatedItems.length > 1 && (
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">
              Candidates ({relatedItems.length}):
            </span>
            {relatedItems.map((item: any, idx: number) => {
              const nameStr =
                item.seafarerName ||
                item.customer_name ||
                item.seafarer_name ||
                `Candidate ${idx + 1}`;
              const amtNum = Number(
                item.payableAmount ?? item.paidNow ?? item.amount ?? 0,
              );
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? "bg-[#3D5EF6] text-white border-[#3D5EF6] shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {nameStr} (₹{amtNum.toLocaleString("en-IN")})
                </button>
              );
            })}
          </div>
        )}

        {/* Scrollable Invoice Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <div
            ref={printRef}
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#1e293b",
              fontSize: "13px",
            }}
          >
            {/* Company Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
                paddingBottom: "20px",
                borderBottom: "2px solid #3D5EF6",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#3D5EF6",
                    letterSpacing: "-0.5px",
                  }}
                >
                  HARI OM THALASSIC
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#475569",
                    marginTop: "2px",
                  }}
                >
                  Maritime Training Institute
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "8px",
                    lineHeight: "1.6",
                  }}
                >
                  {company.address}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  📧 {company.email} · 📞 {company.phone}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#475569",
                    marginTop: "4px",
                  }}
                >
                  DGS Accreditation: {company.dgsAccreditationId} | GSTIN:{" "}
                  {company.gstin}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    background: isHac ? "#EEF1FE" : "#DCFCE7",
                    border: `1px solid ${isHac ? "#C7D2FE" : "#BBF7D0"}`,
                    borderRadius: "8px",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: isHac ? "#3D5EF6" : "#16A34A",
                    }}
                  >
                    {invoice.invoice_number}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      marginTop: "2px",
                      color: "#64748b",
                    }}
                  >
                    Invoice Type: {invoice.invoice_type}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    Invoice Status: <strong>{invoice.status}</strong>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    Invoice Date: {fmtDate(invoice.created_at)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    Payment Date: {fmtDate(invoice.payment_date)}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Course Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              {/* Customer Details */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "12px",
                  }}
                >
                  Customer Details
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Name:
                    </span>{" "}
                    <strong style={{ fontSize: "12px" }}>
                      {invoice.customer_name}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Email:
                    </span>{" "}
                    <span style={{ fontSize: "12px" }}>
                      {invoice.customer_email}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Mobile:
                    </span>{" "}
                    <span style={{ fontSize: "12px" }}>
                      {invoice.customer_phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "12px",
                  }}
                >
                  Course & Institute Details
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Course:
                    </span>{" "}
                    <strong style={{ fontSize: "12px" }}>
                      {invoice.course_name}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Institute:
                    </span>{" "}
                    <strong style={{ fontSize: "12px", color: "#3D5EF6" }}>
                      {invoice.institute_name ||
                        "Hari Om Maritime Institute, Mumbai"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Course Fee:
                    </span>{" "}
                    <span style={{ fontSize: "12px" }}>
                      {fmt(invoice.course_fee)}
                    </span>
                  </div>
                  {Number(invoice.discount) > 0 && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "11px" }}>
                        Discount:
                      </span>{" "}
                      <span style={{ fontSize: "12px", color: "#16A34A" }}>
                        -{fmt(invoice.discount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "12px",
                }}
              >
                Payment & Settlement Details
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: invoice.agent_name
                    ? "1fr 1fr 1fr 1fr"
                    : "1fr 1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ color: "#64748b", fontSize: "11px" }}>
                    Gateway:
                  </span>
                  <br />
                  <strong>{invoice.payment_gateway}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "11px" }}>
                    Method:
                  </span>
                  <br />
                  <strong>{invoice.payment_method}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "11px" }}>
                    Transaction ID:
                  </span>
                  <br />
                  <strong style={{ wordBreak: "break-all" }}>
                    {invoice.transaction_id}
                  </strong>
                </div>
                {invoice.agent_name && (
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Partner:
                    </span>
                    <br />
                    <strong>{invoice.agent_name}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Amount Summary */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "320px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ color: "#64748b" }}>Course Fee</span>
                    <span>{fmt(invoice.course_fee)}</span>
                  </div>
                  {Number(invoice.discount) > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ color: "#64748b" }}>Discount</span>
                      <span style={{ color: "#16A34A" }}>
                        - {fmt(invoice.discount)}
                      </span>
                    </div>
                  )}
                  {isHac && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ color: "#3D5EF6", fontWeight: "600" }}>
                        Hari Om Payable Amount
                      </span>
                      <strong style={{ color: "#3D5EF6" }}>
                        {fmt(
                          invoice.hariom_payable_amount || invoice.final_amount,
                        )}
                      </strong>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderTop: "2px solid #3D5EF6",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#3D5EF6",
                      marginTop: "4px",
                    }}
                  >
                    <span>Recorded Hari Om Revenue</span>
                    <span>
                      {fmt(
                        invoice.hariom_payable_amount || invoice.final_amount,
                      )}
                    </span>
                  </div>
                  {isHac && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        fontStyle: "italic",
                        marginTop: "4px",
                        textAlign: "right",
                      }}
                    >
                      * Partner selling price is independent & excluded from
                      Hari Om revenue calculation (PRD 6.6 & 6.8).
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "16px",
                borderLeft: "3px solid #94a3b8",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Terms & Conditions
              </div>
              <ol style={{ paddingLeft: "16px" }}>
                {terms.map((t, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer */}
            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #e2e8f0",
                fontSize: "11px",
                color: "#94a3b8",
              }}
            >
              This is an immutable computer-generated tax invoice (PRD Section
              6.5) and requires no physical signature.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
