"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, FileText, Upload, Download, Eye,
  CheckCircle2, Clock, AlertCircle, X, Filter,
  Anchor, File, Image, Archive, Users, Globe, Handshake,
  Calendar,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const DOCUMENTS = [
  { id: "DOC-001", name: "Raj Kumar — STCW Certificate.pdf",   seafarer: "Raj Kumar",      type: "Certificate", fileType: "pdf",  size: "1.2 MB", status: "Verified",  uploadedBy: "website", date: "Jul 20, 2026", source: "Website" },
  { id: "DOC-002", name: "Mohammed Rafiq — CDC Copy.pdf",      seafarer: "Mohammed Rafiq", type: "CDC",         fileType: "pdf",  size: "840 KB", status: "Verified",  uploadedBy: "agent",   date: "Jul 21, 2026", source: "Capt. Nair" },
  { id: "DOC-003", name: "Priya Sharma — Passport Scan.jpg",   seafarer: "Priya Sharma",   type: "ID Proof",    fileType: "img",  size: "2.1 MB", status: "Pending",   uploadedBy: "website", date: "Jul 19, 2026", source: "Website" },
  { id: "DOC-004", name: "Arjun Dev — Medical Certificate.pdf",seafarer: "Arjun Dev",      type: "Medical",     fileType: "pdf",  size: "560 KB", status: "Pending",   uploadedBy: "agent",   date: "Jul 19, 2026", source: "Capt. Nair" },
  { id: "DOC-005", name: "Sunita Rajan — Course Enrolment.pdf",seafarer: "Sunita Rajan",   type: "Enrolment",   fileType: "pdf",  size: "320 KB", status: "Verified",  uploadedBy: "website", date: "Jul 17, 2026", source: "Website" },
  { id: "DOC-006", name: "Kavitha Bose — Agent Letter.pdf",    seafarer: "Kavitha Bose",   type: "Agent Letter",fileType: "pdf",  size: "210 KB", status: "Verified",  uploadedBy: "agent",   date: "Jul 18, 2026", source: "SeaLink Agency" },
  { id: "DOC-007", name: "Karan Mehta — Withdrawal Form.pdf",  seafarer: "Karan Mehta",    type: "Withdrawal",  fileType: "pdf",  size: "180 KB", status: "Rejected",  uploadedBy: "website", date: "Jul 15, 2026", source: "Website" },
  { id: "DOC-008", name: "Savitha Raj — Indemnity Bond.pdf",   seafarer: "Savitha Raj",    type: "Bond",        fileType: "pdf",  size: "450 KB", status: "Rejected",  uploadedBy: "agent",   date: "Jul 15, 2026", source: "SeaLink Agency" },
  { id: "DOC-009", name: "Amit Patel — Engine Certificate.pdf",seafarer: "Amit Patel",     type: "Certificate", fileType: "pdf",  size: "980 KB", status: "Verified",  uploadedBy: "website", date: "Jul 18, 2026", source: "Website" },
  { id: "DOC-010", name: "Tara Singh — Photo ID.jpg",          seafarer: "Tara Singh",     type: "ID Proof",    fileType: "img",  size: "1.8 MB", status: "Verified",  uploadedBy: "agent",   date: "Jul 20, 2026", source: "Rajan Associates" },
  { id: "DOC-011", name: "Naresh Pillai — Medical Report.pdf", seafarer: "Naresh Pillai",  type: "Medical",     fileType: "pdf",  size: "670 KB", status: "Pending",   uploadedBy: "agent",   date: "Jul 17, 2026", source: "Rajan Associates" },
  { id: "DOC-012", name: "Deepa Nair — Catering Course Cert.pdf",seafarer: "Deepa Nair",  type: "Certificate", fileType: "pdf",  size: "740 KB", status: "Verified",  uploadedBy: "website", date: "Jul 14, 2026", source: "Website" },
  { id: "DOC-013", name: "Rohit Sharma — Tanker Cert.pdf",     seafarer: "Rohit Sharma",   type: "Certificate", fileType: "pdf",  size: "920 KB", status: "Pending",   uploadedBy: "website", date: "Jul 11, 2026", source: "Website" },
  { id: "DOC-014", name: "Geetha Menon — Radio License.pdf",   seafarer: "Geetha Menon",   type: "License",     fileType: "pdf",  size: "310 KB", status: "Verified",  uploadedBy: "agent",   date: "Jul 13, 2026", source: "SeaLink Agency" },
];

const DOC_TYPES  = ["All", "Certificate", "CDC", "ID Proof", "Medical", "Enrolment", "Agent Letter", "License"];
const STATUSES   = ["All", "Verified", "Pending", "Rejected"];

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-red-400" />,
  img: <Image className="w-4 h-4 text-sky-400" />,
  zip: <Archive className="w-4 h-4 text-amber-400" />,
};

