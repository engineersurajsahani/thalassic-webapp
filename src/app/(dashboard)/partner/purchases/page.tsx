"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { invoicesService } from "@/services/invoices.service";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { useTheme } from "@/providers/theme-provider";
import {
  Receipt,
  Search,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  FileText,
  Eye,
} from "lucide-react";

export default function PurchasesPage() {
  const { theme, mounted } = useTheme();
  const isDark = mounted ? theme === "dark" : true;

  const [purchases, setPurchases] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [pdfDataModal, setPdfDataModal] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getPurchases();
        setPurchases(data || []);
      } catch (err) {
        console.error("Failed to load purchases:", err);
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

  const openInvoiceModal = async (purchaseItem: any) => {
    try {
      const invNo = purchaseItem.hac_invoice_number || purchaseItem.invoice_number || purchaseItem.invoiceNumber || (purchaseItem.id?.includes("-") ? `HAC-2026-${purchaseItem.id.substring(0, 6).toUpperCase()}` : purchaseItem.id);
      const pdf = await invoicesService.getInvoicePdfData(purchaseItem.id || invNo, purchaseItem);
      if (pdf && pdf.invoice) {
        pdf.invoice.customer_name = purchaseItem.seafarerName || purchaseItem.customer_name || purchaseItem.seafarer_name || "Seafarer Candidate";
        pdf.invoice.course_name = purchaseItem.courseName || purchaseItem.course_name || purchaseItem.course || "STCW Maritime Course";
        const amt = Number(purchaseItem.payableAmount || purchaseItem.hariom_payable || purchaseItem.final_amount || 0);
        if (amt > 0) {
          pdf.invoice.final_amount = amt;
          pdf.invoice.hariom_payable_amount = amt;
          pdf.invoice.course_fee = amt;
        }
        pdf.invoice.invoice_number = invNo;
      }
      setPdfDataModal(pdf);
    } catch (err) {
      console.warn("Failed to load invoice PDF data:", err);
    }
  };

  const filtered = purchases.filter((p) => {
    const q = search.toLowerCase();
    const invNo = p.hac_invoice_number || p.invoice_number || p.invoiceNumber || (p.id?.includes("-") ? `HAC-2026-${p.id.substring(0, 6).toUpperCase()}` : p.id);
    const matchQuery =
      p.id?.toLowerCase().includes(q) ||
      invNo.toLowerCase().includes(q) ||
      p.seafarerName?.toLowerCase().includes(q) ||
      p.courseName?.toLowerCase().includes(q) ||
      p.indosNumber?.toLowerCase().includes(q);

    if (statusFilter === "all") return matchQuery;
    return matchQuery && p.settlementStatus?.toLowerCase() === statusFilter.toLowerCase();
  });

  const cardBg = `rounded-[16px] border-0 ${
    isDark
      ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
      : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
  }`;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-white">
            Partner Course Purchases & Invoices
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
            Track all course enrollments created by your partner account, with generated tax invoices and settlement statuses.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/settlements/create"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors duration-200 ${
              isDark
                ? "bg-[#1F2937] hover:bg-[#374151] text-gray-200"
                : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#6B7280] dark:text-gray-300" />
            Submit Settlement
          </Link>
          <Link
            href="/partner/purchases/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors duration-200 shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            New Purchase
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-[16px] border-0 flex flex-col sm:flex-row items-center gap-3 ${cardBg}`}>
        <div className="relative flex-1 w-full">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-[#9CA3AF]"}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Invoice Number, Purchase ID, Seafarer name, INDoS, or Course..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium outline-none transition-colors duration-200 ${
              isDark
                ? "bg-[#111827] border-0 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-[#3D5EF6]"
                : "bg-[#FAFAFA] border-0 text-[#111827] placeholder:text-[#9CA3AF] focus:ring-1 focus:ring-[#3D5EF6]"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-gray-400" : "text-[#9CA3AF]"}`} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold outline-none transition-colors duration-200 ${
              isDark ? "bg-[#111827] border-0 text-gray-200" : "bg-[#FAFAFA] border-0 text-[#111827]"
            }`}
          >
            <option value="all">All Settlement Statuses</option>
            <option value="pending">Pending Settlement</option>
            <option value="submitted">Submitted</option>
            <option value="under verification">Under Verification</option>
            <option value="completed">Completed</option>
            <option value="settled">Settled</option>
          </select>
        </div>
      </div>

      {/* Purchases Table */}
      <div className={`rounded-[16px] border-0 overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-[#6B7280] dark:text-gray-400 animate-pulse">Loading purchases...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-10 h-10 text-[#9CA3AF] dark:text-gray-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#111827] dark:text-white">No purchases found.</p>
            <Link
              href="/partner/purchases/create"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors duration-200 hover:underline"
            >
              Create a new course purchase
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-[#111827] text-gray-400 border-b border-[#1F2937]" : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB]"}>
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Invoice Number</th>
                  <th className="py-3.5 px-4 font-semibold">Seafarer Master</th>
                  <th className="py-3.5 px-4 font-semibold">Course Program</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Hari Om Payable</th>
                  <th className="py-3.5 px-4 font-semibold">Purchase Date</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Settlement Status</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Tax Invoice</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-[#1F2937]" : "divide-[#E5E7EB]"}`}>
                {filtered.map((p) => {
                  const invNo = p.hac_invoice_number || p.invoice_number || p.invoiceNumber || (p.id?.includes("-") ? `HAC-2026-${p.id.substring(0, 6).toUpperCase()}` : p.id);
                  const isSettled = p.settlementStatus === "Completed" || p.settlementStatus === "Settled" || p.settlementStatus === "Paid";
                  const isInvoiceGen = Boolean(
                    invoicesService.isInvoiceGenerated(p.id) ||
                    invoicesService.isInvoiceGenerated(invNo) ||
                    p.isInvoiceGenerated ||
                    p.invoice_generated ||
                    p.invoiceGenerated
                  );

                  return (
                    <tr key={p.id} className="hover:bg-[#EEF1FE]/30 dark:hover:bg-white/[0.02] transition-colors duration-200">
                      {/* Invoice Number & Purchase Ref */}
                      <td className="py-3.5 px-4">
                        <p className="font-mono font-bold text-xs text-[#3D5EF6]">{invNo}</p>
                        {p.id !== invNo && (
                          <p className="text-[10px] text-[#9CA3AF] dark:text-gray-400 font-mono mt-0.5 truncate max-w-[140px]" title={p.id}>
                            ID: {p.id}
                          </p>
                        )}
                      </td>

                      {/* Seafarer Master */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-[#111827] dark:text-white leading-tight">{p.seafarerName}</p>
                          <p className="text-[10px] text-[#9CA3AF] dark:text-gray-400 font-mono mt-0.5">
                            INDoS: {p.indosNumber || "N/A"}
                          </p>
                        </div>
                      </td>

                      {/* Course Program */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#111827] dark:text-white">{p.courseName}</p>
                        <p className="text-[10px] text-[#9CA3AF] dark:text-gray-400">Classroom Training</p>
                      </td>

                      {/* Hari Om Payable */}
                      <td className="py-3.5 px-4 font-bold text-right text-[#111827] dark:text-white">
                        ₹{Number(p.payableAmount).toLocaleString("en-IN")}
                      </td>

                      {/* Purchase Date */}
                      <td className="py-3.5 px-4 text-[#6B7280] dark:text-gray-400">
                        {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                      </td>

                      {/* Settlement Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-lg ${
                            isSettled
                              ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
                              : p.settlementStatus === "Rejected"
                              ? "bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400"
                              : "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400"
                          }`}
                        >
                          {isSettled ? "SETTLED" : p.settlementStatus}
                        </span>
                      </td>

                      {/* Tax Invoice Section / Button */}
                      <td className="py-3.5 px-4 text-center">
                        {isInvoiceGen ? (
                          <button
                            type="button"
                            onClick={() => openInvoiceModal(p)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400 hover:bg-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto border border-emerald-500/20"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Tax Invoice
                          </button>
                        ) : (
                          <span
                            title="Tax Invoice has not been generated by Admin yet"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 cursor-help mx-auto whitespace-nowrap"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Invoice Pending
                          </span>
                        )}
                      </td>

                      {/* Details Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/partner/purchases/${p.id}`}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 ${
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
        {/* Invoice Modal Popup */}
        {pdfDataModal && (
          <InvoiceModal pdfData={pdfDataModal} onClose={() => setPdfDataModal(null)} />
        )}
      </div>
    </div>
  );
}
