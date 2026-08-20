"use client";

import React, { useEffect, useState, useCallback } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Files, Upload, Download, CheckCircle2, AlertCircle, Clock, ShieldAlert,
  Sparkles, CloudLightning, Eye, X
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
  { type: "passport", label: "Passport", desc: "Identity & validity pages", hasExpiry: true, hasMetadata: true },
  { type: "cdc", label: "CDC (Continuous Discharge Certificate)", desc: "CDC booklet pages", hasExpiry: true, hasMetadata: true },
  { type: "sid", label: "SID (Seafarer Identity Document)", desc: "Seafarer identity document", hasExpiry: true, hasMetadata: true },
  { type: "aadhaar", label: "Aadhaar Card", desc: "National identity card", hasExpiry: false, hasMetadata: true },
  { type: "pan", label: "PAN Card", desc: "Permanent Account Number card", hasExpiry: false, hasMetadata: true },
  { type: "passportPhoto", label: "Passport Size Photo", desc: "Recent passport-size photograph", hasExpiry: false, hasMetadata: false },
  { type: "policeClearance", label: "Police Clearance Certificate (PCC)", desc: "PCC document", hasExpiry: true, hasMetadata: false },
  { type: "seamanBook", label: "Seaman Book", desc: "Seaman book document", hasExpiry: false, hasMetadata: false },
  { type: "indianCdc", label: "Indian CDC", desc: "Indian CDC document", hasExpiry: false, hasMetadata: false },
  { type: "usVisa", label: "US VISA", desc: "US visa document", hasExpiry: true, hasMetadata: false },
  { type: "cancelledCheque", label: "Cancelled Cheque", desc: "Bank account proof", hasExpiry: false, hasMetadata: false },
  { type: "ownerPhoto", label: "Owner Photograph", desc: "Agency owner photograph", hasExpiry: false, hasMetadata: false },
  { type: "officePhotos", label: "Office Premises Photographs", desc: "Photographs of office premises", hasExpiry: false, hasMetadata: false },
  { type: "officeAddressProof", label: "Office Address Proof", desc: "Proof of office address", hasExpiry: false, hasMetadata: false },
  { type: "residentialAddressProof", label: "Residential Address Proof", desc: "Proof of residential address", hasExpiry: false, hasMetadata: false },
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
  
  // Track upload states for each category
  const [uploads, setUploads] = useState<Record<string, UploadState>>({
    passport: { type: "passport", progress: 0, loading: false },
    cdc: { type: "cdc", progress: 0, loading: false },
    aadhaar: { type: "aadhaar", progress: 0, loading: false },
    pan: { type: "pan", progress: 0, loading: false },
    cancelledCheque: { type: "cancelledCheque", progress: 0, loading: false },
    ownerPhoto: { type: "ownerPhoto", progress: 0, loading: false },
    officePhotos: { type: "officePhotos", progress: 0, loading: false }
  });

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

  const handleFileSelect = (type: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setUploads((prev) => ({
        ...prev,
        [type]: { ...prev[type], error: "File size exceeds 10MB limit." },
      }));
      return;
    }
    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], file, error: "", success: "" },
    }));
  };

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

    const expiryDate = expiryDates[type] || "";
    
    // Construct metadata
    const metadata = {
      number: docNumbers[type] || "",
      issueDate: issueDates[type] || "",
      issuePlace: issuePlaces[type] || ""
    };
    const serializedName = `${file.name}|||${JSON.stringify(metadata)}`;

    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: "", success: "" },
    }));

    try {
      await agentService.uploadDocument(type, expiryDate, serializedName);
      
      // Reload list
      await loadDocuments();
    } catch (err: any) {
      alert(err.message || "Document upload failed");
    } finally {
      setUploads((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          file: null,
          expiryDate: "",
          documentNumber: "",
          placeOfIssue: "",
          dateOfIssue: "",
          success: "Document uploaded successfully!",
          error: "",
        },
      }));
      await loadDocuments();
    } catch (err: any) {
      setUploads((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          error: err?.response?.data?.message || err.message || "Upload failed.",
          success: "",
        },
      }));
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
          Upload, replace, and download your verification documents. Documents are reviewed by the Agent Admin.
        </p>
      </div>

      {/* Document Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {DOCUMENT_CATEGORIES.map((cat) => {
          const existing = getDocForType(cat.type);
          const uploadState = uploads[cat.type];
          const isExpanded = expandedCard === cat.type;

          return (
            <div
              key={cat.type}
              className={`rounded-2xl border shadow-lg transition-all duration-300 overflow-hidden ${
                isDark
                  ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white hover:border-cyan-500/20"
                  : "bg-white border-slate-200 text-slate-900 hover:border-[#3b71cb]/20"
              } ${existing ? (existing.status === "Verified" ? "border-l-2 border-l-emerald-500" : existing.status === "Rejected" ? "border-l-2 border-l-red-500" : "border-l-2 border-l-amber-500") : ""}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-100 pointer-events-none`} />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm tracking-tight">{cat.label}</h3>
                  <div className={`p-2 rounded-lg ${
                    isDark ? "bg-slate-900/60 text-cyan-400" : "bg-slate-50 text-[#3b71cb]"
                  }`}>
                    <Files className="w-4 h-4" />
                  </div>
                </div>
                <p className={`text-[10px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-505"}`}>
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

              {/* Upload trigger */}
              <div className="mt-5 pt-3 border-t border-slate-800/40 relative z-10">
                {state.loading ? (
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[10px] font-black text-cyan-400 animate-pulse">
                      <span>Syncing File...</span>
                    </div>
                  </div>
                  {existing && getStatusBadge(existing.status)}
                </div>

                {/* Existing document info */}
                {existing && (
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
                )}

                {!existing && (
                  <p className={`mt-2 text-[10px] italic ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                    No document uploaded yet.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`px-5 pb-4 flex gap-2 ${existing ? "pt-2" : "pt-0"}`}>
                {existing && (
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
                      onClick={() => setExpandedCard(isExpanded ? null : cat.type)}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        isDark
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      Replace
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </>
                )}
                {!existing && (
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : cat.type)}
                    className={`w-full py-2 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                      isDark
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white"
                        : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                    }`}
                  >
                    <Upload className="w-4 h-4" /> Upload Document
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* Expanded Upload Form */}
              {isExpanded && (
                <div className={`px-5 pb-5 border-t pt-4 space-y-3 ${isDark ? "border-slate-800/40" : "border-slate-200"}`}>
                  {/* File Input */}
                  <div>
                    <label className={labelClasses}>Select File</label>
                    <div
                      onClick={() => {
                        const input = document.getElementById(`file-${cat.type}`) as HTMLInputElement;
                        input?.click();
                      }}
                      className={`mt-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        uploadState?.file
                          ? isDark ? "border-cyan-500/40 bg-cyan-500/5" : "border-[#3b71cb]/40 bg-blue-50"
                          : isDark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        id={`file-${cat.type}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileSelect(cat.type, f);
                        }}
                      />
                      {uploadState?.file ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`} />
                          <span className="text-xs font-bold truncate max-w-[180px]">{uploadState.file.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploads((prev) => ({
                                ...prev,
                                [cat.type]: { ...prev[cat.type], file: null },
                              }));
                            }}
                            className="text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
                          <p className={`text-[10px] font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Click to select file (PDF, JPG, PNG - max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expiry Date */}
                  {cat.hasExpiry && (
                    <div>
                      <label className={labelClasses}>Expiry Date</label>
                      <input
                        type="date"
                        value={uploadState?.expiryDate || ""}
                        onChange={(e) =>
                          setUploads((prev) => ({
                            ...prev,
                            [cat.type]: { ...prev[cat.type], expiryDate: e.target.value },
                          }))
                        }
                        className={inputClasses}
                      />
                    </div>
                  )}

                  {/* Document Metadata Fields */}
                  {cat.hasMetadata && (
                    <>
                      <div>
                        <label className={labelClasses}>Document Number</label>
                        <input
                          type="text"
                          placeholder={`Enter ${cat.label} number`}
                          value={uploadState?.documentNumber || ""}
                          onChange={(e) =>
                            setUploads((prev) => ({
                              ...prev,
                              [cat.type]: { ...prev[cat.type], documentNumber: e.target.value },
                            }))
                          }
                          className={inputClasses}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelClasses}>Place of Issue</label>
                          <input
                            type="text"
                            placeholder="City"
                            value={uploadState?.placeOfIssue || ""}
                            onChange={(e) =>
                              setUploads((prev) => ({
                                ...prev,
                                [cat.type]: { ...prev[cat.type], placeOfIssue: e.target.value },
                              }))
                            }
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Date of Issue</label>
                          <input
                            type="date"
                            value={uploadState?.dateOfIssue || ""}
                            onChange={(e) =>
                              setUploads((prev) => ({
                                ...prev,
                                [cat.type]: { ...prev[cat.type], dateOfIssue: e.target.value },
                              }))
                            }
                            className={inputClasses}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Messages */}
                  {uploadState?.error && (
                    <div className={`p-2.5 rounded-lg flex items-start gap-2 text-[10px] ${isDark ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-200 text-red-700"}`}>
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{uploadState.error}</span>
                    </div>
                  )}
                  {uploadState?.success && (
                    <div className={`p-2.5 rounded-lg flex items-start gap-2 text-[10px] ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{uploadState.success}</span>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={() => handleUpload(cat.type)}
                    disabled={!uploadState?.file || uploadState?.loading}
                    className={`w-full py-2 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                        : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                    }`}
                  >
                    {uploadState?.loading ? (
                      <>
                        <span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Upload {cat.label}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
        )}
      </section>

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