const statusCls: Record<string, [string, string]> = {
  Verified: ["bg-emerald-100 text-emerald-700", "bg-emerald-500/10 text-emerald-400"],
  Pending:  ["bg-amber-100 text-amber-700",     "bg-amber-500/10 text-amber-400"],
  Rejected: ["bg-red-100 text-red-700",         "bg-red-500/10 text-red-400"],
};
const statusIcons: Record<string, React.ReactNode> = {
  Verified: <CheckCircle2 className="w-3 h-3" />,
  Pending:  <Clock        className="w-3 h-3" />,
  Rejected: <AlertCircle  className="w-3 h-3" />,
};

type Doc = typeof DOCUMENTS[0];

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query,  setQuery]  = useState("");
  const [type,   setType]   = useState("All");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-indigo-500/50" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const rowHov  = dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const chipAct = "bg-indigo-500 text-white";
  const chipIn  = dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700";

  const filtered = useMemo(() =>
    DOCUMENTS.filter(d => {
      const q = query.toLowerCase();
      const matchQ      = d.name.toLowerCase().includes(q) || d.seafarer.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
      const matchType   = type   === "All" || d.type   === type;
      const matchStatus = status === "All" || d.status === status;
      const matchSource = source === "All" || (source === "Website" ? d.uploadedBy === "website" : d.uploadedBy === "agent");
      return matchQ && matchType && matchStatus && matchSource;
    }),
    [query, type, status, source]
  );

  const kpis = [
    { label: "Total Docs",  value: DOCUMENTS.length,                                         color: dk ? "text-indigo-400" : "text-indigo-600", bg: dk ? "bg-indigo-500/15" : "bg-indigo-50",  icon: FileText },
    { label: "Verified",    value: DOCUMENTS.filter(d => d.status === "Verified").length,  color: dk ? "text-emerald-400": "text-emerald-600",bg: dk ? "bg-emerald-500/15": "bg-emerald-50", icon: CheckCircle2 },
    { label: "Pending",     value: DOCUMENTS.filter(d => d.status === "Pending").length,   color: dk ? "text-amber-400"  : "text-amber-600",  bg: dk ? "bg-amber-500/15"  : "bg-amber-50",  icon: Clock },
    { label: "Rejected",    value: DOCUMENTS.filter(d => d.status === "Rejected").length,  color: dk ? "text-red-400"    : "text-red-600",    bg: dk ? "bg-red-500/15"    : "bg-red-50",    icon: AlertCircle },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Documents</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Seafarer certificates, IDs, and enrolment documents</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Upload className="w-4 h-4" /> Upload Doc
        </button>
      </div>

      {/* KPI strip */}
      <div className={card}>
        <div className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {kpis.map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-4 px-6 py-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
                  <Icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{k.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} p-4 space-y-3`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search documents or seafarer name…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "Website", "Agent"].map(s => (
              <button key={s} onClick={() => setSource(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${source === s ? chipAct : chipIn}`}>
                {s === "All" ? "All Sources" : s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className={`w-3.5 h-3.5 ${mt}`} />
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${status === s ? "bg-slate-700 text-white" : chipIn}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Document","Seafarer","Type","Size","Source","Status","Date",""].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map(d => (
                <tr key={d.id} className={`${rowHov} transition-colors`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dk ? "bg-white/5" : "bg-slate-50"}`}>
                        {fileIcons[d.fileType] ?? <File className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-medium truncate max-w-[200px] ${ht}`}>{d.name}</p>
                        <p className={`text-[10px] font-mono ${mt}`}>{d.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-[12px] ${dk ? "text-white/55" : "text-slate-600"} whitespace-nowrap`}>{d.seafarer}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${dk ? "bg-white/6 text-white/50" : "bg-slate-100 text-slate-600"} whitespace-nowrap`}>{d.type}</span>
                  </td>
                  <td className={`px-5 py-3.5 text-[12px] tabular-nums ${mt}`}>{d.size}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      d.uploadedBy === "website"
                        ? (dk ? "bg-sky-500/15 text-sky-400" : "bg-sky-100 text-sky-700")
                        : (dk ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-100 text-indigo-700")
                    }`}>
                      {d.uploadedBy === "website" ? <Globe className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
                      {d.source}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${dk ? statusCls[d.status]?.[1] : statusCls[d.status]?.[0]}`}>
                      {statusIcons[d.status]}{d.status}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-[12px] whitespace-nowrap ${mt}`}>{d.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/30 hover:text-white/60" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
                        <Eye      className="w-3.5 h-3.5" />
                      </button>
                      <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/30 hover:text-white/60" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No documents match your filters</p>
          </div>
        )}
        <div className={`px-5 py-3 border-t text-xs ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
          Showing {filtered.length} of {DOCUMENTS.length} documents
        </div>
      </div>
    </div>
  );
}
