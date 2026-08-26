"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  FileText, Calendar, RefreshCw, Filter,
  TrendingUp, TrendingDown,
  Users, UserCog, BarChart3,
  GitMerge, Activity,
  ArrowUpRight, X, Check, FileSpreadsheet, Printer, Download, Search, ShieldCheck, ClipboardList,
  Wallet, IndianRupee, CreditCard, Landmark,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

//  Dummy chart data 
const revenueData = [
  { month: "Jan", revenue: 180000, target: 200000 }, { month: "Feb", revenue: 210000, target: 200000 },
  { month: "Mar", revenue: 195000, target: 210000 }, { month: "Apr", revenue: 240000, target: 220000 },
  { month: "May", revenue: 220000, target: 230000 }, { month: "Jun", revenue: 280000, target: 250000 },
  { month: "Jul", revenue: 310000, target: 270000 }, { month: "Aug", revenue: 295000, target: 280000 },
];
const enrollData = [
  { month: "Feb", enroll: 320, complete: 210 }, { month: "Mar", enroll: 410, complete: 290 },
  { month: "Apr", enroll: 380, complete: 260 }, { month: "May", enroll: 510, complete: 380 },
  { month: "Jun", enroll: 490, complete: 340 }, { month: "Jul", enroll: 620, complete: 440 },
  { month: "Aug", enroll: 700, complete: 520 },
];
const referralData = [
  { month: "Feb", leads: 18, conversions: 10 }, { month: "Mar", leads: 24, conversions: 14 },
  { month: "Apr", leads: 20, conversions: 13 }, { month: "May", leads: 30, conversions: 19 },
  { month: "Jun", leads: 28, conversions: 18 }, { month: "Jul", leads: 36, conversions: 22 },
  { month: "Aug", leads: 40, conversions: 26 },
];

//  Report definitions 
const REPORT_CATEGORIES = [
  {
    id: "operational", label: "Operational", Icon: Activity, color: "text-sky-400", bg: "bg-sky-500/15",
    reports: [
      { id: "reg", name: "Platform Registration Report", desc: "Total seafarers and admins registered over time", rows: 840 },
      { id: "enroll", name: "Course Enrollment Report", desc: "Enrollments and completion rates by course", rows: 5234 },
      { id: "active", name: "Active User Report", desc: "Monthly active users across all portals", rows: 312 },
    ],
  },
  {
    id: "admin", label: "Administrative", Icon: UserCog, color: "text-violet-400", bg: "bg-violet-500/15",
    reports: [
      { id: "cadmin", name: "Company Admin Activity Report", desc: "Actions and logins by company administrators", rows: 8 },
      { id: "aadmin", name: "Agent Admin Activity Report", desc: "Actions and logins by agent administrators", rows: 7 },
      { id: "login", name: "Login Activity Report", desc: "All login attempts across the platform", rows: 1480 },
      { id: "audit", name: "Audit Log Report", desc: "Complete audit trail of all admin actions", rows: 3260 },
    ],
  },
  {
    id: "financial", label: "Financial", Icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/15",
    reports: [
      { id: "revenue", name: "Revenue Report", desc: "Total revenue breakdown by month and source", rows: 310 },
      { id: "payment", name: "Payment Report", desc: "All payment transactions with status", rows: 1245 },
      { id: "invoice", name: "Invoice Report", desc: "All raised invoices and settlement status", rows: 312 },
      { id: "settle", name: "Settlement Report", desc: "Settled and pending settlements summary", rows: 89 },
      { id: "commout", name: "Outstanding Commission Report", desc: "Commissions payable to agents and admins", rows: 41 },
    ],
  },
  {
    id: "referral", label: "Referral", Icon: GitMerge, color: "text-amber-400", bg: "bg-amber-500/15",
    reports: [
      { id: "refperf", name: "Referral Performance Report", desc: "Lead generation and conversion by agent", rows: 128 },
      { id: "agconv", name: "Agent Conversion Report", desc: "Conversion rates per agent admin", rows: 41 },
      { id: "refsrc", name: "Referral Source Analysis", desc: "Breakdown of referral origin channels", rows: 74 },
    ],
  },
];

const STATUS_FILTERS = ["All", "Pending", "Paid", "Overdue", "Settled", "Failed"];
const USER_TYPES = ["All", "Company Admin", "Agent Admin", "Agent", "Seafarer"];
const COURSES = ["All", "STCW Basic Safety", "Advanced Fire Fighting", "Ship Navigation & Radar", "Maritime Law", "Tanker Cargo Ops"];

type GenerateState = Record<string, "idle" | "generating" | "done">;
type DownloadState = Record<string, "idle" | "downloading">;
type ScheduleModal = { open: boolean; reportId: string; reportName: string; };

// Maps which report categories / ids are relevant to each filter dimension
const REPORT_USER_RELEVANCE: Record<string, string[]> = {
  "Company Admin": ["cadmin", "audit", "login", "revenue", "payment", "invoice", "settle", "commout"],
  "Agent Admin": ["aadmin", "audit", "login", "refperf", "agconv", "refsrc", "commout"],
  "Agent": ["refperf", "agconv", "refsrc", "commout"],
  "Seafarer": ["reg", "enroll", "active"],
};
const REPORT_COURSE_RELEVANCE: Record<string, string[]> = {
  "STCW Basic Safety": ["enroll", "active"],
  "Advanced Fire Fighting": ["enroll", "active"],
  "Ship Navigation & Radar": ["enroll", "active"],
  "Maritime Law": ["enroll", "active"],
  "Tanker Cargo Ops": ["enroll", "active"],
};
const REPORT_PAYMENT_RELEVANCE: Record<string, string[]> = {
  "Pending": ["payment", "invoice", "commout"],
  "Paid": ["payment", "invoice", "revenue"],
  "Overdue": ["invoice", "commout"],
  "Settled": ["settle", "revenue"],
  "Failed": ["payment"],
};

