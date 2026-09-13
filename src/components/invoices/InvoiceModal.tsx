"use client";

import React, { useRef } from "react";
import {
  X, Download, Printer, Receipt, CheckCircle, XCircle, User,
  BookOpen, CreditCard, Building2, FileText
} from "lucide-react";

interface InvoiceModalProps {
  pdfData: {
    invoice: any;
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
    Paid: { bg: "#d1fae5", text: "#065f46" },
    Processing: { bg: "#fef3c7", text: "#92400e" },
    Cancelled: { bg: "#fee2e2", text: "#991b1b" },
  };
  const s = map[status] || { bg: "#e0e7ff", text: "#3730a3" };
  return (
    <span style={{ backgroundColor: s.bg, color: s.text }} className="text-xs font-bold px-2 py-1 rounded-full">
      {status}
    </span>
  );
};

export function InvoiceModal({ pdfData, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const { invoice, company, terms } = pdfData;
  const isHac = invoice.invoice_type === "HAC";

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
            body { font-family: 'Inter', sans-serif; font-size: 13px; color: #1e293b; background: #fff; }
            .inv-root { max-width: 780px; margin: 0 auto; padding: 40px; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body><div class="inv-root">${printContents}</div></body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const fmt = (val: number) =>
    `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Modal Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span>Invoice: {invoice.invoice_number}</span>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Invoice Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <div ref={printRef} style={{ fontFamily: "'Inter', sans-serif", color: "#1e293b", fontSize: "13px" }}>
            {/* Company Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", paddingBottom: "20px", borderBottom: "2px solid #1e40af" }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#1e40af", letterSpacing: "-0.5px" }}>HARI OM THALASSIC</div>
                <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>Maritime Training Institute</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "8px", lineHeight: "1.6" }}>
                  {company.address}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  📧 {company.email} · 📞 {company.phone}
                </div>
                <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>
                  DGS Accreditation: {company.dgsAccreditationId} | GSTIN: {company.gstin}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: isHac ? "#eff6ff" : "#f0fdf4", border: `1px solid ${isHac ? "#bfdbfe" : "#bbf7d0"}`, borderRadius: "8px", padding: "12px 16px" }}>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: isHac ? "#1d4ed8" : "#15803d" }}>{invoice.invoice_number}</div>
                  <div style={{ fontSize: "11px", marginTop: "2px", color: "#64748b" }}>Invoice Type: {invoice.invoice_type}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Invoice Status: <strong>{invoice.status}</strong></div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Invoice Date: {fmtDate(invoice.created_at)}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Payment Date: {fmtDate(invoice.payment_date)}</div>
                </div>
              </div>
            </div>

            {/* Customer & Course Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {/* Customer Details */}
              <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Customer Details</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div><span style={{ color: "#64748b", fontSize: "11px" }}>Name:</span> <strong style={{ fontSize: "12px" }}>{invoice.customer_name}</strong></div>
                  <div><span style={{ color: "#64748b", fontSize: "11px" }}>Email:</span> <span style={{ fontSize: "12px" }}>{invoice.customer_email}</span></div>
                  <div><span style={{ color: "#64748b", fontSize: "11px" }}>Mobile:</span> <span style={{ fontSize: "12px" }}>{invoice.customer_phone}</span></div>
                </div>
              </div>

              {/* Course Details */}
              <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Course Details</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div><span style={{ color: "#64748b", fontSize: "11px" }}>Course:</span> <strong style={{ fontSize: "12px" }}>{invoice.course_name}</strong></div>
                  <div><span style={{ color: "#64748b", fontSize: "11px" }}>Course Fee:</span> <span style={{ fontSize: "12px" }}>{fmt(invoice.course_fee)}</span></div>
                  {Number(invoice.discount) > 0 && (
                    <div><span style={{ color: "#64748b", fontSize: "11px" }}>Discount:</span> <span style={{ fontSize: "12px", color: "#16a34a" }}>-{fmt(invoice.discount)}</span></div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Payment Details</div>
              <div style={{ display: "grid", gridTemplateColumns: invoice.agent_name ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: "12px" }}>
                <div><span style={{ color: "#64748b", fontSize: "11px" }}>Gateway:</span><br/><strong>{invoice.payment_gateway}</strong></div>
                <div><span style={{ color: "#64748b", fontSize: "11px" }}>Method:</span><br/><strong>{invoice.payment_method}</strong></div>
                <div><span style={{ color: "#64748b", fontSize: "11px" }}>Transaction ID:</span><br/><strong style={{ wordBreak: "break-all" }}>{invoice.transaction_id}</strong></div>
                {invoice.agent_name && (
                  <div><span style={{ color: "#64748b", fontSize: "11px" }}>Agent Name:</span><br/><strong>{invoice.agent_name}</strong></div>
                )}
              </div>
            </div>

            {/* Amount Summary */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "260px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e2e8f0", fontSize: "12px" }}>
                    <span style={{ color: "#64748b" }}>Course Fee</span>
                    <span>{fmt(invoice.course_fee)}</span>
                  </div>
                  {Number(invoice.discount) > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e2e8f0", fontSize: "12px" }}>
                      <span style={{ color: "#64748b" }}>Discount</span>
                      <span style={{ color: "#16a34a" }}>- {fmt(invoice.discount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #1e40af", fontSize: "14px", fontWeight: "700", color: "#1e40af", marginTop: "4px" }}>
                    <span>Total Amount</span>
                    <span>{fmt(invoice.final_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "16px", borderLeft: "3px solid #94a3b8" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Terms & Conditions</div>
              <ol style={{ paddingLeft: "16px" }}>
                {terms.map((t, i) => (
                  <li key={i} style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>{t}</li>
                ))}
              </ol>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e2e8f0", fontSize: "11px", color: "#94a3b8" }}>
              This is a computer-generated tax invoice and requires no physical signature.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
