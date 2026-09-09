"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  DollarSign, Clock, CheckCircle2, XCircle, Search, Filter
} from "lucide-react";

export default function CommissionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [commissions, setCommissions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await agentService.getCommissions();
        setCommissions(data);

        const dash: any = await agentService.getDashboard();
        setStats(dash?.stats || dash || {});
      } catch (err) {
        console.error("Failed to load commissions ledger:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EEF1FE] text-[#3D5EF6]">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const filteredCommissions = commissions.filter((comm) => {
    const matchesSearch =
      comm.seafarer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.course_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      comm.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-24 rounded-[16px] ${isDark ? "bg-[#0B0F19]" : "bg-slate-100"}`} />
          ))}
        </div>
        <div className={`h-96 rounded-[16px] ${isDark ? "bg-[#0B0F19]" : "bg-slate-100"}`} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Commissions Ledger
        </h1>
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
          Review and audit calculated commission receipts. Approved commissions are settled into your bank account monthly.
        </p>
      </div>

      {/* Metrics Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Commissions Earned", value: `₹${stats?.totalEarned?.toLocaleString() || 0}`, icon: DollarSign },
          { label: "Pending Clearance", value: `₹${stats?.pendingCommission?.toLocaleString() || 0}`, icon: Clock },
          { label: "Settled / Paid Earnings", value: `₹${stats?.paidCommission?.toLocaleString() || 0}`, icon: CheckCircle2 },
        ].map((met, idx) => {
          const Icon = met.icon;
          return (
            <div
              key={idx}
              className={`rounded-[16px] border-0 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-colors duration-200 ${
                isDark 
                  ? "bg-[#0B0F19] text-white" 
                  : "bg-white text-[#111827]"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                    {met.label}
                  </span>
                  <p className="text-xl font-black tracking-tight">{met.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Ledger Table Section */}
      <section className={`rounded-[16px] border-0 p-6 md:p-8 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
        isDark ? "bg-[#0B0F19] text-white" : "bg-white text-[#111827]"
      }`}>
        
        {/* Search & Filters */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-5 mb-5 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
          <div className="flex-1 w-full max-w-sm">
            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm ${isDark ? "bg-[#111827] border-[#1F2937] text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]"}`}>
              <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search by seafarer name or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-gray-500" : "placeholder:text-[#9CA3AF]"}`}
              />
            </label>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <Filter className="w-4 h-4 opacity-50" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2.5 text-xs rounded-full border outline-none cursor-pointer ${
                isDark ? "bg-[#111827] border-[#1F2937] text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]"
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        {filteredCommissions.length === 0 ? (
          <div className="text-center py-16 text-[#6B7280]">
            <DollarSign className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <h4 className="text-sm font-bold">No commission entries found</h4>
            <p className="text-xs mt-1">Earnings will generate here upon booking completion.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-semibold border-b uppercase tracking-wider text-[10px] ${
                  isDark ? "text-gray-400 border-[#1F2937]" : "text-[#6B7280] border-[#E5E7EB]"
                }`}>
                  <th className="pb-3 pr-4">Invoice Ref</th>
                  <th className="pb-3 pr-4">Referred Seafarer</th>
                  <th className="pb-3 pr-4">Course Details</th>
                  <th className="pb-3 pr-4">Course Fee</th>
                  <th className="pb-3 pr-4">Comm. Rate</th>
                  <th className="pb-3 pr-4">Earnings</th>
                  <th className="pb-3 pr-4">Purchase Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
                {filteredCommissions.map((comm) => (
                  <tr key={comm.id} className={`transition-colors duration-200 ${
                    isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/70"
                  }`}>
                    <td className="py-4 pr-4 font-mono font-bold tracking-wider text-[10px] text-[#3D5EF6]">
                      INV-{comm.purchase_id?.substring(0, 8).toUpperCase() || comm.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 pr-4 font-extrabold">
                      {comm.seafarer_name}
                    </td>
                    <td className="py-4 pr-4 font-semibold max-w-[150px] truncate">
                      {comm.course_name}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      ₹{comm.course_fee?.toLocaleString()}
                    </td>
                    <td className="py-4 pr-4 font-bold">
                      {comm.commission_rate}%
                    </td>
                    <td className="py-4 pr-4 font-bold text-[#111827] dark:text-white">
                      ₹{comm.commission_amount?.toLocaleString()}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      {new Date(comm.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      {getStatusBadge(comm.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