// Month order for date filtering
const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── Audit log static dataset ─────────────────────────────────────────────
const ACTIONS = ["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "EXPORT", "VIEW", "APPROVE", "REJECT"];
const ROLES = ["Master Admin", "Company Admin", "Agent Admin", "Agent", "Seafarer"];
const ENTITIES = ["User", "Invoice", "Course", "Settlement", "Commission", "Report", "Enrollment", "Partner"];
const DETAILS_MAP: Record<string, string> = {
  LOGIN: "Successful authentication", LOGOUT: "Session terminated",
  CREATE: "New record created", UPDATE: "Record fields modified",
  DELETE: "Record permanently removed", EXPORT: "Data exported to CSV",
  VIEW: "Record accessed (read-only)", APPROVE: "Approval granted",
  REJECT: "Request rejected",
};
const AUDIT_LOGS = Array.from({ length: 40 }, (_, i) => {
  const action = ACTIONS[i % ACTIONS.length];
  const d = new Date(2025, 7, 1 + Math.floor(i / 3), 8 + (i % 14), (i * 7) % 60);
  return {
    id: `AL-${2000 + i}`,
    timestamp: d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    user: `${["Ravi", "Priya", "Sameer", "Anita", "James", "Fatima", "Liu"][i % 7]} ${["Kumar", "Singh", "Patel", "Roy", "D'Souza", "Malik", "Wei"][i % 7]}`,
    role: ROLES[i % ROLES.length],
    action,
    entityId: `${ENTITIES[i % ENTITIES.length].toUpperCase().slice(0, 3)}-${1000 + i}`,
    entity: ENTITIES[i % ENTITIES.length],
    ip: `${192 + (i % 4)}.168.${i % 10}.${10 + i % 100}`,
    details: DETAILS_MAP[action],
    status: i % 7 === 0 ? "Failed" : i % 5 === 0 ? "Warning" : "Success",
  };
});

// ── PRD 7.6 – Commission Snapshots (13 columns, immutable/read-only) ────────
const COMMISSION_SNAPSHOTS = Array.from({ length: 20 }, (_, i) => {
  const commPct = [5, 7.5, 10, 12, 15][i % 5];
  const amount = 4000 + i * 1750;
  const comm = Math.round(amount * commPct / 100);
  return {
    purchaseId: `PUR-${3000 + i}`,
    agentId: `AGT-${100 + (i % 8)}`,
    agentName: ["Rahul Verma", "Sunita Iyer", "Arjun Nair", "Priya Das", "Mohan Rao", "Ananya Pillai", "Kabir Mehta", "Zara Khan"][i % 8],
    agencyName: ["Seafarers Hub", "Marine Connect", "OceanPro", "BlueWave Pvt", "MaritimePlus"][i % 5],
    courseName: ["STCW Basic Safety", "Advanced Fire Fighting", "Ship Navigation & Radar", "Maritime Law", "Tanker Cargo Ops"][i % 5],
    courseId: `CRS-${500 + (i % 5)}`,
    amount: `₹${amount.toLocaleString("en-IN")}`,
    commPct: `${commPct}%`,
    commAmount: `₹${comm.toLocaleString("en-IN")}`,
    source: ["Direct", "Referral", "Agent", "Partner"][i % 4],
    purchaseDate: `2025-0${(i % 8) + 1}-${10 + (i % 18)}`,
    settledDate: i % 3 === 0 ? `2025-0${(i % 8) + 1}-${20 + (i % 10)}` : "—",
    status: i % 4 === 0 ? "Settled" : i % 3 === 0 ? "Processing" : "Pending",
  };
});

// ── PRD 7.7 – Financial Reports sub-tab data ───────────────────────────
const FIN_REVENUE_DATA = revenueData.map((d, i) => ({
  Month: d.month, "Revenue (₹)": `₹${d.revenue.toLocaleString("en-IN")}`,
  "Target (₹)": `₹${d.target.toLocaleString("en-IN")}`,
  Variance: d.revenue >= d.target ? `+₹${(d.revenue - d.target).toLocaleString("en-IN")}` : `-₹${(d.target - d.revenue).toLocaleString("en-IN")}`,
  Hit: d.revenue >= d.target ? "Yes" : "No",
}));
const FIN_PAYMENT_DATA = Array.from({ length: 12 }, (_, i) => ({
  "Txn ID": `TXN-${8000 + i}`, Company: `Company ${i + 1}`,
  "Amount (₹)": `₹${(5000 + i * 1200).toLocaleString("en-IN")}`,
  Method: ["UPI", "NEFT", "RTGS", "Card"][i % 4], Status: ["Paid", "Pending", "Failed"][i % 3],
  Date: `2025-07-${5 + i}`,
}));
const FIN_COMMISSION_DATA = Array.from({ length: 12 }, (_, i) => {
  const base = 3000 + i * 400;
  const pct = [5, 7.5, 10, 12][i % 4];
  return {
    Agent: ["Rahul Verma", "Sunita Iyer", "Arjun Nair", "Priya Das"][i % 4],
    "Base (₹)": `₹${base.toLocaleString("en-IN")}`, "Comm %": `${pct}%`,
    "Commission (₹)": `₹${Math.round(base * pct / 100).toLocaleString("en-IN")}`,
    Status: ["Pending", "Settled", "Processing"][i % 3], "Due Date": `2025-09-0${(i % 9) + 1}`,
  };
});
const FIN_INVOICE_DATA = Array.from({ length: 10 }, (_, i) => ({
  "Invoice #": `INV-${4000 + i}`, "Billed To": `Client ${i + 1}`,
  "Amount (₹)": `₹${(8500 + i * 950).toLocaleString("en-IN")}`,
  "Raised": `2025-06-${10 + i}`, "Due": `2025-07-${10 + i}`,
  Status: ["Settled", "Overdue", "Pending"][i % 3],
}));
const FIN_SETTLEMENT_DATA = Array.from({ length: 8 }, (_, i) => ({
  "Sett #": `SET-${200 + i}`, Company: `Company ${i + 1}`,
  "Amount (₹)": `₹${(12000 + i * 800).toLocaleString("en-IN")}`,
  "Settled On": `2025-08-0${i + 1}`, Method: i % 2 === 0 ? "NEFT" : "RTGS",
  Status: i % 3 === 0 ? "Processing" : "Settled",
}));
const FINANCIAL_SUBTABS = [
  { id: "revenue", label: "Revenue", Icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/15", headers: ["Month", "Revenue (₹)", "Target (₹)", "Variance", "Hit"], data: FIN_REVENUE_DATA },
  { id: "payments", label: "Payments", Icon: CreditCard, color: "text-sky-400", bg: "bg-sky-500/15", headers: ["Txn ID", "Company", "Amount (₹)", "Method", "Status", "Date"], data: FIN_PAYMENT_DATA },
  { id: "commissions", label: "Commissions", Icon: Landmark, color: "text-violet-400", bg: "bg-violet-500/15", headers: ["Agent", "Base (₹)", "Comm %", "Commission (₹)", "Status", "Due Date"], data: FIN_COMMISSION_DATA },
  { id: "invoices", label: "Invoices", Icon: FileText, color: "text-amber-400", bg: "bg-amber-500/15", headers: ["Invoice #", "Billed To", "Amount (₹)", "Raised", "Due", "Status"], data: FIN_INVOICE_DATA },
  { id: "settlements", label: "Settlements", Icon: IndianRupee, color: "text-rose-400", bg: "bg-rose-500/15", headers: ["Sett #", "Company", "Amount (₹)", "Settled On", "Method", "Status"], data: FIN_SETTLEMENT_DATA },
];
type FinRow = Record<string, string | number>;

// ── Sample data rows keyed by report id ───────────────────────────────────
type Row = Record<string, string | number>;
const REPORT_SAMPLE_DATA: Record<string, { headers: string[]; rows: Row[] }> = {
  reg: {
    headers: ["Name", "Role", "Email", "Registered On", "Status"],
    rows: Array.from({ length: 8 }, (_, i) => ({ Name: `User ${i + 1}`, Role: i % 2 === 0 ? "Seafarer" : "Admin", Email: `user${i + 1}@thalassic.in`, "Registered On": `2025-0${(i % 8) + 1}-01`, Status: "Active" }))
  },
  enroll: {
    headers: ["Seafarer", "Course", "Enrolled On", "Status", "Score"],
    rows: Array.from({ length: 10 }, (_, i) => ({ Seafarer: `Seafarer ${i + 1}`, Course: ["STCW Basic Safety", "Advanced Fire Fighting", "Maritime Law"][i % 3], "Enrolled On": `2025-0${(i % 8) + 1}-15`, Status: i % 3 === 0 ? "Completed" : "In Progress", Score: i % 3 === 0 ? `${70 + i * 2}%` : "-" }))
  },
  active: {
    headers: ["Month", "Active Users", "New Users", "Returning"],
    rows: MONTH_ORDER.slice(0, 8).map((m, i) => ({ Month: m, "Active Users": 200 + i * 15, "New Users": 30 + i * 5, Returning: 170 + i * 10 }))
  },
  cadmin: {
    headers: ["Admin", "Company", "Action", "Date", "IP"],
    rows: Array.from({ length: 8 }, (_, i) => ({ Admin: `Admin ${i + 1}`, Company: `Company ${i + 1}`, Action: ["Login", "Export", "Edit User"][i % 3], Date: `2025-07-${10 + i}`, IP: `192.168.1.${100 + i}` }))
  },
  aadmin: {
    headers: ["Agent Admin", "Agency", "Action", "Date", "IP"],
    rows: Array.from({ length: 7 }, (_, i) => ({ "Agent Admin": `Agent Admin ${i + 1}`, Agency: `Agency ${i + 1}`, Action: ["Login", "Refer", "View"][i % 3], Date: `2025-07-${10 + i}`, IP: `10.0.0.${i + 1}` }))
  },
  login: {
    headers: ["User", "Role", "Login At", "IP", "Status"],
    rows: Array.from({ length: 12 }, (_, i) => ({ User: `User ${i + 1}`, Role: ["Seafarer", "Admin", "Agent"][i % 3], "Login At": `2025-08-${1 + i} 09:${10 + i}`, IP: `192.168.${i}.1`, Status: i % 5 === 0 ? "Failed" : "Success" }))
  },
  audit: {
    headers: ["Actor", "Action", "Resource", "Timestamp", "Result"],
    rows: Array.from({ length: 10 }, (_, i) => ({ Actor: `Admin ${i + 1}`, Action: ["CREATE", "UPDATE", "DELETE", "VIEW"][i % 4], Resource: ["User", "Invoice", "Course", "Report"][i % 4], Timestamp: `2025-08-${1 + i} 10:${20 + i}`, Result: "OK" }))
  },
  revenue: {
    headers: ["Month", "Revenue (₹)", "Target (₹)", "Variance"],
    rows: revenueData.map(d => ({ Month: d.month, "Revenue (₹)": d.revenue, "Target (₹)": d.target, Variance: d.revenue - d.target }))
  },
  payment: {
    headers: ["Invoice #", "Company", "Amount (₹)", "Status", "Date"],
    rows: Array.from({ length: 10 }, (_, i) => ({ "Invoice #": `INV-${2000 + i}`, Company: `Company ${i + 1}`, "Amount (₹)": (5000 + i * 1200).toLocaleString(), Status: ["Paid", "Pending", "Failed"][i % 3], Date: `2025-07-${5 + i}` }))
  },
  invoice: {
    headers: ["Invoice #", "To", "Amount (₹)", "Raised", "Status"],
    rows: Array.from({ length: 8 }, (_, i) => ({ "Invoice #": `INV-${3000 + i}`, To: `Client ${i + 1}`, "Amount (₹)": (8000 + i * 900).toLocaleString(), Raised: `2025-06-${10 + i}`, Status: ["Settled", "Overdue", "Pending"][i % 3] }))
  },
  settle: {
    headers: ["Settlement #", "Company", "Amount (₹)", "Settled On", "Method"],
    rows: Array.from({ length: 6 }, (_, i) => ({ "Settlement #": `SET-${100 + i}`, Company: `Company ${i + 1}`, "Amount (₹)": (12000 + i * 500).toLocaleString(), "Settled On": `2025-08-0${i + 1}`, Method: i % 2 === 0 ? "NEFT" : "RTGS" }))
  },
  commout: {
    headers: ["Agent", "Referrals", "Commission (₹)", "Due Date", "Status"],
    rows: Array.from({ length: 6 }, (_, i) => ({ Agent: `Agent ${i + 1}`, Referrals: 3 + i, "Commission (₹)": (2000 + i * 300).toLocaleString(), "Due Date": `2025-09-0${i + 1}`, Status: ["Pending", "Overdue"][i % 2] }))
  },
  refperf: {
    headers: ["Month", "Leads", "Conversions", "Conv. Rate"],
    rows: referralData.map(d => ({ Month: d.month, Leads: d.leads, Conversions: d.conversions, "Conv. Rate": `${((d.conversions / d.leads) * 100).toFixed(1)}%` }))
  },
  agconv: {
    headers: ["Agent Admin", "Agency", "Leads", "Converted", "Rate"],
    rows: Array.from({ length: 6 }, (_, i) => ({ "Agent Admin": `Agent Admin ${i + 1}`, Agency: `Agency ${i + 1}`, Leads: 10 + i * 3, Converted: 5 + i * 2, Rate: `${Math.round(((5 + i * 2) / (10 + i * 3)) * 100)}%` }))
  },
  refsrc: {
    headers: ["Source", "Leads", "Converted", "Revenue (₹)"],
    rows: [["Website", 40, 28, 84000], ["Social Media", 22, 14, 42000], ["Word of Mouth", 18, 12, 36000], ["Email Campaign", 12, 8, 24000]].map(([s, l, c, r]) => ({ Source: s, Leads: l, Converted: c, "Revenue (₹)": r }))
  },
};

// ── Download utilities ─────────────────────────────────────────────────────
function triggerBlobDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 200);
}

