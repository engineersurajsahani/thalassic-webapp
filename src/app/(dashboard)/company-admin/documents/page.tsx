"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import { mockSeafarers, SeafarerDocument } from "@/components/company-admin/mockData";
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
  ShieldCheck,
} from "lucide-react";

interface FlattenedDocument extends SeafarerDocument {
  seafarerId: string;
  seafarerName: string;
  seafarerRank: string;
}

export default function DocumentVerificationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State containing all document uploads across the crew
  const [documents, setDocuments] = useState<FlattenedDocument[]>(() => {
    const list: FlattenedDocument[] = [];
    mockSeafarers.forEach((sf) => {
      sf.documents.forEach((d) => {
        list.push({
          ...d,
          seafarerId: sf.id,
          seafarerName: sf.name,
          seafarerRank: sf.rank,
        });
      });
    });
    return list;
  });

  // Active status tab
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected" | "Expiring">("Pending");

  // Search input query
  const [searchQuery, setSearchQuery] = useState("");

  // Rejection Dialog states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Preview Dialog states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<FlattenedDocument | null>(null);

  // Simulated verification action loader
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);

  // Calculated Stats
  const docStats = useMemo(() => {
    const total = documents.length;
    const pending = documents.filter((d) => d.status === "Pending").length;
    const approved = documents.filter((d) => d.status === "Approved").length;
    const rejected = documents.filter((d) => d.status === "Rejected").length;
    const expiring = documents.filter((d) => d.status === "Expiring").length;
    return { total, pending, approved, rejected, expiring };
  }, [documents]);

  // Filtered documents list based on tab selection and search
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesTab = doc.status === activeTab;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.seafarerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [documents, activeTab, searchQuery]);

  // Tab counters helper
  const tabCounts = useMemo(() => {
    return documents.reduce(
      (acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Approved: 0, Rejected: 0, Expiring: 0 } as Record<string, number>
    );
  }, [documents]);

  // Approve Handler
  const handleApprove = (docId: string) => {
    setVerifyingDocId(docId);
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, status: "Approved", rejectionReason: undefined } : doc))
      );
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
      alert("Please enter a rejection justification.");
      return;
    }

    const targetId = rejectingDocId;
    setShowRejectModal(false);
    setVerifyingDocId(targetId);

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === targetId ? { ...doc, status: "Rejected", rejectionReason } : doc
        )
      );
      setVerifyingDocId(null);
    }, 450);
  };

  // Preview Handler
  const handlePreview = (doc: FlattenedDocument) => {
    setPreviewingDoc(doc);
    setShowPreviewModal(true);
  };

  // Download Handler
  const handleDownload = (docName: string) => {
    alert(`Mock Download: Starting download for file "${docName}" (UI Only)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
          Document Verification
        </h1>
        <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
          Review seafarer passport uploads, Certificates of Competency (CoC), and medical clearances.
        </p>
      </div>

      {/* Summary stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Crew Uploads", val: docStats.total, color: isDark ? "text-white" : "text-slate-800" },
          { label: "Pending Scanning", val: docStats.pending, color: "text-amber-500" },
          { label: "Approved Clearances", val: docStats.approved, color: "text-emerald-500" },
          { label: "Rejections Issued", val: docStats.rejected, color: "text-rose-500" },
        ].map((st, idx) => (
          <div key={idx} className={`p-3 rounded-lg border ${isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider opacity-45">{st.label}</p>
            <p className={`text-base font-black mt-0.5 ${st.color}`}>{st.val}</p>
          </div>
        ))}
      </div>

      {/* Tabs list & search filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-solid border-slate-100 dark:border-white/5 pb-1">
        {/* Navigation Tabs */}
        <div className="flex gap-4 text-xs font-semibold">
          {(["Pending", "Approved", "Rejected", "Expiring"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const count = tabCounts[tab] || 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "border-sky-500 text-sky-400 font-bold"
                    : "border-transparent text-gray-500 hover:text-sky-400"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    isActive
                      ? isDark
                        ? "bg-sky-500/20 text-sky-400"
                        : "bg-sky-50 text-sky-700"
                      : isDark
                      ? "bg-white/5 text-white/40"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search documents or crew..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-9 pr-3 py-1.5 w-full rounded-lg border text-xs outline-none transition-all focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          />
        </div>
      </div>

      {/* Grid of uploaded document cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocuments.length === 0 ? (
          <div
            className={`col-span-2 py-16 text-center border rounded-xl ${
              isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
            }`}
          >
            <FileText className={`w-8 h-8 mx-auto opacity-35 mb-2`} />
            <p className="text-xs text-gray-500">No documents found in this tab.</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all hover:shadow-md min-h-[170px] ${
                isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              {verifyingDocId === doc.id ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-2">
                  <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold text-sky-400 animate-pulse uppercase tracking-wider">Verifying File Authenticity...</span>
                </div>
              ) : (
                <>
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                        <h3 className="text-xs font-bold leading-tight">{doc.name}</h3>
                      </div>
                      <div className="text-[10px] opacity-60 leading-normal space-y-0.5">
                        <p>
                          Uploaded by:{" "}
                          <strong className={isDark ? "text-white" : "text-slate-800"}>
                            {doc.seafarerName}
                          </strong>{" "}
                          ({doc.seafarerRank})
                        </p>
                        <p>Document Type: {doc.type}</p>
                        <p>
                          Validity: {doc.issueDate} to {doc.expiryDate}
                        </p>
                      </div>
                      {doc.rejectionReason && (
                        <div className="flex items-start gap-1.5 text-[10px] text-red-400 mt-2 bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <p>
                            <strong>Rejection Reason:</strong> {doc.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>

                  {/* Card Actions Panel */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-solid border-slate-100 dark:border-white/5">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handlePreview(doc)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase rounded border cursor-pointer transition-colors ${
                          isDark
                            ? "border-white/10 hover:bg-white/5 text-white"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleDownload(doc.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase rounded border cursor-pointer transition-colors ${
                          isDark
                            ? "border-white/10 hover:bg-white/5 text-white"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>

                    {/* Verification Controls for Pending items */}
                    {doc.status === "Pending" && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => openRejectDialog(doc.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase rounded border border-transparent bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer transition-colors`}
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(doc.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase rounded border border-transparent bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 dark:text-emerald-400 cursor-pointer transition-colors`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
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

      {/* ── MOCK DOCUMENT PREVIEW DIALOG MODAL ────────────────────────────────── */}
      {showPreviewModal && previewingDoc && (
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
                    Submitted by {previewingDoc.seafarerName} ({previewingDoc.seafarerRank})
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
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-red-505 hover:bg-red-600 text-white border border-transparent cursor-pointer transition-colors"
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
