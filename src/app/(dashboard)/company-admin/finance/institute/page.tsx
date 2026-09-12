"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import { mockPayments } from "@/components/company-admin/mockData";
import FinanceTabs from "@/components/company-admin/FinanceTabs";
import {
  Building,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const INST_AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
];

function instInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function InstituteFinancePage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const card = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht = dk ? "text-white" : "text-[#000000]";
  const mt = dk ? "text-white/60" : "text-[#000000]/70";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const inputBg = dk
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-sky-500/50"
    : "bg-slate-50 border-slate-200 text-[#000000] placeholder:text-slate-500 focus:border-sky-400";
  const chipAct = dk
    ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
    : "bg-sky-50 text-sky-600 border border-sky-200 font-bold";
  const chipIn = dk
    ? "text-white/40 hover:text-white/80 font-medium"
    : "text-slate-500 hover:text-slate-800 font-medium";

  const statusCls = (s: string) => {
    if (s === "Paid")
      return dk
        ? "bg-emerald-500/15 text-emerald-400"
        : "bg-emerald-100 text-emerald-700";
    if (s === "Pending")
      return dk
        ? "bg-amber-500/15 text-amber-400"
        : "bg-amber-100 text-amber-700";
    if (s === "Partial")
      return dk ? "bg-blue-500/15 text-blue-400" : "bg-blue-100 text-blue-700";
    return dk ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-700";
  };
  const statusIcon = (s: string) => {
    if (s === "Paid") return <CheckCircle2 className="w-3 h-3" />;
    if (s === "Pending") return <Clock className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  const instituteGroups = useMemo(() => {
    // First group by instituteId
    const byInstitute: Record<
      string,
      {
        instituteId: string;
        instituteName: string;
        courseRows: {
          course: string;
          seafarerIds: Set<string>;
          totalAmount: number;
          amountReceived: number;
          pendingAmount: number;
          payments: typeof mockPayments;
        }[];
        totalAmount: number;
        amountReceived: number;
        pendingAmount: number;
      }
    > = {};

    mockPayments.forEach((p) => {
      // Institute group
      if (!byInstitute[p.instituteId]) {
        byInstitute[p.instituteId] = {
          instituteId: p.instituteId,
          instituteName: p.instituteName,
          courseRows: [],
          amountReceived: 0,
          pendingAmount: 0,
          totalAmount: 0,
        };
      }

      const inst = byInstitute[p.instituteId];
      inst.totalAmount += p.amount;
      if (p.status === "Paid") inst.amountReceived += p.amount;
      else inst.pendingAmount += p.amount;

      // Course row within this institute
      let courseRow = inst.courseRows.find((c) => c.course === p.course);
      if (!courseRow) {
        courseRow = {
          course: p.course,
          seafarerIds: new Set(),
          totalAmount: 0,
          amountReceived: 0,
          pendingAmount: 0,
          payments: [],
        };
        inst.courseRows.push(courseRow);
      }

      cRow.seafarerIds.add(p.seafarerId || p.seafarerName);
      cRow.totalAmount += p.amount;
      if (p.status === "Paid") cRow.amountReceived += p.amount;
      else cRow.pendingAmount += p.amount;
    });

    return Object.values(byInstitute);
  }, []);

  const stats = useMemo(() => {
    const totalInst = instituteGroups.length;
    const totalRev = instituteGroups.reduce((s, g) => s + g.totalAmount, 0);
    const totalRec = instituteGroups.reduce((s, g) => s + g.amountReceived, 0);
    const totalPend = instituteGroups.reduce((s, g) => s + g.pendingAmount, 0);
    return { totalInst, totalRev, totalRec, totalPend };
  }, [instituteGroups]);

  const overallStatus = (received: number, pending: number) => {
    if (pending === 0) return "Paid";
    if (received === 0) return "Pending";
    return "Partial";
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return instituteGroups.filter((g) => {
      const matchQ =
        g.instituteName.toLowerCase().includes(q) ||
        g.courseRows.some((c) => c.course.toLowerCase().includes(q));
      const status = overallStatus(g.amountReceived, g.pendingAmount);
      const matchS =
        filterStatus === "All" ||
        filterStatus === status ||
        (filterStatus === "Partial" && status === "Partial");
      return matchQ && matchS;
    });
  }, [instituteGroups, query, filterStatus]);

  const chipAct = "bg-sky-500 text-white";
  const chipIn = dk
    ? "bg-white/5 text-white/40 hover:text-white/60"
    : "bg-slate-100 text-slate-500 hover:text-slate-700";

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Company Finance</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>
          Course payment records grouped by Training Institute
        </p>
      </div>

      <FinanceTabs />

      <div className={card}>
        <div
          className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}
        >
          {[
            { label: "Institutes", val: instituteGroups.length, cls: ht },
            {
              label: "Total Revenue",
              val:
                "₹" +
                (mockPayments.reduce((s, p) => s + p.amount, 0) / 1000).toFixed(
                  1,
                ) +
                "K",
              cls: dk ? "text-indigo-400" : "text-indigo-600",
            },
            {
              label: "Amount Received",
              val:
                "₹" +
                (
                  mockPayments
                    .filter((p) => p.status === "Paid")
                    .reduce((s, p) => s + p.amount, 0) / 1000
                ).toFixed(1) +
                "K",
              cls: dk ? "text-emerald-400" : "text-emerald-600",
            },
            {
              label: "Pending Amount",
              val:
                "₹" +
                (
                  mockPayments
                    .filter((p) => p.status !== "Paid")
                    .reduce((s, p) => s + p.amount, 0) / 1000
                ).toFixed(1) +
                "K",
              cls: dk ? "text-amber-400" : "text-amber-600",
            },
          ].map((s) => (
            <div key={s.label} className="px-6 py-4 text-center">
              <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${card} p-6`}>
        <h2 className={`text-sm font-bold mb-5 ${ht}`}>Revenue by Institute</h2>
        {instituteGroups.length === 0 ? (
          <p className={`text-sm ${mt} text-center py-8`}>No data available</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={instituteGroups.map((g) => {
                  // Clean readable short display name for horizontal axis
                  const shortName = g.instituteName
                    .replace("Maritime Training Institute", "MTI")
                    .replace("Training Institute", "Inst.")
                    .replace("Maritime Center", "Maritime");
                  const displayName =
                    shortName.length > 22
                      ? shortName.slice(0, 20) + "…"
                      : shortName;

                  return {
                    name: displayName,
                    fullName: g.instituteName,
                    Received: g.amountReceived,
                    Pending: g.pendingAmount,
                  };
                })}
                barGap={6}
                barCategoryGap="25%"
                margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={dk ? "rgba(255,255,255,0.06)" : "#e2e8f0"}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fontWeight: "600",
                    fill: dk ? "#f1f5f9" : "#1e293b",
                  }}
                  axisLine={{
                    stroke: dk ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                  }}
                  tickLine={false}
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  dy={10}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fontWeight: "500",
                    fill: dk ? "#cbd5e1" : "#475569",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(val: number | string, name: number | string) => [
                    `₹${Number(val).toLocaleString("en-IN")}`,
                    String(name),
                  ]}
                  labelFormatter={(_label, payload) => {
                    if (
                      payload &&
                      payload.length > 0 &&
                      payload[0].payload?.fullName
                    ) {
                      return payload[0].payload.fullName;
                    }
                    return _label;
                  }}
                  contentStyle={{
                    backgroundColor: dk ? "#0c1a2e" : "#ffffff",
                    borderColor: dk ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                    borderRadius: "12px",
                    color: dk ? "#ffffff" : "#0f172a",
                    fontSize: 12,
                    fontWeight: 600,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Legend
                  iconType="square"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: 11,
                    fontWeight: 500,
                    paddingTop: 12,
                  }}
                />
                <Bar dataKey="Received" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className={`${card} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search institute or course…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {["All", "Paid", "Pending", "Partial"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${filterStatus === s ? chipAct : chipIn}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Institute Groups – accordion */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className={`${card} text-center py-16 ${mt}`}>
            <Building className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No institute records match your search</p>
          </div>
        )}
        {filtered.map((g, gi) => {
          const isOpen = expandedId === g.instituteId;
          const status = overallStatus(g.amountReceived, g.pendingAmount);
          const sfCount = new Set(
            g.courseRows.flatMap((c) => Array.from(c.seafarerIds)),
          ).size;

          return (
            <div key={g.instituteId} className={card}>
              {/* Institute row header */}
              <button
                onClick={() => setExpandedId(isOpen ? null : g.instituteId)}
                className={`w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${INST_AVATAR_COLORS[gi % INST_AVATAR_COLORS.length]}`}
                  >
                    {instInitials(g.instituteName)}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${ht}`}>
                      {g.instituteName}
                    </p>
                    <p className={`text-[11px] ${mt}`}>
                      {g.courseRows.length} course
                      {g.courseRows.length !== 1 ? "s" : ""} · {sfCount}{" "}
                      seafarer{sfCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold ${ht}`}>
                      ₹{g.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <p className={`text-[10px] ${mt}`}>Total</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold text-emerald-500`}>
                      ₹{g.amountReceived.toLocaleString("en-IN")}
                    </p>
                    <p className={`text-[10px] ${mt}`}>Received</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold text-amber-500`}>
                      ₹{g.pendingAmount.toLocaleString("en-IN")}
                    </p>
                    <p className={`text-[10px] ${mt}`}>Pending</p>
                  </div>
                  <span
                    className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${statusCls(status)}`}
                  >
                    {statusIcon(status === "Partial" ? "Pending" : status)}
                    {status}
                  </span>
                  {isOpen ? (
                    <ChevronUp className={`w-4 h-4 ${mt}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 ${mt}`} />
                  )}
                </div>
              </button>

              {/* Expanded: course-wise breakdown */}
              {isOpen && (
                <div
                  className={`border-t ${dk ? "border-white/5" : "border-slate-100"}`}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className={
                          dk
                            ? "border-b border-white/5 bg-white/[0.02]"
                            : "border-b border-slate-100 bg-slate-50"
                        }
                      >
                        {[
                          "Course",
                          "# Seafarers",
                          "Total Amount",
                          "Received",
                          "Pending",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className={`text-left px-5 py-3 text-[9px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${divider}`}>
                      {g.courseRows.map((row, ri) => {
                        const rowStatus = overallStatus(
                          row.amountReceived,
                          row.pendingAmount,
                        );
                        return (
                          <tr
                            key={ri}
                            className={`transition-colors ${dk ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60"}`}
                          >
                            <td
                              className={`px-5 py-3 text-[12px] font-medium max-w-[200px] truncate ${ht}`}
                            >
                              {row.course}
                            </td>
                            <td
                              className={`px-5 py-3 text-[13px] font-bold ${ht}`}
                            >
                              {row.seafarerIds.size}
                            </td>
                            <td
                              className={`px-5 py-3 text-[13px] font-bold ${ht}`}
                            >
                              ₹{row.totalAmount.toLocaleString("en-IN")}
                            </td>
                            <td
                              className={`px-5 py-3 text-[13px] font-bold text-emerald-500`}
                            >
                              ₹{row.amountReceived.toLocaleString("en-IN")}
                            </td>
                            <td
                              className={`px-5 py-3 text-[13px] font-bold text-amber-500`}
                            >
                              ₹{row.pendingAmount.toLocaleString("en-IN")}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCls(rowStatus)}`}
                              >
                                {statusIcon(
                                  rowStatus === "Partial"
                                    ? "Pending"
                                    : rowStatus,
                                )}
                                {rowStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`text-xs ${mt} pl-1`}>
        Showing {filtered.length} of {instituteGroups.length} institutes
      </div>
    </div>
  );
}