function buildCSV(reportId: string, reportName: string, dateFrom: string, dateTo: string): string {
  const data = REPORT_SAMPLE_DATA[reportId];
  if (!data) return "";
  const meta = [
    [`Report: ${reportName}`],
    [`Period: ${dateFrom} to ${dateTo}`],
    [`Generated: ${new Date().toLocaleString("en-IN")}`],
    [],
  ];
  const header = [data.headers.join(",")];
  const rows = data.rows.map(r => data.headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","));
  return [...meta.map(r => r.join(",")), ...header, ...rows].join("\n");
}

function downloadAsCSV(reportId: string, reportName: string, dateFrom: string, dateTo: string) {
  const csv = buildCSV(reportId, reportName, dateFrom, dateTo);
  const filename = `${reportName.replace(/\s+/g, "_")}_${dateFrom}_${dateTo}.csv`;
  triggerBlobDownload(csv, filename, "text/csv;charset=utf-8;");
}

function downloadAsPDF(reportId: string, reportName: string, dateFrom: string, dateTo: string) {
  const data = REPORT_SAMPLE_DATA[reportId];
  if (!data) return;
  const rows = data.rows.map(r =>
    `<tr>${data.headers.map(h => `<td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px">${r[h] ?? ""}</td>`).join("")}</tr>`
  ).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${reportName}</title>
<style>body{font-family:sans-serif;padding:24px}h2{margin-bottom:4px}p{color:#64748b;font-size:13px;margin:2px 0}
table{border-collapse:collapse;width:100%;margin-top:16px}th{background:#6366f1;color:#fff;padding:8px 10px;font-size:12px;text-align:left}@media print{button{display:none}}</style>
</head><body>
<h2>${reportName}</h2>
<p>Period: ${dateFrom} to ${dateTo}</p>
<p>Generated: ${new Date().toLocaleString("en-IN")}</p>
<table><thead><tr>${data.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>
<script>window.onload=()=>window.print()<\/script></body></html>`;
  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

export default function ReportsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [activeCategory, setActiveCategory] = useState("operational");
  const [genState, setGenState] = useState<GenerateState>({});
  const [dlState, setDlState] = useState<DownloadState>({});
  const [schedModal, setSchedModal] = useState<ScheduleModal>({ open: false, reportId: "", reportName: "" });
  const [schedSaved, setSchedSaved] = useState(false);
  const [auditSearch, setAuditSearch] = useState("");
  const [commSearch, setCommSearch] = useState("");
  const [financialSubTab, setFinancialSubTab] = useState("revenue");

  // Draft filter state (controlled inputs)
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2025-08-31");
  const [userType, setUserType] = useState("All");
  const [course, setCourse] = useState("All");
  const [payStatus, setPayStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Applied filter state (only changes on "Apply Filters" click)
  const [applied, setApplied] = useState({ dateFrom: "2025-01-01", dateTo: "2025-08-31", userType: "All", course: "All", payStatus: "All" });
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyFilters = () => {
    setIsApplying(true);
    setTimeout(() => {
      setApplied({ dateFrom, dateTo, userType, course, payStatus });
      setIsApplying(false);
    }, 800);
  };

  const handleResetFilters = () => {
    const defaults = { dateFrom: "2025-01-01", dateTo: "2025-08-31", userType: "All", course: "All", payStatus: "All" };
    setDateFrom(defaults.dateFrom); setDateTo(defaults.dateTo);
    setUserType(defaults.userType); setCourse(defaults.course); setPayStatus(defaults.payStatus);
    setApplied(defaults);
  };

  // theme tokens
  const bg = dk ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200 shadow-sm";
  const ht = dk ? "text-white/80" : "text-slate-800";
  const mt = dk ? "text-white/35" : "text-slate-400";
  const grid = dk ? "#1e3a5f" : "#f1f5f9";
  const axis = dk ? "#4a6d8c" : "#94a3b8";
  const divider = dk ? "divide-white/5" : "divide-slate-100";
  const border = dk ? "border-white/5" : "border-slate-100";
  const inputBg = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 outline-none" : "bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none";
  const modalBg = dk ? "bg-[#0d1f35] border border-white/10" : "bg-white border border-slate-200";

  const handleGenerate = (reportId: string, reportName: string) => {
    setGenState(s => ({ ...s, [reportId]: "generating" }));
    setTimeout(() => {
      setGenState(s => ({ ...s, [reportId]: "done" }));
      downloadAsCSV(reportId, reportName, applied.dateFrom, applied.dateTo);
    }, 1500);
    setTimeout(() => setGenState(s => ({ ...s, [reportId]: "idle" })), 4000);
  };

  const handleDownloadCSV = (reportId: string, reportName: string) => {
    setDlState(s => ({ ...s, [`${reportId}_csv`]: "downloading" }));
    setTimeout(() => {
      downloadAsCSV(reportId, reportName, applied.dateFrom, applied.dateTo);
      setDlState(s => ({ ...s, [`${reportId}_csv`]: "idle" }));
    }, 400);
  };

  const handleDownloadPDF = (reportId: string, reportName: string) => {
    setDlState(s => ({ ...s, [`${reportId}_pdf`]: "downloading" }));
    setTimeout(() => {
      downloadAsPDF(reportId, reportName, applied.dateFrom, applied.dateTo);
      setDlState(s => ({ ...s, [`${reportId}_pdf`]: "idle" }));
    }, 400);
  };

  const openSchedule = (reportId: string, reportName: string) => {
    setSchedModal({ open: true, reportId, reportName });
    setSchedSaved(false);
  };

  const currentCat = REPORT_CATEGORIES.find(c => c.id === activeCategory) ?? REPORT_CATEGORIES[0];

  // ── Filter derivations ──────────────────────────────────────────────────
  // Date range → months
  const fromMonth = new Date(applied.dateFrom).toLocaleString("en", { month: "short" });
  const toMonth = new Date(applied.dateTo).toLocaleString("en", { month: "short" });
  const fromIdx = MONTH_ORDER.indexOf(fromMonth);
  const toIdx = MONTH_ORDER.indexOf(toMonth);
  const inDateRange = (m: string) => {
    const i = MONTH_ORDER.indexOf(m);
    return i >= (fromIdx === -1 ? 0 : fromIdx) && i <= (toIdx === -1 ? 11 : toIdx);
  };

  const filteredRevenueData = revenueData.filter(d => inDateRange(d.month));
  const filteredEnrollData = enrollData.filter(d => inDateRange(d.month));
  const filteredReferralData = referralData.filter(d => inDateRange(d.month));

  // Report list filter
  const filteredReports = (currentCat?.reports ?? []).filter(rep => {
    if (applied.userType !== "All" && !(REPORT_USER_RELEVANCE[applied.userType] ?? []).includes(rep.id)) return false;
    if (applied.course !== "All" && !(REPORT_COURSE_RELEVANCE[applied.course] ?? []).includes(rep.id)) return false;
    if (applied.payStatus !== "All" && !(REPORT_PAYMENT_RELEVANCE[applied.payStatus] ?? []).includes(rep.id)) return false;
    return true;
  });

  // Active filter badge count
  const activeFilterCount = [applied.userType, applied.course, applied.payStatus].filter(v => v !== "All").length
    + (applied.dateFrom !== "2025-01-01" || applied.dateTo !== "2025-08-31" ? 1 : 0);

  // Summary KPIs
  const kpis = [
    { label: "Reports Generated", value: "1,248", delta: "+14%", up: true, Icon: FileText, color: dk ? "text-indigo-400" : "text-indigo-500", ibg: dk ? "bg-indigo-500/15" : "bg-indigo-50" },
    { label: "Total Revenue", value: "₹24.5L", delta: "+15%", up: true, Icon: TrendingUp, color: dk ? "text-emerald-400" : "text-emerald-500", ibg: dk ? "bg-emerald-500/15" : "bg-emerald-50" },
    { label: "New Registrations", value: "840", delta: "+22%", up: true, Icon: Users, color: dk ? "text-sky-400" : "text-sky-500", ibg: dk ? "bg-sky-500/15" : "bg-sky-50" },
    { label: "Referral Leads", value: "128", delta: "+8%", up: true, Icon: GitMerge, color: dk ? "text-amber-400" : "text-amber-500", ibg: dk ? "bg-amber-500/15" : "bg-amber-50" },
  ];

  return (
    <div className="space-y-5">

      {/*  Schedule Modal ─ */}
      {schedModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSchedModal(s => ({ ...s, open: false }))}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center"><Calendar className="w-4 h-4 text-indigo-400" /></div>
                <div><p className={`text-sm font-semibold ${ht}`}>Schedule Report</p>
                  <p className={`text-xs ${mt} max-w-[200px] truncate`}>{schedModal.reportName}</p></div>
              </div>
              <button onClick={() => setSchedModal(s => ({ ...s, open: false }))} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Frequency</label>
                <select className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                  <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Delivery Email</label>
                <input placeholder="admin@thalassic.in" className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Format</label>
                <div className="flex gap-2">
                  {["PDF", "Excel"].map(f => (
                    <button key={f} className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={() => setSchedModal(s => ({ ...s, open: false }))} className={`px-4 py-2 text-sm font-medium rounded-xl border ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={() => { setSchedSaved(true); setTimeout(() => setSchedModal(s => ({ ...s, open: false })), 1200); }}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${schedSaved ? "bg-emerald-500 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}>
                {schedSaved ? <><Check className="w-4 h-4" /> Scheduled!</> : <><Calendar className="w-4 h-4" /> Schedule</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Header ─ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Reports & Analytics</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Platform-wide operational, financial & administrative reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(s => !s)}
            className={`relative flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Filter className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-indigo-500 text-white">{activeFilterCount}</span>
            )}
          </button>
          <button onClick={handleResetFilters} className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/*  Filter Bar  */}
      {showFilters && (
        <div className={`${bg} rounded-2xl p-5`}>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/50" : "text-slate-500"}`}>Date From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`} />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/50" : "text-slate-500"}`}>Date To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`} />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/50" : "text-slate-500"}`}>User Type</label>
              <select value={userType} onChange={e => setUserType(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                {USER_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/50" : "text-slate-500"}`}>Course</label>
              <select value={course} onChange={e => setCourse(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/50" : "text-slate-500"}`}>Payment Status</label>
              <select value={payStatus} onChange={e => setPayStatus(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                {STATUS_FILTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button
              onClick={handleApplyFilters}
              disabled={isApplying}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isApplying
                ? "bg-indigo-400 cursor-wait text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}>
              {isApplying
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Applying…</>
                : <><Check className="w-3.5 h-3.5" /> Apply Filters</>}
            </button>
          </div>
        </div>
      )}

      {/*  Summary KPIs ─ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => {
          const D = k.up ? TrendingUp : TrendingDown;
          return (
            <div key={k.label} className={`${bg} rounded-xl px-5 py-4`}>
              <div className={`w-9 h-9 rounded-lg ${k.ibg} flex items-center justify-center mb-3`}>
                <k.Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-xl font-bold ${ht}`}>{k.value}</p>
              <p className={`text-xs mt-0.5 ${mt}`}>{k.label}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${k.up ? "text-emerald-500" : "text-red-400"}`}>
                <D className="w-3 h-3" />{k.delta} vs last year
              </div>
            </div>
          );
        })}
      </div>

      {/*  Category Tabs + Reports ─ */}
      <div className={`${bg} rounded-2xl overflow-hidden`}>
        {/* Tabs */}
        <div className={`flex overflow-x-auto border-b ${border} px-4 pt-4 gap-0.5`}>
          {REPORT_CATEGORIES.map(cat => {
            const CatIcon = cat.Icon;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl mr-1 transition-colors border-b-2 -mb-px whitespace-nowrap ${activeCategory === cat.id ? `border-indigo-500 ${ht}` : `border-transparent ${mt} hover:${ht}`
                  }`}>
                <CatIcon className={`w-4 h-4 ${activeCategory === cat.id ? cat.color : ""}`} />
                {cat.label}
              </button>
            );
          })}
          {/* PRD 7.7 – Financial Reports tab */}
          <button onClick={() => setActiveCategory("financial-reports")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl mr-1 transition-colors border-b-2 -mb-px whitespace-nowrap ${activeCategory === "financial-reports" ? `border-emerald-500 ${ht}` : `border-transparent ${mt} hover:${ht}`
              }`}>
            <IndianRupee className={`w-4 h-4 ${activeCategory === "financial-reports" ? "text-emerald-400" : ""}`} />
            Financial Reports
          </button>
          {/* PRD 7.6 – Commission Snapshots tab */}
          <button onClick={() => setActiveCategory("commission-snapshots")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl mr-1 transition-colors border-b-2 -mb-px whitespace-nowrap ${activeCategory === "commission-snapshots" ? `border-violet-500 ${ht}` : `border-transparent ${mt} hover:${ht}`
              }`}>
            <Wallet className={`w-4 h-4 ${activeCategory === "commission-snapshots" ? "text-violet-400" : ""}`} />
            Commission Snapshots
          </button>
          {/* PRD 7.8 – Audit Logs tab */}
          <button onClick={() => setActiveCategory("audit-logs")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl mr-1 transition-colors border-b-2 -mb-px whitespace-nowrap ${activeCategory === "audit-logs" ? `border-rose-500 ${ht}` : `border-transparent ${mt} hover:${ht}`
              }`}>
            <ClipboardList className={`w-4 h-4 ${activeCategory === "audit-logs" ? "text-rose-400" : ""}`} />
            Audit Logs
          </button>
        </div>

        {/* Content: Audit Logs table OR report list */}
        {/* ─── PRD 7.7 Financial Reports ─── */}
        {activeCategory === "financial-reports" ? (
          <div>
            {/* Sub-tabs */}
            <div className={`flex gap-1 px-5 pt-4 border-b ${border} overflow-x-auto`}>
              {FINANCIAL_SUBTABS.map(st => (
                <button key={st.id} onClick={() => setFinancialSubTab(st.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg border-b-2 -mb-px whitespace-nowrap transition-colors ${financialSubTab === st.id ? `border-indigo-500 ${ht}` : `border-transparent ${mt} hover:${ht}`
                    }`}>
                  <st.Icon className={`w-3.5 h-3.5 ${financialSubTab === st.id ? st.color : ""}`} />
                  {st.label}
                </button>
              ))}
            </div>
            {/* Sub-tab content */}
            {(() => {
              const st = FINANCIAL_SUBTABS.find(s => s.id === financialSubTab) ?? FINANCIAL_SUBTABS[0];
              return (
                <div>
                  {/* Header row with download buttons */}
                  <div className={`flex items-center justify-between px-6 py-3 border-b ${border}`}>
                    <p className={`text-xs font-semibold ${mt}`}>{st.data.length} records</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        const csv = [
                          `Report: ${st.label} Report`,
                          `Generated: ${new Date().toLocaleString("en-IN")}`,
                          "",
                          st.headers.join(","),
                          ...(st.data as FinRow[]).map(r => st.headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
                        ].join("\n");
                        triggerBlobDownload(csv, `${st.label}_Report.csv`, "text/csv;charset=utf-8;");
                      }} className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}><FileSpreadsheet className="w-3 h-3" /> CSV</button>
                      <button onClick={() => {
                        const rows = (st.data as FinRow[]).map(r =>
                          `<tr>${st.headers.map(h => `<td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px">${r[h] ?? ""}</td>`).join("")}</tr>`
                        ).join("");
                        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${st.label} Report</title>
<style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%;margin-top:16px}th{background:#10b981;color:#fff;padding:8px 10px;font-size:12px;text-align:left}@media print{button{display:none}}</style>
</head><body><h2>${st.label} Report</h2><p>Generated: ${new Date().toLocaleString("en-IN")}</p>
<table><thead><tr>${st.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>
<script>window.onload=()=>window.print()<\/script></body></html>`;
                        const win = window.open("", "_blank");
                        if (win) { win.document.write(html); win.document.close(); }
                      }} className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}><Printer className="w-3 h-3" /> PDF</button>
                    </div>
                  </div>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`text-left text-[11px] font-semibold uppercase tracking-wide ${dk ? "bg-white/[0.03] text-white/40" : "bg-slate-50 text-slate-400"
                          }`}>
                          {st.headers.map(h => <th key={h} className="px-5 py-3 whitespace-nowrap">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${divider}`}>
                        {(st.data as FinRow[]).map((row, idx) => (
                          <tr key={idx} className={`transition-colors ${dk ? "hover:bg-white/[0.025]" : "hover:bg-slate-50/70"}`}>
                            {st.headers.map(h => {
                              const v = String(row[h] ?? "");
                              const isStatus = h === "Status" || h === "Hit";
                              const isAmt = v.startsWith("₹") || v.startsWith("+₹") || v.startsWith("-₹");
                              return (
                                <td key={h} className="px-5 py-3 whitespace-nowrap">
                                  {isStatus ? (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === "Settled" || v === "Paid" || v === "Yes" ? (dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600") :
                                        v === "Overdue" || v === "Failed" || v === "No" ? (dk ? "bg-rose-500/15 text-rose-400" : "bg-rose-50 text-rose-600") :
                                          (dk ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-600")
                                      }`}>{v}</span>
                                  ) : isAmt ? (
                                    <span className={`text-[13px] font-semibold font-mono ${v.startsWith("+") ? "text-emerald-500" : v.startsWith("-") ? "text-rose-400" : ht
                                      }`}>{v}</span>
                                  ) : (
                                    <span className={`text-[12px] ${ht}`}>{v}</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>

        ) : activeCategory === "commission-snapshots" ? (
          <div>
            <div className={`flex items-center justify-between px-6 py-3 border-b ${border}`}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${ht}`}>Commission Snapshots</p>
                  <p className={`text-xs ${mt}`}>Immutable, read-only ledger — {COMMISSION_SNAPSHOTS.length} records</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg ${dk ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-violet-50 text-violet-600 border border-violet-200"
                  }`}>
                  <ShieldCheck className="w-3 h-3" /> Read-Only
                </div>
                <button onClick={() => {
                  const headers = ["Purchase ID", "Agent ID", "Agent Name", "Agency", "Course", "Course ID", "Amount", "Comm %", "Commission", "Source", "Purchase Date", "Settled Date", "Status"];
                  const csv = [
                    "Report: Commission Snapshots",
                    `Generated: ${new Date().toLocaleString("en-IN")}`,
                    "",
                    headers.join(","),
                    ...COMMISSION_SNAPSHOTS.map(r =>
                      [r.purchaseId, r.agentId, r.agentName, r.agencyName, r.courseName, r.courseId, r.amount, r.commPct, r.commAmount, r.source, r.purchaseDate, r.settledDate, r.status]
                        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
                    ),
                  ].join("\n");
                  triggerBlobDownload(csv, "Commission_Snapshots.csv", "text/csv;charset=utf-8;");
                }} className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}><Download className="w-3 h-3" /> Export CSV</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-left text-[11px] font-semibold uppercase tracking-wide ${dk ? "bg-white/[0.03] text-white/40" : "bg-slate-50 text-slate-400"
                    }`}>
                    {["Purchase ID", "Agent ID", "Agent Name", "Agency", "Course Name", "Course ID", "Amount", "Comm %", "Commission", "Source", "Purchase Date", "Settled Date", "Status"].map(h => (
                      <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${divider}`}>
                  {COMMISSION_SNAPSHOTS.map(row => (
                    <tr key={row.purchaseId} className={`transition-colors ${dk ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60"}`}>
                      <td className={`px-4 py-3 text-[12px] font-mono font-semibold ${ht}`}>{row.purchaseId}</td>
                      <td className={`px-4 py-3 text-[12px] font-mono ${mt}`}>{row.agentId}</td>
                      <td className={`px-4 py-3 text-[13px] font-semibold ${ht} whitespace-nowrap`}>{row.agentName}</td>
                      <td className={`px-4 py-3 text-[12px] ${mt} whitespace-nowrap`}>{row.agencyName}</td>
                      <td className={`px-4 py-3 text-[12px] ${ht} whitespace-nowrap`}>{row.courseName}</td>
                      <td className={`px-4 py-3 text-[12px] font-mono ${mt}`}>{row.courseId}</td>
                      <td className={`px-4 py-3 text-[13px] font-semibold font-mono ${ht}`}>{row.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${dk ? "bg-violet-500/15 text-violet-400" : "bg-violet-50 text-violet-600"
                          }`}>{row.commPct}</span>
                      </td>
                      <td className={`px-4 py-3 text-[13px] font-semibold font-mono text-emerald-500`}>{row.commAmount}</td>
                      <td className={`px-4 py-3 text-[12px] ${mt}`}>{row.source}</td>
                      <td className={`px-4 py-3 text-[12px] ${mt} whitespace-nowrap`}>{row.purchaseDate}</td>
                      <td className={`px-4 py-3 text-[12px] ${mt} whitespace-nowrap`}>{row.settledDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${row.status === "Settled" ? (dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600") :
                            row.status === "Processing" ? (dk ? "bg-sky-500/15 text-sky-400" : "bg-sky-50 text-sky-600") :
                              (dk ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-600")
                          }`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        ) : activeCategory === "audit-logs" ? (
          <div>
            {/* Search bar */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${border}`}>
              <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-xl text-sm ${dk ? "bg-white/5 border border-white/8" : "bg-slate-50 border border-slate-200"
                }`}>
                <Search className={`w-4 h-4 shrink-0 ${mt}`} />
                <input
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  placeholder="Search by user, action, entity, IP, status…"
                  className={`flex-1 bg-transparent outline-none text-sm ${dk ? "text-white placeholder:text-white/25" : "text-slate-700 placeholder:text-slate-400"
                    }`}
                />
                {auditSearch && (
                  <button onClick={() => setAuditSearch("")} className={`shrink-0 ${mt} hover:text-rose-400`}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className={`text-xs font-medium shrink-0 ${mt}`}>
                {AUDIT_LOGS.filter(r =>
                  Object.values(r).some(v => String(v).toLowerCase().includes(auditSearch.toLowerCase()))
                ).length} rows
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-left text-[11px] font-semibold uppercase tracking-wide ${dk ? "bg-white/[0.03] text-white/40" : "bg-slate-50 text-slate-400"
                    }`}>
                    {["Timestamp", "User", "Action", "Entity ID", "IP Address", "Details", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${divider}`}>
                  {(() => {
                    const q = auditSearch.toLowerCase();
                    const rows = AUDIT_LOGS.filter(r =>
                      !q || Object.values(r).some(v => String(v).toLowerCase().includes(q))
                    );
                    if (rows.length === 0) return (
                      <tr><td colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                          <Search className={`w-8 h-8 ${mt} opacity-40`} />
                          <p className={`text-sm font-semibold ${ht}`}>No matching audit logs</p>
                          <p className={`text-xs ${mt}`}>Try a different search term</p>
                        </div>
                      </td></tr>
                    );
                    return rows.map(row => (
                      <tr key={row.id} className={`transition-colors ${dk ? "hover:bg-white/[0.025]" : "hover:bg-slate-50/70"
                        }`}>
                        <td className={`px-5 py-3 text-[12px] whitespace-nowrap ${mt}`}>{row.timestamp}</td>
                        <td className="px-5 py-3">
                          <p className={`text-[13px] font-semibold ${ht} whitespace-nowrap`}>{row.user}</p>
                          <p className={`text-[11px] ${mt}`}>{row.role}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${row.action === "DELETE" ? (dk ? "bg-rose-500/15 text-rose-400" : "bg-rose-50 text-rose-600") :
                            row.action === "CREATE" ? (dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600") :
                              row.action === "LOGIN" || row.action === "LOGOUT" ? (dk ? "bg-sky-500/15 text-sky-400" : "bg-sky-50 text-sky-600") :
                                row.action === "APPROVE" ? (dk ? "bg-violet-500/15 text-violet-400" : "bg-violet-50 text-violet-600") :
                                  row.action === "REJECT" ? (dk ? "bg-orange-500/15 text-orange-400" : "bg-orange-50 text-orange-600") :
                                    (dk ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-500")
                            }`}>{row.action}</span>
                        </td>
                        <td className="px-5 py-3">
                          <p className={`text-[12px] font-mono font-semibold ${ht}`}>{row.entityId}</p>
                          <p className={`text-[11px] ${mt}`}>{row.entity}</p>
                        </td>
                        <td className={`px-5 py-3 text-[12px] font-mono whitespace-nowrap ${mt}`}>{row.ip}</td>
                        <td className={`px-5 py-3 text-[12px] max-w-[200px] truncate ${mt}`} title={row.details}>{row.details}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${row.status === "Success" ? (dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600") :
                            row.status === "Failed" ? (dk ? "bg-rose-500/15 text-rose-400" : "bg-rose-50 text-rose-600") :
                              (dk ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-600")
                            }`}>
                            <ShieldCheck className="w-3 h-3" />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Report list */
          <div className={`divide-y ${divider}`}>
            {filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dk ? "bg-white/5" : "bg-slate-100"}`}>
                  <FileText className={`w-6 h-6 ${mt}`} />
                </div>
                <p className={`text-sm font-semibold ${ht}`}>No reports found</p>
                <p className={`text-xs ${mt} text-center max-w-xs`}>No reports match the selected filter criteria. Try adjusting the filters or&nbsp;
                  <button onClick={handleResetFilters} className="text-indigo-400 hover:underline font-medium">reset to defaults</button>.
                </p>
              </div>
            ) : (
              filteredReports.map(rep => {
                const state = genState[rep.id] ?? "idle";
                return (
                  <div key={rep.id} className={`flex items-center gap-4 px-6 py-4 ${dk ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/70"} transition-colors`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentCat.bg}`}>
                      <FileText className={`w-5 h-5 ${currentCat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-semibold ${ht}`}>{rep.name}</p>
                      <p className={`text-[12px] mt-0.5 ${mt}`}>{rep.desc}</p>
                      <p className={`text-[11px] mt-1 ${mt} opacity-70`}>
                        {rep.rows.toLocaleString()} records · {applied.dateFrom} – {applied.dateTo}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Generate + CSV download */}
                      <button onClick={() => handleGenerate(rep.id, rep.name)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${state === "generating" ? "bg-indigo-500/20 text-indigo-400 cursor-wait" :
                          state === "done" ? "bg-emerald-500 text-white" :
                            "bg-indigo-500 hover:bg-indigo-600 text-white"
                          }`}>
                        {state === "generating" && <RefreshCw className="w-3 h-3 animate-spin" />}
                        {state === "done" && <Download className="w-3 h-3" />}
                        {state === "idle" && <BarChart3 className="w-3 h-3" />}
                        {state === "generating" ? "Generating…" : state === "done" ? "Downloading" : "Generate"}
                      </button>
                      {/* Export PDF */}
                      <button
                        onClick={() => handleDownloadPDF(rep.id, rep.name)}
                        disabled={dlState[`${rep.id}_pdf`] === "downloading"}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dlState[`${rep.id}_pdf`] === "downloading"
                          ? "border-rose-400/40 text-rose-400 cursor-wait"
                          : dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}>
                        {dlState[`${rep.id}_pdf`] === "downloading"
                          ? <><RefreshCw className="w-3 h-3 animate-spin" /> PDF…</>
                          : <><Printer className="w-3 h-3" /> PDF</>}
                      </button>
                      {/* Export Excel / CSV */}
                      <button
                        onClick={() => handleDownloadCSV(rep.id, rep.name)}
                        disabled={dlState[`${rep.id}_csv`] === "downloading"}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dlState[`${rep.id}_csv`] === "downloading"
                          ? "border-emerald-400/40 text-emerald-400 cursor-wait"
                          : dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}>
                        {dlState[`${rep.id}_csv`] === "downloading"
                          ? <><RefreshCw className="w-3 h-3 animate-spin" /> CSV…</>
                          : <><FileSpreadsheet className="w-3 h-3" /> Excel</>}
                      </button>
                      {/* Schedule */}
                      <button onClick={() => openSchedule(rep.id, rep.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                        <Calendar className="w-3 h-3" /> Schedule
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/*  Charts  */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Revenue vs Target */}
        <div className={`${bg} rounded-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${ht}`}>Revenue vs Target</p>
            <button className={`flex items-center gap-1 text-xs font-medium ${dk ? "text-indigo-400" : "text-indigo-600"}`}>Full report <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={filteredRevenueData.length ? filteredRevenueData : revenueData}>
                <defs>
                  <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} width={46} tickFormatter={(v: number) => `${v / 1000}K`} />
                <Tooltip formatter={(v: any) => `₹${(Number(v || 0) / 1000).toFixed(0)}K`} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rG)" />
                <Area type="monotone" dataKey="target" name="Target" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollments vs Completions */}
        <div className={`${bg} rounded-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${ht}`}>Enrollments vs Completions</p>
            <button className={`flex items-center gap-1 text-xs font-medium ${dk ? "text-indigo-400" : "text-indigo-600"}`}>Full report <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={filteredEnrollData.length ? filteredEnrollData : enrollData} barSize={12} barGap={4}>
                <CartesianGrid vertical={false} stroke={grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="enroll" name="Enrollments" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="complete" name="Completions" fill="#34d399" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Referral Performance */}
        <div className={`${bg} rounded-2xl overflow-hidden xl:col-span-2`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${ht}`}>Referral Performance — Leads vs Conversions</p>
            <button className={`flex items-center gap-1 text-xs font-medium ${dk ? "text-indigo-400" : "text-indigo-600"}`}>Full report <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={filteredReferralData.length ? filteredReferralData : referralData} barSize={14} barGap={4}>
                <CartesianGrid vertical={false} stroke={grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="leads" name="Leads" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
