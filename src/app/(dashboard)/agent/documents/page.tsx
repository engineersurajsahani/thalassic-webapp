"use client";

import React, { useEffect, useState, useCallback } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Files, Upload, Download, CheckCircle2, AlertCircle, Clock, ShieldAlert,
  Sparkles, CloudLightning, Eye, X, ChevronUp, ChevronDown, FileText
} from "lucide-react";

interface DocumentMeta {
  documentNumber?: string;
  placeOfIssue?: string;
  dateOfIssue?: string;
  adminRemarks?: string;
}

interface DocumentRecord {
  id: string;
  type: string;
  label: string;
  status: string;
  expiryDate: string | null;
  uploadedAt: string | null;
  url: string | null;
  documentNumber?: string | null;
  placeOfIssue?: string | null;
  dateOfIssue?: string | null;
  remarks?: string | null;
}

interface UploadState {
  type: string;
  progress?: number;
  loading: boolean;
  file?: File | null;
  expiryDate?: string;
  documentNumber?: string;
  placeOfIssue?: string;
  dateOfIssue?: string;
  error?: string;
  success?: string;
}

interface UploadFormState {
  file: File | null;
  expiryDate: string;
  documentNumber: string;
  placeOfIssue: string;
  dateOfIssue: string;
  loading: boolean;
  error: string;
  success: string;
}

const DOCUMENT_CATEGORIES = [
  { type: "passport", label: "Passport", desc: "Identity & validity pages", hasExpiry: true, hasMetadata: true, color: "from-blue-500/5 to-indigo-500/5" },
  { type: "cdc", label: "CDC (Continuous Discharge Certificate)", desc: "CDC booklet pages", hasExpiry: true, hasMetadata: true, color: "from-indigo-500/5 to-purple-500/5" },
  { type: "sid", label: "SID (Seafarer Identity Document)", desc: "Seafarer identity document", hasExpiry: true, hasMetadata: false, color: "from-purple-500/5 to-pink-500/5" },
  { type: "aadhaar", label: "Aadhaar Card", desc: "National identity card", hasExpiry: false, hasMetadata: true, color: "from-pink-500/5 to-rose-500/5" },
  { type: "pan", label: "PAN Card", desc: "Permanent Account Number card", hasExpiry: false, hasMetadata: true, color: "from-rose-500/5 to-orange-500/5" },
  { type: "cancelledCheque", label: "Cancelled Cheque", desc: "Bank account proof", hasExpiry: false, hasMetadata: false, color: "from-orange-500/5 to-amber-500/5" },
  { type: "ownerPhoto", label: "Agency Owner Photograph", desc: "Agency owner photograph", hasExpiry: false, hasMetadata: false, color: "from-amber-500/5 to-yellow-500/5" },
  { type: "officePhotos", label: "Office Premises Photograph", desc: "Photographs of office premises", hasExpiry: false, hasMetadata: false, color: "from-yellow-500/5 to-lime-500/5" },
  { type: "officeAddressProof", label: "Office Address Proof", desc: "Proof of office address", hasExpiry: false, hasMetadata: false, color: "from-lime-500/5 to-green-500/5" },
  { type: "residentialAddressProof", label: "Residency Address Proof", desc: "Proof of residential address", hasExpiry: false, hasMetadata: false, color: "from-green-500/5 to-emerald-500/5" }
];

