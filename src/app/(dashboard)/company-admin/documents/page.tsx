"use client";
import toast from 'react-hot-toast';

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import { mockSeafarers, SeafarerDocument, Seafarer } from "@/components/company-admin/mockData";
import StatusBadge from "@/components/company-admin/StatusBadge";
import {
  FileText,
  Search,
  Check,
  X,
  Eye,
  Download,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  User,
  ChevronRight,
  ChevronLeft,
  History,
  IndianRupee,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";

export interface DocumentPurchaseRecord {
  id: string;
  orderId: string;
  documentName: string;
  documentType: string;
  seafarerName: string;
  seafarerRank: string;
  instituteName: string;
  amount: number;
  purchaseDate: string; // DD/MM/YY
  status: "Completed" | "Processing" | "Pending";
  invoiceNumber: string;
}

const mockDocumentPurchases: DocumentPurchaseRecord[] = [
  {
    id: "dp-1",
    orderId: "DOC-ORD-2026-001",
    documentName: "STCW Basic Safety Training Certificate Package",
    documentType: "STCW Training Kit",
    seafarerName: "Capt. Rajesh Kumar",
    seafarerRank: "Master",
    instituteName: "Hari Om Thalassic Maritime Training Institute",
    amount: 5000,
    purchaseDate: "20/08/26",
    status: "Completed",
    invoiceNumber: "INV-2026-089",
  },
  {
    id: "dp-2",
    orderId: "DOC-ORD-2026-002",
    documentName: "Chief Engineer CoC Renewal & Endorsement Verification",
    documentType: "CoC Endorsement",
    seafarerName: "Amit Patel",
    seafarerRank: "Chief Engineer",
    instituteName: "Apex Marine Training",
    amount: 7200,
    purchaseDate: "19/08/26",
    status: "Completed",
    invoiceNumber: "INV-2026-088",
  },
  {
    id: "dp-3",
    orderId: "DOC-ORD-2026-003",
    documentName: "GMDSS General Operator Certificate Issuance",
    documentType: "GMDSS Certification",
    seafarerName: "Vikram Singh",
    seafarerRank: "Chief Officer",
    instituteName: "Hari Om Thalassic Maritime Training Institute",
    amount: 7200,
    purchaseDate: "17/08/26",
    status: "Completed",
    invoiceNumber: "INV-2026-087",
  },
  {
    id: "dp-4",
    orderId: "DOC-ORD-2026-004",
    documentName: "Medical Fitness ENG1 Verification & Expedited Seal",
    documentType: "Medical Assessment",
    seafarerName: "Sandeep Nair",
    seafarerRank: "Second Engineer",
    instituteName: "Global Seafarers Academy",
    amount: 4500,
    purchaseDate: "15/08/26",
    status: "Processing",
    invoiceNumber: "INV-2026-086",
  },
  {
    id: "dp-5",
    orderId: "DOC-ORD-2026-005",
    documentName: "Advanced Fire Fighting (AFF) DG Shipping Certificate",
    documentType: "STCW Advanced",
    seafarerName: "Neha Sharma",
    seafarerRank: "Safety Officer",
    instituteName: "Global Seafarers Academy",
    amount: 4500,
    purchaseDate: "14/08/26",
    status: "Completed",
    invoiceNumber: "INV-2026-085",
  },
  {
    id: "dp-6",
    orderId: "DOC-ORD-2026-006",
    documentName: "Tanker Endorsement (DCE) Specialization Document Pack",
    documentType: "Dangerous Cargo Endorsement",
    seafarerName: "Capt. Rajesh Kumar",
    seafarerRank: "Master",
    instituteName: "Hari Om Thalassic Maritime Training Institute",
    amount: 9400,
    purchaseDate: "11/08/26",
    status: "Completed",
    invoiceNumber: "INV-2026-084",
  },
  {
    id: "dp-7",
    orderId: "DOC-ORD-2026-007",
    documentName: "Continuous Discharge Certificate (CDC) Fast-track Renewal",
    documentType: "CDC Application",
    seafarerName: "Amit Patel",
    seafarerRank: "Chief Engineer",
    instituteName: "Hari Om Thalassic Maritime Training Institute",
    amount: 3200,
    purchaseDate: "08/08/26",
    status: "Completed",
    invoiceNumber: "INV-2026-083",
  },
  {
    id: "dp-8",
    orderId: "DOC-ORD-2026-008",
    documentName: "Bridge Resource Management (BRM) Module Certification",
    documentType: "Bridge Resource Management",
    seafarerName: "Vikram Singh",
    seafarerRank: "Chief Officer",
    instituteName: "Oceanic Maritime Center",
    amount: 5000,
    purchaseDate: "05/08/26",
    status: "Pending",
    invoiceNumber: "INV-2026-082",
  },
];

export default function DocumentVerificationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Active top tab: "verification" | "purchase-history" — Req #6
  const [activeTab, setActiveTab] = useState<"verification" | "purchase-history">("verification");

  // State containing all seafarers and their documents
  const [seafarers, setSeafarers] = useState<Seafarer[]>(mockSeafarers);
  
  // Selected seafarer to view documents
  const [selectedSeafarerId, setSelectedSeafarerId] = useState<string | null>(seafarers[0]?.id || null);

  // Search input query for seafarers
  const [searchQuery, setSearchQuery] = useState("");

  // Rejection Dialog states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Preview Dialog states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<SeafarerDocument | null>(null);

  // Simulated verification action loader
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);

  // Purchase History State
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState("All");
  const [purchasePage, setPurchasePage] = useState(1);
  const purchasesPerPage = 6;

  const selectedSeafarer = seafarers.find(s => s.id === selectedSeafarerId);

  // Filtered seafarers based on search
  const filteredSeafarers = useMemo(() => {
    return seafarers.filter((sf) =>
      sf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sf.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sf.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [seafarers, searchQuery]);

  // Overall Stats for Verification
  const docStats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let expired = 0;

    seafarers.forEach(sf => {
      sf.documents.forEach(doc => {
        if (doc.status === "Pending") pending++;
        if (doc.status === "Approved") approved++;
        if (doc.status === "Rejected") rejected++;
        if (doc.status === "Expired") expired++;
      });
    });

    const total = pending + approved + rejected + expired;
    return { total, pending, approved, rejected, expired };
  }, [seafarers]);

  // Purchase History Filtered Data
  const filteredPurchases = useMemo(() => {
    return mockDocumentPurchases.filter((p) => {
      const matchSearch =
        p.documentName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
        p.seafarerName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
        p.instituteName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
        p.orderId.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
        p.invoiceNumber.toLowerCase().includes(purchaseSearch.toLowerCase());
      const matchStatus = purchaseStatusFilter === "All" || p.status === purchaseStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [purchaseSearch, purchaseStatusFilter]);

  const totalPurchasePages = Math.ceil(filteredPurchases.length / purchasesPerPage);
  const paginatedPurchases = filteredPurchases.slice(
    (purchasePage - 1) * purchasesPerPage,
    purchasePage * purchasesPerPage
  );

  const purchaseStats = useMemo(() => {
    const totalSpent = mockDocumentPurchases.reduce((s, p) => s + p.amount, 0);
    const completed = mockDocumentPurchases.filter(p => p.status === "Completed").length;
    const processing = mockDocumentPurchases.filter(p => p.status === "Processing").length;
    const pending = mockDocumentPurchases.filter(p => p.status === "Pending").length;
    return { total: mockDocumentPurchases.length, totalSpent, completed, processing, pending };
  }, []);

  // Approve Handler
  const handleApprove = (docId: string) => {
    setVerifyingDocId(docId);
    setTimeout(() => {
      setSeafarers(prev => prev.map(sf => {
        if (sf.id === selectedSeafarerId) {
          return {
            ...sf,
            documents: sf.documents.map(d => d.id === docId ? { ...d, status: "Approved", rejectionReason: undefined } : d)
          };
        }
        return sf;
      }));
      setVerifyingDocId(null);
    }, 450);
  };

  // Reject dialog opener
  const openRejectDialog = (docId: string) => {
    setRejectingDocId(docId);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  // Reject Submit Handler
  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection justification.");
      return;
    }

    const targetId = rejectingDocId;
    setShowRejectModal(false);
    setVerifyingDocId(targetId);

    setTimeout(() => {
      setSeafarers(prev => prev.map(sf => {
        if (sf.id === selectedSeafarerId) {
          return {
            ...sf,
            documents: sf.documents.map(d => d.id === targetId ? { ...d, status: "Rejected", rejectionReason } : d)
          };
        }
        return sf;
      }));
      setVerifyingDocId(null);
    }, 450);
  };

  // Preview Handler
  const handlePreview = (doc: SeafarerDocument) => {
    setPreviewingDoc(doc);
    setShowPreviewModal(true);
  };

  // Download Handler
  const handleDownload = (docName: string) => {
    toast(`Mock Download: Starting download for file "${docName}" (UI Only)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
            Document Management
          </h1>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            View, verify seafarer documents, and manage certification purchase history.
          </p>
        </div>

        {/* Top Tabs Switcher — Req #6 */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 shrink-0 ${
          isDark ? "bg-[#0c1a2e] border-white/5" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            onClick={() => setActiveTab("verification")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "verification"
                ? "bg-sky-500 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Document Verification</span>
          </button>
          <button
            onClick={() => setActiveTab("purchase-history")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "purchase-history"
                ? "bg-sky-500 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Document Purchase History</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: DOCUMENT VERIFICATION ────────────────────────────────────────── */}
      {activeTab === "verification" && (
        <>
          {/* Summary stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Total Uploads", val: docStats.total, color: isDark ? "text-white" : "text-slate-800" },
              { label: "Pending", val: docStats.pending, color: "text-amber-500" },
              { label: "Approved", val: docStats.approved, color: "text-emerald-500" },
              { label: "Rejected", val: docStats.rejected, color: "text-rose-500" },
              { label: "Expired", val: docStats.expired, color: "text-gray-500" },
            ].map((st, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"}`}>
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-45">{st.label}</p>
                <p className={`text-base font-black mt-0.5 ${st.color}`}>{st.val}</p>
              </div>
            ))}
          </div>

          {/* Main Layout: Sidebar for Seafarers + Content for Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Seafarer List */}
            <div className={`rounded-xl border overflow-hidden flex flex-col h-[600px] ${
              isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
            }`}>
              <div className={`p-4 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search Seafarers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-9 pr-3 py-2 w-full rounded-lg border text-xs outline-none transition-all focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredSeafarers.map(sf => {
                  const isSelected = sf.id === selectedSeafarerId;
                  const pendingCount = sf.documents.filter(d => d.status === "Pending").length;
                  return (
                    <button
                      key={sf.id}
                      onClick={() => setSelectedSeafarerId(sf.id)}
                      className={`w-full flex items-center justify-between p-4 border-b transition-colors cursor-pointer ${
                        isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"
                      } ${isSelected ? (isDark ? "bg-sky-500/10 border-l-2 border-l-sky-500" : "bg-sky-50 border-l-2 border-l-sky-500") : "border-l-2 border-l-transparent"}`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
                          {sf.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{sf.name}</h4>
                          <p className={`text-[10px] ${isDark ? "text-white/50" : "text-slate-500"}`}>{sf.rank}</p>
                        </div>
                      </div>
                      {pendingCount > 0 && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          {pendingCount}
                        </div>
                      )}
                      {pendingCount === 0 && <ChevronRight className="w-4 h-4 opacity-30" />}
                    </button>
                  );
                })}
                {filteredSeafarers.length === 0 && (
                  <div className="p-8 text-center text-xs opacity-50">No seafarers found.</div>
                )}
              </div>
            </div>

            {/* Right Col: Documents for Selected Seafarer */}
            <div className={`lg:col-span-2 rounded-xl border flex flex-col h-[600px] ${
              isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
            }`}>
              {selectedSeafarer ? (
                <>
                  {/* Profile Header */}
                  <div className={`p-6 border-b flex items-start gap-4 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white text-lg font-black uppercase shrink-0 shadow-sm">
                      {selectedSeafarer.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                        {selectedSeafarer.name}
                      </h2>
                      <div className={`flex items-center gap-3 text-[11px] mt-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                        <span>{selectedSeafarer.rank}</span>
                        <span>•</span>
                        <span>{selectedSeafarer.email}</span>
                        <span>•</span>
                        <span>INDOS: {selectedSeafarer.indosNumber || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Document List */}
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-black/10">
                    <div className="space-y-4">
                      {selectedSeafarer.documents.length === 0 ? (
                        <div className="text-center py-12 opacity-50 text-sm">
                          No documents uploaded by this seafarer.
                        </div>
                      ) : (
                        selectedSeafarer.documents.map(doc => (
                          <div
                            key={doc.id}
                            className={`p-4 rounded-xl border flex flex-col gap-4 shadow-sm ${
                              isDark ? "bg-[#0c1a2e] border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                            }`}
                          >
                            {verifyingDocId === doc.id ? (
                              <div className="flex items-center justify-center py-4 space-x-3">
                                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Verifying...</span>
                              </div>
                            ) : (
                              <>
                                {/* Doc Info & Status */}
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                                      <FileText className="w-5 h-5 text-sky-500" />
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-bold">{doc.name}</h3>
                                      <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                        Type: {doc.type}
                                      </p>
                                      <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                                        Validity: {doc.issueDate} to {doc.expiryDate}
                                      </p>
                                    </div>
                                  </div>
                                  <StatusBadge status={doc.status} />
                                </div>

                                {/* Rejection Reason display */}
                                {doc.rejectionReason && (
                                  <div className="flex items-start gap-1.5 text-[10px] text-red-500 bg-red-500/5 p-2.5 rounded-lg border border-red-500/10">
                                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                    <p><strong>Rejection Reason:</strong> {doc.rejectionReason}</p>
                                  </div>
                                )}

                                {/* Actions Footer */}
                                <div className={`pt-3 border-t flex items-center justify-between gap-3 ${isDark ? "border-white/10" : "border-slate-100"}`}>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handlePreview(doc)}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-colors cursor-pointer ${
                                        isDark ? "border-white/10 hover:bg-white/10 text-white" : "border-slate-200 hover:bg-slate-100 text-slate-700"
                                      }`}
                                    >
                                      <Eye className="w-3 h-3" />
                                      Preview
                                    </button>
                                    <button
                                      onClick={() => handleDownload(doc.name)}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-colors cursor-pointer ${
                                        isDark ? "border-white/10 hover:bg-white/10 text-white" : "border-slate-200 hover:bg-slate-100 text-slate-700"
                                      }`}
                                    >
                                      <Download className="w-3 h-3" />
                                      Download
                                    </button>
                                  </div>

                                  {/* Admin Actions */}
                                  {doc.status === "Pending" && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => openRejectDialog(doc.id)}
                                        className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border border-transparent bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer transition-colors`}
                                      >
                                        <X className="w-3 h-3" /> Reject
                                      </button>
                                      <button
                                        onClick={() => handleApprove(doc.id)}
                                        className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border border-transparent bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer transition-colors`}
                                      >
                                        <Check className="w-3 h-3" /> Approve
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <User className="w-12 h-12 opacity-10 mb-3" />
                  <p className={`text-sm ${isDark ? "text-white/40" : "text-slate-500"}`}>Select a seafarer to view their documents</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: DOCUMENT PURCHASE HISTORY — Req #6 ───────────────────────────── */}
      {activeTab === "purchase-history" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Purchase Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-45">Total Purchases</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-800"}`}>{purchaseStats.total}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-45">Total Spent</p>
              <p className="text-xl font-bold mt-1 text-emerald-500">₹{purchaseStats.totalSpent.toLocaleString("en-IN")}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-45">Completed / Issued</p>
              <p className="text-xl font-bold mt-1 text-sky-500">{purchaseStats.completed}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-45">In Processing</p>
              <p className="text-xl font-bold mt-1 text-amber-500">{purchaseStats.processing + purchaseStats.pending}</p>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                placeholder="Search by document, seafarer, institute, or invoice #..."
                value={purchaseSearch}
                onChange={(e) => { setPurchaseSearch(e.target.value); setPurchasePage(1); }}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${
                  isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Filter className="w-3.5 h-3.5 opacity-40" />
              <select
                value={purchaseStatusFilter}
                onChange={(e) => { setPurchaseStatusFilter(e.target.value); setPurchasePage(1); }}
                className={`py-2 px-3 text-xs rounded-lg border outline-none font-medium cursor-pointer ${
                  isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Purchases Table */}
          <div className={`rounded-xl border overflow-hidden ${
            isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-[10px] font-bold uppercase tracking-wider opacity-60 ${
                    isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50"
                  }`}>
                    <th className="px-5 py-3">Order / Doc Name</th>
                    <th className="px-5 py-3">Seafarer</th>
                    <th className="px-5 py-3">Training Institute</th>
                    <th className="px-5 py-3">Date (DD/MM/YY)</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                  {paginatedPurchases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center opacity-40">
                        No document purchase records found.
                      </td>
                    </tr>
                  ) : (
                    paginatedPurchases.map((rec) => (
                      <tr key={rec.id} className={`transition-colors ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}`}>
                        <td className="px-5 py-3.5">
                          <div className="font-bold">{rec.documentName}</div>
                          <div className="text-[10px] opacity-50 mt-0.5">{rec.orderId} • {rec.documentType}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium">{rec.seafarerName}</div>
                          <div className="text-[10px] opacity-50">{rec.seafarerRank}</div>
                        </td>
                        <td className="px-5 py-3.5 opacity-80 max-w-[200px] truncate">
                          {rec.instituteName}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-medium">
                          {rec.purchaseDate}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-emerald-500">
                          ₹{rec.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === "Completed"
                              ? isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                              : rec.status === "Processing"
                              ? isDark ? "bg-sky-500/15 text-sky-400" : "bg-sky-100 text-sky-700"
                              : isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-100 text-amber-700"
                          }`}>
                            {rec.status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
                            {rec.status === "Processing" && <Clock className="w-3 h-3" />}
                            {rec.status === "Pending" && <Clock className="w-3 h-3" />}
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleDownload(`${rec.documentName} Receipt.pdf`)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                              isDark ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                            title={`Download Invoice ${rec.invoiceNumber}`}
                          >
                            <Download className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPurchasePages > 1 && (
              <div className={`p-4 border-t flex items-center justify-between text-xs ${
                isDark ? "border-white/5 bg-white/[0.01]" : "border-slate-100 bg-slate-50"
              }`}>
                <span className="opacity-50">
                  Showing {(purchasePage - 1) * purchasesPerPage + 1}–{Math.min(purchasePage * purchasesPerPage, filteredPurchases.length)} of {filteredPurchases.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={purchasePage === 1}
                    onClick={() => setPurchasePage(p => Math.max(1, p - 1))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-white"
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <span className="font-bold px-1">{purchasePage} / {totalPurchasePages}</span>
                  <button
                    disabled={purchasePage === totalPurchasePages}
                    onClick={() => setPurchasePage(p => Math.min(totalPurchasePages, p + 1))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-white"
                    }`}
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MOCK DOCUMENT PREVIEW DIALOG MODAL ────────────────────────────────── */}
      {showPreviewModal && previewingDoc && selectedSeafarer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowPreviewModal(false)}
          />
          {/* Dialog Container */}
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl shadow-2xl z-50 rounded-xl overflow-hidden border ${
              isDark ? "bg-[#0b1625] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex items-center justify-between gap-4 ${
                isDark ? "border-white/5 bg-[#09111e]" : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Document Preview: {previewingDoc.name}</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Viewer Canvas */}
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-slate-100 dark:bg-[#080d16] text-center border-b border-solid border-slate-200 dark:border-white/5 relative overflow-hidden group">
              {/* Scan effect lines */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-500 opacity-60 shadow-lg animate-scan" style={{ animation: "scan 3.5s linear infinite" }} />
              
              <div className={`p-6 rounded-2xl border border-dashed border-sky-400/50 bg-sky-500/5 max-w-md space-y-4`}>
                <FileText className="w-12 h-12 text-sky-400 mx-auto" />
                <div>
                  <h4 className="font-bold text-xs">{previewingDoc.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Submitted by {selectedSeafarer.name} ({selectedSeafarer.rank})
                  </p>
                </div>
                <div className={`text-[10px] py-2 px-3 bg-white/5 rounded border text-left space-y-1 font-mono opacity-80 ${
                  isDark ? "text-white" : "text-slate-800 border-slate-200"
                }`}>
                  <p>Authority: Maritime Administration</p>
                  <p>Issue Date: {previewingDoc.issueDate}</p>
                  <p>Expiry Date: {previewingDoc.expiryDate}</p>
                  <p>Security Code: CA-SHP-{previewingDoc.id.toUpperCase()}</p>
                </div>
                <span className="text-[9px] opacity-45 italic block">
                  Interactive scan and PDF visual stream rendering is a backend simulator mockup.
                </span>
              </div>
            </div>

            {/* Preview Dialog Footer */}
            <div className={`p-4 flex items-center justify-between gap-4 ${isDark ? "bg-[#09111e]" : "bg-slate-50"}`}>
              <div className="flex gap-2">
                <StatusBadge status={previewingDoc.status} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    isDark
                      ? "border-white/10 hover:bg-white/5 text-white"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  Close Preview
                </button>
                <button
                  onClick={() => handleDownload(previewingDoc.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                    isDark
                      ? "bg-white text-black border-transparent hover:bg-gray-200"
                      : "bg-black text-white border-transparent hover:bg-gray-800"
                  }`}
                >
                  Download File
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── DOCUMENT REJECTION COMMENT MODAL ─────────────────────────────────── */}
      {showRejectModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 transition-opacity"
            onClick={() => setShowRejectModal(false)}
          />
          {/* Dialog Container */}
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-2xl z-50 rounded-xl overflow-hidden border ${
              isDark ? "bg-[#0b1625] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex items-center justify-between gap-4 ${
                isDark ? "border-white/5 bg-[#09111e]" : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold">Document Rejection Comment</h3>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRejectSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Rejection Reason</label>
                <textarea
                  placeholder="Explain why this document is being rejected (e.g. signature missing, blurry scan, invalid dates)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs outline-none h-24 ${
                    isDark
                      ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500 placeholder:text-white/20"
                      : "bg-white border-slate-200 text-slate-800 focus:border-sky-500 placeholder:text-slate-400"
                  }`}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    isDark
                      ? "border-white/10 hover:bg-white/5 text-white"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-600 text-white border border-transparent cursor-pointer transition-colors"
                >
                  Reject Document
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Inline styles for preview scan animation line */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
