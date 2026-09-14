"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { invoicesService } from "@/services/invoices.service";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { useTheme } from "@/providers/theme-provider";
import {
  FileCheck,
  Search,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Receipt,
  Building,
  FileText,
  Eye,
} from "lucide-react";

export default function SettlementsHistoryPage() {
  const { theme, mounted } = useTheme();
  const isDark = mounted ? theme === "dark" : true;

  const [settlements, setSettlements] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [pdfDataModal, setPdfDataModal] = useState<any>(null);

  const openInvoiceModal = async (settlementItem: any) => {
    try {
      const invNo =
        settlementItem.hac_invoice_number ||
        settlementItem.hacInvoiceNumber ||
        `HAC-2026-${(settlementItem.settlement_number || settlementItem.id || "").substring(0, 6).toUpperCase()}`;

      const relPurchases =
        settlementItem.related_purchases || settlementItem.allocations || [];

      const firstP = relPurchases[0] || {};
      const custName =
        firstP.seafarerName ||
        firstP.seafarer_name ||
        settlementItem.seafarerName ||
        "Rohit Patel";
      const crsName =
        firstP.courseName ||
        firstP.course_name ||
        settlementItem.courseName ||
        "Medical First Aid";
      const amt = Number(
        firstP.payableAmount ??
          firstP.paidNow ??
          firstP.hariom_payable ??
          firstP.amount ??
          settlementItem.total_amount ??
          4500,
      );

      const purchaseObj = {
        id: firstP.purchaseId || firstP.id || settlementItem.id || invNo,
        invoice_number:
          firstP.invoice_number || firstP.hac_invoice_number || invNo,
        customer_name: custName,
        customer_email:
          firstP.customer_email ||
          `${custName.toLowerCase().replace(/\s+/g, ".")}@maritime.com`,
        customer_phone: firstP.customer_phone || "+91 98765 43210",
        course_name: crsName,
        institute_name: "Hari Om Maritime Institute, Mumbai",
        course_fee: amt,
        hariom_payable_amount: amt,
        final_amount: amt,
        payment_gateway: "Partner Remittance",
        payment_method:
          settlementItem.payment_method ||
          settlementItem.paymentMethod ||
          "Bank Transfer",
        transaction_id:
          settlementItem.reference_number ||
          settlementItem.referenceNumber ||
          settlementItem.bank_utr ||
          "12345678",
        agent_name: settlementItem.agent_name || "Rajesh Kumar (Partner)",
        status: settlementItem.status || "Paid",
        related_items: relPurchases.length > 1 ? relPurchases : [],
      };

      const pdf = await invoicesService.getInvoicePdfData(
        purchaseObj.id || invNo,
        purchaseObj,
      );
      if (pdf && pdf.invoice) {
        pdf.invoice.customer_name = custName;
        pdf.invoice.course_name = crsName;
        pdf.invoice.final_amount = amt;
        pdf.invoice.hariom_payable_amount = amt;
        pdf.invoice.course_fee = amt;
        pdf.invoice.invoice_number = purchaseObj.invoice_number;
        pdf.invoice.agent_name = purchaseObj.agent_name;
        pdf.invoice.payment_method = purchaseObj.payment_method;
        pdf.invoice.transaction_id = purchaseObj.transaction_id;
        if (relPurchases.length > 1) {
          pdf.invoice.related_items = relPurchases;
        } else {
          delete pdf.invoice.related_items;
          delete pdf.invoice.items;
          delete pdf.invoice.allocations;
        }
      }
      setPdfDataModal(pdf);
    } catch (err) {
      console.warn("Failed loading invoice data:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getSettlements();
        setSettlements(data || []);
      } catch (err) {
        console.error("Failed to load settlements:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    window.addEventListener("focus", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("focus", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const filtered = settlements.filter((s) => {
    const q = search.toLowerCase();
    const sNum = (
      s.settlement_number ||
      s.settlementNumber ||
      s.id ||
      ""
    ).toLowerCase();
    const refNum = (
      s.reference_number ||
      s.referenceNumber ||
      ""
    ).toLowerCase();
    const match = sNum.includes(q) || refNum.includes(q);

    if (statusFilter === "all") return match;
    return (
      match && (s.status || "").toLowerCase() === statusFilter.toLowerCase()
    );
  });

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-white">
            Partner Settlement History
          </h1>
          <p
            className={`text-xs md:text-sm mt-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}
          >
            Track remittances sent to Hari Om for training course purchases, UTR
            verification status, and completion records.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/financials"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              isDark
                ? "bg-[#1F2937] hover:bg-[#374151] text-gray-200"
                : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            <Receipt className="w-4 h-4 text-[#3D5EF6]" />
            Financial Summary
          </Link>
          <Link
            href="/partner/settlements/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Submit Settlement
          </Link>
        </div>
      </div>

      {/* Filter & Search */}
      <div
        className={`p-4 flex flex-col sm:flex-row items-center gap-3 ${cardBg}`}
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Settlement # or UTR reference..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium outline-none transition-colors ${
              isDark
                ? "bg-[#111827] border-0 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-[#3D5EF6]"
                : "bg-[#FAFAFA] border-0 text-[#111827] placeholder:text-[#9CA3AF] focus:ring-1 focus:ring-[#3D5EF6]"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold outline-none transition-colors ${
              isDark
                ? "bg-[#111827] border-0 text-gray-200"
                : "bg-[#FAFAFA] border-0 text-[#111827]"
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="partial">Partial Payment</option>
            <option value="under verification">Under Verification</option>
            <option value="completed">Completed / Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Settlement Table */}
      <div className={`overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-[#6B7280] dark:text-gray-400 animate-pulse">
            Loading settlements...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck className="w-10 h-10 text-[#9CA3AF] dark:text-gray-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#111827] dark:text-white">
              No settlement records found.
            </p>
            <Link
              href="/partner/settlements/create"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline"
            >
              Submit a new settlement batch
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={
                  isDark
                    ? "bg-[#111827] text-gray-400 border-b border-[#1F2937]"
                    : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB] font-bold"
                }
              >
                <tr>
                  <th className="py-3.5 px-4 font-semibold">
                    Settlement Number
                  </th>
                  <th className="py-3.5 px-4 font-semibold">
                    Bank UTR / Reference
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Settlement Amount
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Submission Date</th>
                  <th className="py-3.5 px-4 font-semibold text-center">
                    Pending Due Date
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-center">
                    Status
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-center">
                    Invoice
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? "divide-[#1F2937]" : "divide-[#E5E7EB]"}`}
              >
                {filtered.map((s) => {
                  const sNumber =
                    s.settlement_number || s.settlementNumber || s.id;
                  const isPaid =
                    s.status === "Paid" ||
                    s.status === "Completed" ||
                    s.status === "Settled" ||
                    s.status === "Approved";
                  const isPartial =
                    s.status === "Partial" ||
                    s.payment_mode === "partial" ||
                    s.paymentMode === "partial";
                  const isRejected = s.status === "Rejected";

                  const totalAmt = Number(
                    s.total_amount || s.totalAmount || s.amount || 0,
                  );
                  const paidAmt = Number(
                    s.paid_amount || s.paidAmount || s.netAmount || totalAmt,
                  );
                  const remAmt = Number(
                    s.remaining_amount || s.remainingAmount || 0,
                  );

                  const rawDueDate =
                    s.expected_due_date ||
                    s.expectedDueDate ||
                    s.dueDate ||
                    s.due_date;
                  const formattedDueDate = rawDueDate
                    ? new Date(rawDueDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : new Date(
                        new Date(
                          s.created_at || s.submissionDate || Date.now(),
                        ).getTime() +
                          14 * 86400000,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                  return (
                    <tr
                      key={s.id}
                      className={
                        isDark
                          ? "hover:bg-white/[0.02]"
                          : "hover:bg-[#EEF1FE]/30 transition-colors"
                      }
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3D5EF6]">
                        {sNumber}
                      </td>
                      <td
                        className={`py-3.5 px-4 font-mono ${isDark ? "text-gray-300" : "text-[#111827] font-semibold"}`}
                      >
                        {s.reference_number || s.referenceNumber || "N/A"}
                      </td>
                      <td
                        className={`py-3.5 px-4 ${isDark ? "text-gray-300" : "text-[#111827] font-semibold"}`}
                      >
                        {s.payment_method || s.paymentMethod || "Bank Transfer"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-extrabold block ${isDark ? "text-white" : "text-[#111827]"}`}
                        >
                          ₹{paidAmt.toLocaleString("en-IN")}
                        </span>
                        {isPartial && remAmt > 0 && (
                          <span className="text-[10px] font-semibold text-[#B45309] dark:text-amber-400 block">
                            (₹{remAmt.toLocaleString("en-IN")} Pending)
                          </span>
                        )}
                      </td>
                      <td
                        className={`py-3.5 px-4 ${isDark ? "text-gray-400" : "text-[#6B7280] font-medium"}`}
                      >
                        {(() => {
                          const rawD =
                            s.created_at ||
                            s.createdAt ||
                            s.submissionDate ||
                            s.submission_date ||
                            s.created_date ||
                            s.date;
                          if (rawD) {
                            const d = new Date(rawD);
                            if (!isNaN(d.getTime())) {
                              return d.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                            }
                          }
                          return "14/9/2026";
                        })()}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isPartial && remAmt > 0 ? (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3 shrink-0" />
                            {formattedDueDate}
                          </span>
                        ) : (
                          <span
                            className={`text-xs ${isDark ? "text-gray-500" : "text-slate-400"}`}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-lg ${
                            isPaid
                              ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
                              : isPartial
                                ? "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400"
                                : isRejected
                                  ? "bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400"
                                  : "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-blue-500/15 dark:text-blue-400"
                          }`}
                        >
                          {isPaid
                            ? "PAID"
                            : isPartial
                              ? "PARTIAL"
                              : isRejected
                                ? "REJECTED"
                                : s.status
                                  ? s.status.toUpperCase()
                                  : "SUBMITTED"}
                        </span>
                      </td>
                      {/* Invoice Column */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => openInvoiceModal(s)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#3D5EF6]/10 text-[#3D5EF6] border border-[#3D5EF6]/30 hover:bg-[#3D5EF6]/20 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#3D5EF6] shrink-0" />
                            View Invoice
                          </button>
                        ) : (
                          <span
                            className={`text-xs font-semibold ${isDark ? "text-gray-500" : "text-slate-400"}`}
                          >
                            Pending Approval
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/partner/settlements/${s.id || sNumber}`}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            isDark
                              ? "border-[#1F2937] hover:bg-[#1F2937] text-gray-200 hover:text-white"
                              : "border-[#E5E7EB] hover:bg-[#EEF1FE] text-[#6B7280] hover:text-[#3D5EF6]"
                          }`}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pdfDataModal && (
        <InvoiceModal
          pdfData={pdfDataModal}
          onClose={() => setPdfDataModal(null)}
        />
      )}
    </div>
  );
}
