"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentService } from "@/services/agent.service";
import { FileText, Search, Download, Eye, Calendar, Printer, X } from "lucide-react";

export default function InvoicesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Styling helpers
  const card = `rounded-3xl p-6 md:p-8 border shadow-xl relative overflow-hidden backdrop-blur-xl ${
    isDark
      ? "bg-[#0d1f35]/80 border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white"
      : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
  }`;
  const ht = isDark ? "text-white/95" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const borderB = isDark ? "border-white/5" : "border-slate-100";

  const fetchInvoices = async () => {
    try {
      const data = await agentService.getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.seafarerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || inv.invoiceStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Invoices Ledger</h1>
        <p className={`text-xs mt-1.5 ${mt}`}>View, search, and download commission statements and receipts associated with your referred seafarers.</p>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice, seafarer, course..."
            className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none ${
              isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
            }`}
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 w-full md:w-auto">
          {["all", "paid", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider capitalize cursor-pointer transition ${
                statusFilter === status
                  ? isDark
                    ? "bg-cyan-600 text-white"
                    : "bg-[#3b71cb] text-white"
                  : isDark
                  ? "bg-[#0b182d] border border-slate-800 text-slate-400 hover:bg-white/5"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className={card}>
        <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold">Generated Invoices History</h3>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No invoices found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto animate-fadeIn">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-450"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3.5 px-2">Invoice Number</th>
                  <th className="py-3.5 px-2">Purchase Date</th>
                  <th className="py-3.5 px-2">Seafarer</th>
                  <th className="py-3.5 px-2">Course Name</th>
                  <th className="py-3.5 px-2 text-right">Course Fee</th>
                  <th className="py-3.5 px-2 text-center">Status</th>
                  <th className="py-3.5 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="py-4 px-2 font-black tracking-wider text-cyan-400">{inv.invoiceNumber}</td>
                    <td className="py-4 px-2 font-semibold">
                      {new Date(inv.purchaseDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-2 font-bold">{inv.seafarerName}</td>
                    <td className="py-4 px-2">{inv.courseName}</td>
                    <td className="py-4 px-2 text-right font-bold">₹{inv.purchaseAmount.toLocaleString("en-IN")}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        inv.invoiceStatus === "Paid"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {inv.invoiceStatus}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className={`p-1.5 rounded-lg border transition ${
                            isDark ? "border-slate-800 hover:bg-white/5 text-slate-400 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className={`p-1.5 rounded-lg border transition ${
                            isDark ? "border-slate-800 hover:bg-white/5 text-slate-400 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- INVOICE VIEW MODAL --- */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn py-10 px-4">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 border shadow-2xl relative ${
            isDark ? "bg-[#0b182d] border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            {/* Close */}
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-6 top-6 p-1.5 rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            {/* Print Header Actions */}
            <div className="flex gap-2 mb-6 no-print">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" /> Print Statement
              </button>
            </div>

            {/* Printable Invoice Container */}
            <div id="printable-invoice" className="space-y-6 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-slate-800/40">
                <div>
                  <h2 className="text-xl font-black tracking-tight">HARI OM THALASSIC</h2>
                  <p className="text-[10px] text-slate-500 mt-1">DGS Approved Training Institute & Crewing Partner</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
                    {selectedInvoice.invoiceType} Invoice
                  </span>
                  <p className="text-sm font-black tracking-wider text-cyan-400 mt-2">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>

              {/* Bill Split Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b pb-6 border-slate-800/40">
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Customer / Seafarer</p>
                  <p className="font-black text-sm">{selectedInvoice.seafarerName}</p>
                  <p className="text-slate-500">Registered Lead Reference</p>
                </div>
                <div className="space-y-1 md:text-right">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Payment Details</p>
                  <p className="font-black">Transaction ID: TXN-{selectedInvoice.id.substring(0,8).toUpperCase()}</p>
                  <p className="text-slate-500">
                    Date:{" "}
                    {new Date(selectedInvoice.purchaseDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Course Detail Table */}
              <div className="space-y-2">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Purchased Course Details</p>
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex justify-between text-xs font-bold border-b pb-2.5 mb-2.5 border-slate-800/20">
                    <span>Description / Item</span>
                    <span>Amount</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{selectedInvoice.courseName} (Attributed Referral)</span>
                    <span>₹{selectedInvoice.purchaseAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Agent Attribution Information */}
              <div className="space-y-2 pt-2">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Agent Partner Earnings Breakdown</p>
                <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-cyan-500/5 text-center text-xs">
                  <div className="space-y-1 border-r border-slate-800/20">
                    <p className="text-slate-500 text-[10px]">Commission Type</p>
                    <p className="font-bold text-cyan-400">HAC Referred</p>
                  </div>
                  <div className="space-y-1 border-r border-slate-800/20">
                    <p className="text-slate-500 text-[10px]">Earning Rate</p>
                    <p className="font-bold text-cyan-400">{selectedInvoice.commissionRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500 text-[10px]">Your Earnings</p>
                    <p className="font-bold text-emerald-500">₹{selectedInvoice.commissionAmount.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>

              {/* Terms and Footer */}
              <div className="pt-4 border-t border-slate-800/40 text-[9px] text-slate-500 space-y-1">
                <p className="font-bold uppercase tracking-wider">Terms & Conditions</p>
                <p>1. Invoices are automatically generated and linked directly to commission snapshots at the time of purchase.</p>
                <p>2. Commision earnings are subject to validation and audit log history prior to monthly payout batches settlement.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