export default function AgentDocumentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  const [docNumbers, setDocNumbers] = useState<Record<string, string>>({});
  const [issueDates, setIssueDates] = useState<Record<string, string>>({});
  const [issuePlaces, setIssuePlaces] = useState<Record<string, string>>({});
  const [activeDetailsModal, setActiveDetailsModal] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const initUploadState = useCallback(() => {
    const initial: Record<string, any> = {};
    DOCUMENT_CATEGORIES.forEach((cat) => {
      initial[cat.type] = {
        type: cat.type,
        progress: 0,
        loading: false,
        file: null,
        expiryDate: "",
        documentNumber: "",
        placeOfIssue: "",
        dateOfIssue: "",
        error: "",
        success: "",
      };
    });
    return initial;
  }, []);

  // Track upload states for each category
  const [uploads, setUploads] = useState<Record<string, any>>({});

  const loadDocuments = async () => {
    try {
      const data = await agentService.getDocuments();
      setDocuments(data);

      const loadedDocNumbers: Record<string, string> = {};
      const loadedIssueDates: Record<string, string> = {};
      const loadedIssuePlaces: Record<string, string> = {};
      const loadedExpiryDates: Record<string, string> = {};

      (data || []).forEach((doc: any) => {
        const type = doc.type;
        const rawName = doc.label || doc.name || "";
        
        if (rawName.includes("|||")) {
          const parts = rawName.split("|||");
          try {
            const meta = JSON.parse(parts[1]);
            if (meta.number) loadedDocNumbers[type] = meta.number;
            if (meta.issueDate) loadedIssueDates[type] = meta.issueDate;
            if (meta.issuePlace) loadedIssuePlaces[type] = meta.issuePlace;
          } catch (e) {
            console.warn("Failed to parse document metadata for", type, e);
          }
        }
        
        if (doc.expiryDate) {
          loadedExpiryDates[type] = doc.expiryDate.split("T")[0];
        }
      });

      setDocNumbers(loadedDocNumbers);
      setIssueDates(loadedIssueDates);
      setIssuePlaces(loadedIssuePlaces);
      setExpiryDates(loadedExpiryDates);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    setUploads(initUploadState());
  }, [initUploadState]);

  const handleInstantUpload = async (type: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: "", success: "" },
    }));
    try {
      await agentService.uploadDocument(type, file, file.name);
      setUploads((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          file: null,
          success: "Document uploaded successfully!",
          error: "",
        },
      }));
      await loadDocuments();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err.message || "Upload failed.";
      alert(errMsg);
      setUploads((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false, error: errMsg, success: "" },
      }));
    }
  };

  const handleUpload = async (type: string) => {
    const uploadState = uploads[type];
    const file = uploadState?.file;
    if (!file) return;

    // Validate required fields based on PRD requirements
    if (type === "passport") {
      if (!docNumbers[type] || !issueDates[type] || !expiryDates[type] || !issuePlaces[type]) {
        alert("Please fill all Passport details (Number, Issue Date, Expiry Date, Place) before uploading.");
        return;
      }
    } else if (type === "cdc") {
      if (!docNumbers[type] || !issueDates[type] || !expiryDates[type] || !issuePlaces[type]) {
        alert("Please fill all CDC Booklet details (Number, Issue Date, Expiry Date, Place) before uploading.");
        return;
      }
    } else if (type === "aadhaar") {
      if (!docNumbers[type]) {
        alert("Please enter Aadhaar Number before uploading.");
        return;
      }
    } else if (type === "pan") {
      if (!docNumbers[type]) {
        alert("Please enter PAN Card Number before uploading.");
        return;
      }
    }

    const expiryDate = expiryDates[type] || uploadState.expiryDate || "";

    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: "", success: "" },
    }));

    try {
      const meta = {
        number: docNumbers[type] || "",
        issueDate: issueDates[type] || "",
        issuePlace: issuePlaces[type] || "",
      };
      const serializedName = `${file.name}|||${JSON.stringify(meta)}`;
      await agentService.uploadDocument(type, file, serializedName, { expiryDate });
      setUploads((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          file: null,
          success: "Document uploaded successfully!",
          error: "",
        },
      }));
      await loadDocuments();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err.message || "Upload failed.";
      alert(errMsg);
      setUploads((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          error: errMsg,
          success: "",
        },
      }));
      alert(err?.response?.data?.message || err.message || "Upload failed.");
    }
  };

  const handleDownload = async (docId: string) => {
    setDownloadingId(docId);
    try {
      const result = await agentService.downloadDocument(docId);
      if (result?.signedUrl) {
        const link = document.createElement("a");
        link.href = result.signedUrl;
        link.download = result.fileName || "document";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Download failed.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "verified":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isDark ? "text-emerald-400 bg-emerald-400/10 border-emerald-500/20" : "text-emerald-700 bg-emerald-50 border-emerald-200"}`}>
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isDark ? "text-red-400 bg-red-400/10 border-red-500/20" : "text-red-700 bg-red-50 border-red-200"}`}>
            <ShieldAlert className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border animate-pulse ${isDark ? "text-amber-400 bg-amber-400/10 border-amber-500/20" : "text-amber-700 bg-amber-50 border-amber-200"}`}>
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getDocForType = (type: string) => documents.find((d) => d.type === type);
  const inputClasses = `w-full p-2 text-xs rounded-lg border outline-none transition-colors ${
    isDark
      ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500 placeholder:text-slate-600"
      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb] placeholder:text-slate-400"
  }`;
  const labelClasses = `text-[9px] uppercase font-black tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-48 rounded-2xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
          isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
        }`}>
          Credentials Management
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          Document Manager
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Upload, replace, and download your verification documents. Documents are reviewed by the Partner Admin.
        </p>
      </div>

      {/* Document Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {DOCUMENT_CATEGORIES.map((cat) => {
          const existing = getDocForType(cat.type);
          const uploadState = uploads[cat.type];

          return (
            <div
              key={cat.type}
              className={`rounded-2xl border shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-full relative ${
                isDark
                  ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white hover:border-cyan-500/20"
                  : "bg-white border-slate-200 text-slate-900 hover:border-[#3b71cb]/20"
              } ${existing ? (existing.status === "Verified" ? "border-l-2 border-l-emerald-500" : existing.status === "Rejected" ? "border-l-2 border-l-red-500" : "border-l-2 border-l-amber-500") : ""}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 pointer-events-none`} />

              {/* Main card info container */}
              <div className="relative z-10">
                {/* Top info and details */}
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm tracking-tight">{cat.label}</h3>
                    <div className={`p-2 rounded-lg ${
                      isDark ? "bg-slate-900/60 text-cyan-400" : "bg-slate-50 text-[#3b71cb]"
                    }`}>
                      <Files className="w-4 h-4" />
                    </div>
                  </div>
                  <p className={`text-[10px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {cat.desc}
                  </p>

                  {["passport", "cdc", "aadhaar", "pan"].includes(cat.type) && (
                    <button
                      onClick={() => setActiveDetailsModal(cat.type)}
                      className={`mt-2 py-1.5 px-3 rounded-xl border text-[11px] font-extrabold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                        docNumbers[cat.type]
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          : isDark
                          ? "bg-white/5 border-white/10 text-cyan-400 hover:bg-white/10"
                          : "bg-slate-50 border-slate-200 text-[#3b71cb] hover:bg-slate-100 shadow-sm"
                      }`}
                    >
                      {docNumbers[cat.type] ? "✓ Details Saved" : "✍️ Fill Details"}
                    </button>
                  )}
                </div>

                {/* Middle: Status & Document Details */}
                <div>
                  {/* Upload Status / Header */}
                  <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between px-5">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Verification Status
                    </span>
                    {uploadState?.loading ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-cyan-400 animate-pulse">
                        <span>Syncing...</span>
                      </div>
                    ) : existing ? (
                      getStatusBadge(existing.status)
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Existing document info */}
                  {existing && (
                    <div className="px-5">
                      <div className={`mt-3 p-3 rounded-xl text-xs space-y-1 ${isDark ? "bg-slate-900/40" : "bg-slate-50"}`}>
                        <div className="flex justify-between">
                           <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>File</span>
                           <span className="truncate max-w-[160px] text-right font-bold" title={existing.label}>{existing.label}</span>
                        </div>
                        {existing.uploadedAt && (
                          <div className="flex justify-between">
                            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Uploaded</span>
                            <span className="font-bold">{new Date(existing.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {existing.expiryDate && (
                          <div className="flex justify-between">
                            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Expiry</span>
                            <span className="font-bold">{new Date(existing.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {existing.documentNumber && (
                          <div className="flex justify-between">
                            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Number</span>
                            <span className="font-bold">{existing.documentNumber}</span>
                          </div>
                        )}
                        {existing.placeOfIssue && (
                          <div className="flex justify-between">
                            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Place of Issue</span>
                            <span className="font-bold">{existing.placeOfIssue}</span>
                          </div>
                        )}
                        {existing.dateOfIssue && (
                          <div className="flex justify-between">
                            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Date of Issue</span>
                            <span className="font-bold">{new Date(existing.dateOfIssue).toLocaleDateString()}</span>
                          </div>
                        )}
                        {existing.status === "Rejected" && existing.remarks && (
                          <div className={`mt-2 p-2 rounded-lg ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}>
                            <span className={`text-[10px] font-bold ${isDark ? "text-red-400" : "text-red-600"}`}>Rejection reason: {existing.remarks}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!existing && (
                    <p className={`mt-2 text-[10px] italic px-5 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                      No document uploaded yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`mt-auto px-5 pb-4 flex gap-2 relative z-10 ${existing ? "pt-4" : "pt-2"}`}>
                <input
                  id={`file-input-${cat.type}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleInstantUpload(cat.type, f);
                  }}
                />

                {existing ? (
                  <>
                    <button
                      onClick={() => handleDownload(existing.id)}
                      disabled={downloadingId === existing.id}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        isDark
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      } disabled:opacity-50`}
                    >
                      <Download className="w-3 h-3" />
                      {downloadingId === existing.id ? "..." : "Download"}
                    </button>
                    <button
                      onClick={() => document.getElementById(`file-input-${cat.type}`)?.click()}
                      disabled={uploadState?.loading}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        isDark
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {uploadState?.loading ? (
                        <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      Replace
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => document.getElementById(`file-input-${cat.type}`)?.click()}
                    disabled={uploadState?.loading}
                    className={`w-full py-2 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                      isDark
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white"
                        : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                    }`}
                  >
                    {uploadState?.loading ? (
                      <span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload Document
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Card 11: Verification Progress Tracker */}
        <div className={`rounded-2xl border shadow-lg p-5 flex flex-col justify-between h-full relative ${
          isDark
            ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-20 pointer-events-none" />
          <div className="relative z-10 space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm tracking-tight">Upload Progress</h3>
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-slate-900/60 text-cyan-400" : "bg-slate-50 text-[#3b71cb]"
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Progress Bar & Stats */}
            {(() => {
              const total = DOCUMENT_CATEGORIES.length;
              const uploaded = documents.length;
              const percent = Math.round((uploaded / total) * 100);
              const verified = documents.filter(d => d.status === "Verified").length;
              const pending = documents.filter(d => d.status === "Pending").length;
              const rejected = documents.filter(d => d.status === "Rejected").length;

              return (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Overall Progress</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className={`p-2 rounded-xl text-center border ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                      <span className="block text-lg font-black text-emerald-500">{verified}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Verified</span>
                    </div>
                    <div className={`p-2 rounded-xl text-center border ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                      <span className="block text-lg font-black text-amber-500">{pending}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Pending</span>
                    </div>
                    <div className={`p-2 rounded-xl text-center border ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                      <span className="block text-lg font-black text-red-500">{rejected}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Rejected</span>
                    </div>
                    <div className={`p-2 rounded-xl text-center border ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                      <span className="block text-lg font-black text-slate-400">{total - uploaded}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Missing</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Card 12: Upload Guidelines & Help */}
        <div className={`rounded-2xl border shadow-lg p-5 flex flex-col justify-between h-full relative ${
          isDark
            ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-20 pointer-events-none" />
          <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-sm tracking-tight">Upload Guidelines</h3>
                <div className={`p-2 rounded-lg ${
                  isDark ? "bg-slate-900/60 text-cyan-400" : "bg-slate-50 text-[#3b71cb]"
                }`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>

              <ul className="space-y-1.5 text-[10px] leading-relaxed text-slate-400 font-medium">
                <li className="flex items-start gap-1">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Max file size allowed is <strong>10MB</strong> per file.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Supported formats: <strong>PDF, JPG, JPEG, PNG</strong>.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Ensure all document edges are fully visible and readable.</span>
                </li>
              </ul>
            </div>

            <div className={`mt-auto p-2.5 rounded-xl border text-[10px] text-center font-bold ${
              isDark ? "bg-slate-900/40 border-slate-800/80 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-600"
            }`}>
              💡 Need assistance? Contact admin at <a href="mailto:support@hariom.com" className="text-cyan-400 underline">support@hariom.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Table */}
      {documents.length > 0 && (
        <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
          isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
        }`}>
          <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isDark ? "border-slate-800/40" : "border-slate-200"}`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
              <h3 className="text-lg font-black tracking-tight">Uploaded Documents</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
            }`}>
              Total: {documents.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-black border-b uppercase tracking-widest text-[9px] ${
                  isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                }`}>
                  <th className="pb-3 pr-4">Document</th>
                  <th className="pb-3 pr-4">File Name</th>
                  <th className="pb-3 pr-4">Upload Date</th>
                  <th className="pb-3 pr-4">Expiry Date</th>
                  <th className="pb-3 pr-4">Status Check</th>
                  <th className="pb-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {documents.map((doc) => (
                  <tr key={doc.id} className={`hover:bg-slate-500/5 transition-colors ${
                    isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                  }`}>
                    <td className="py-4 pr-4 font-black uppercase tracking-wider text-cyan-400 text-[10px]">
                      {doc.type}
                    </td>
                    <td className="py-4 pr-4 max-w-[200px] truncate font-semibold" title={(doc.label || "").split("|||")[0]}>
                      {(doc.label || "").split("|||")[0] || "—"}
                      {(() => {
                        const parts = (doc.label || "").split("|||");
                        if (parts.length > 1) {
                          try {
                            const meta = JSON.parse(parts[1]);
                            if (meta.number) {
                              return <span className={`block text-[9px] font-mono mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Num: {meta.number}</span>;
                            }
                          } catch {}
                        }
                        return null;
                      })()}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                      {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "--"}
                    </td>
                    <td className="py-4 pr-4">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={doc.url?.startsWith("http") ? doc.url : `http://localhost:4000${doc.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-1.5 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm hover:shadow-cyan-500/10 cursor-pointer ${
                            isDark 
                              ? "bg-white/[0.02] border-white/10 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/30" 
                              : "bg-slate-50 border-slate-200 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-55 hover:border-cyan-200"
                          }`}
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={doc.url?.startsWith("http") ? doc.url : `http://localhost:4000${doc.url}`}
                          download
                          className={`p-1.5 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm hover:shadow-emerald-500/10 cursor-pointer ${
                            isDark 
                              ? "bg-white/[0.02] border-white/10 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/30" 
                              : "bg-slate-50 border-slate-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-55 hover:border-emerald-200"
                          }`}
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Details Entry Modal */}
      {activeDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-3xl relative animate-in zoom-in-95 duration-200 overflow-hidden ${
            isDark ? "bg-[#0d1f35] border border-white/10 text-white" : "bg-white text-slate-800 shadow-xl border border-slate-100"
          }`}>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                ✍️ Fill {activeDetailsModal.toUpperCase()} Details
              </h3>
              <button
                onClick={() => setActiveDetailsModal(null)}
                className={`p-1.5 rounded-full transition ${isDark ? "hover:bg-white/5 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {activeDetailsModal === "passport" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      value={docNumbers[activeDetailsModal] || ""}
                      onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                      placeholder="Enter Passport Number"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      value={issueDates[activeDetailsModal] || ""}
                      onChange={(e) => setIssueDates(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Date of Expiry *
                    </label>
                    <input
                      type="date"
                      value={expiryDates[activeDetailsModal] || ""}
                      onChange={(e) => setExpiryDates((prev) => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Place of Issue *
                    </label>
                    <input
                      type="text"
                      value={issuePlaces[activeDetailsModal] || ""}
                      onChange={(e) => setIssuePlaces(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                      placeholder="Enter Place of Issue"
                    />
                  </div>
                </div>
              )}

              {activeDetailsModal === "cdc" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      CDC Number *
                    </label>
                    <input
                      type="text"
                      value={docNumbers[activeDetailsModal] || ""}
                      onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                      placeholder="Enter CDC Number"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-505"}`}>
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      value={issueDates[activeDetailsModal] || ""}
                      onChange={(e) => setIssueDates(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-505"}`}>
                      Date of Expiry *
                    </label>
                    <input
                      type="date"
                      value={expiryDates[activeDetailsModal] || ""}
                      onChange={(e) => setExpiryDates((prev) => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-505"}`}>
                      Place of Issue *
                    </label>
                    <input
                      type="text"
                      value={issuePlaces[activeDetailsModal] || ""}
                      onChange={(e) => setIssuePlaces(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                      placeholder="Enter Place of Issue"
                    />
                  </div>
                </div>
              )}

              {activeDetailsModal === "aadhaar" && (
                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-505"}`}>
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    value={docNumbers[activeDetailsModal] || ""}
                    onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                      isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                    }`}
                    placeholder="Enter 12-digit Aadhaar"
                  />
                </div>
              )}

              {activeDetailsModal === "pan" && (
                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-black tracking-wider ${isDark ? "text-slate-400" : "text-slate-505"}`}>
                    PAN Card Number *
                  </label>
                  <input
                    type="text"
                    value={docNumbers[activeDetailsModal] || ""}
                    onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                      isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                    }`}
                    placeholder="Enter 10-digit PAN"
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveDetailsModal(null)}
              className="mt-6 w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98 transition-all font-sans"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
