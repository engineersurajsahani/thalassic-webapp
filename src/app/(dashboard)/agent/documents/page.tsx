"use client";
import toast from 'react-hot-toast';

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
  { type: "passport", label: "Passport", desc: "Identity & validity pages", hasExpiry: true, hasMetadata: true, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "cdc", label: "CDC (Continuous Discharge Certificate)", desc: "CDC booklet pages", hasExpiry: true, hasMetadata: true, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "sid", label: "SID (Seafarer Identity Document)", desc: "Seafarer identity document", hasExpiry: true, hasMetadata: false, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "aadhaar", label: "Aadhaar Card", desc: "National identity card", hasExpiry: false, hasMetadata: true, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "pan", label: "PAN Card", desc: "Permanent Account Number card", hasExpiry: false, hasMetadata: true, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "cancelledCheque", label: "Cancelled Cheque", desc: "Bank account proof", hasExpiry: false, hasMetadata: false, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "ownerPhoto", label: "Agency Owner Photograph", desc: "Agency owner photograph", hasExpiry: false, hasMetadata: false, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "officePhotos", label: "Office Premises Photograph", desc: "Photographs of office premises", hasExpiry: false, hasMetadata: false, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "officeAddressProof", label: "Office Address Proof", desc: "Proof of office address", hasExpiry: false, hasMetadata: false, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" },
  { type: "residentialAddressProof", label: "Residency Address Proof", desc: "Proof of residential address", hasExpiry: false, hasMetadata: false, color: "from-[#3D5EF6]/5 to-[#3D5EF6]/5" }
];

export default function AgentDocumentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [documents, setDocuments] = useState<any[]>([]);
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
      setDocuments(data as any);

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
    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], file, error: "", success: "" },
    }));
  };

  const handleInstantUpload = async (type: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }
    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: "", success: "" },
    }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      await agentService.uploadDocument(formData);
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
      toast.error(errMsg);
      setUploads((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false, error: errMsg, success: "" },
      }));
    }
  };

  const handleUpload = async (type: string) => {
    const uploadState = uploads[type];
    if (!uploadState?.file) return;

    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: "", success: "" },
    }));

    try {
      const formData = new FormData();
      formData.append("file", uploadState.file);
      formData.append("type", type);

      const category = DOCUMENT_CATEGORIES.find((c) => c.type === type);
      if (category?.hasExpiry && expiryDates[type]) {
        formData.append("expiryDate", expiryDates[type]);
      }

      if (category?.hasMetadata) {
        const metadata: any = {};
        if (docNumbers[type]) metadata.number = docNumbers[type];
        if (issuePlaces[type]) metadata.issuePlace = issuePlaces[type];
        if (issueDates[type]) metadata.issueDate = issueDates[type];
        if (Object.keys(metadata).length > 0) {
          formData.append("metadata", JSON.stringify(metadata));
        }
      }

      await agentService.uploadDocument(formData);
      toast.success(`${category?.label || type} uploaded successfully!`);

      setUploads((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          file: null,
          success: "Uploaded successfully!",
        },
      }));

      await loadDocuments();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Upload failed. Please try again.";
      toast.error(msg);
      setUploads((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false, error: msg },
      }));
    }
  };

  const handleDownload = async (docId: string, label: string) => {
    try {
      setDownloadingId(docId);
      const result = await agentService.downloadDocument(docId);
      if (result?.url) {
        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.name || "document";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Download failed.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
            <ShieldAlert className="w-3 h-3" /> Rejected
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

  const getDocForType = (type: string) => documents.find((d) => d.type === type);
  const inputClasses = `w-full p-2 text-xs rounded-xl border outline-none transition-colors duration-200 ${
    isDark
      ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500"
      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
  }`;
  const labelClasses = `text-[9px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-48 rounded-[16px] ${isDark ? "bg-[#0B0F19] border border-[#1F2937]" : "bg-slate-100"}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Document Manager
        </h1>
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
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
              className={`rounded-[16px] border-0 transition-colors duration-200 overflow-hidden flex flex-col justify-between h-full relative ${
                isDark
                  ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
                  : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
              }`}
            >
              {/* Main card info container */}
              <div className="relative z-10">
                {/* Top info and details */}
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm tracking-tight">{cat.label}</h3>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"
                    }`}>
                      <Files className="w-4 h-4" />
                    </div>
                  </div>
                  <p className={`text-[10px] leading-relaxed ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                    {cat.desc}
                  </p>

                  {["passport", "cdc", "aadhaar", "pan"].includes(cat.type) && (
                    <button
                      onClick={() => setActiveDetailsModal(cat.type)}
                      className={`mt-2 py-1.5 px-3 rounded-full border text-[11px] font-extrabold flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                        docNumbers[cat.type]
                          ? "bg-[#DCFCE7] border-[#16A34A]/20 text-[#16A34A]"
                          : isDark
                          ? "bg-[#111827] border-[#1F2937] text-[#3D5EF6] hover:bg-white/10"
                          : "bg-[#EEF1FE] border-[#3D5EF6]/20 text-[#3D5EF6] hover:bg-[#EEF1FE]/80"
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
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#3D5EF6] animate-pulse">
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
                      <div className={`mt-3 p-3 rounded-[16px] text-xs space-y-1 ${isDark ? "bg-slate-900/40" : "bg-slate-50"}`}>
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
                          <div className={`mt-2 p-2 rounded-[16px] ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}>
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
                      onClick={() => handleDownload(existing.id, existing.label)}
                      disabled={downloadingId === existing.id}
                      className={`flex-1 py-1.5 rounded-full font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors duration-200 ${
                        isDark
                          ? "bg-[#111827] hover:bg-white/10 text-white/70 border border-[#1F2937]"
                          : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] border border-[#E5E7EB]"
                      } disabled:opacity-50`}
                    >
                      <Download className="w-3 h-3" />
                      {downloadingId === existing.id ? "..." : "Download"}
                    </button>
                    <button
                      onClick={() => document.getElementById(`file-input-${cat.type}`)?.click()}
                      disabled={uploadState?.loading}
                      className={`flex-1 py-1.5 rounded-full font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors duration-200 ${
                        isDark
                          ? "bg-[#111827] hover:bg-white/10 text-white/70 border border-[#1F2937]"
                          : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] border border-[#E5E7EB]"
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
                    className="w-full py-2 rounded-full font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors duration-200 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
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
        <div className={`rounded-[16px] border-0 p-5 flex flex-col justify-between h-full relative ${
          isDark
            ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
            : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
        }`}>
          <div className="relative z-10 space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm tracking-tight">Upload Progress</h3>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"
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
                    <div className="w-full bg-[#F3F4F6] dark:bg-[#111827] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3D5EF6] h-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className={`p-2 rounded-[16px] text-center border ${isDark ? "bg-[#111827] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}>
                      <span className="block text-lg font-black text-[#16A34A]">{verified}</span>
                      <span className="text-[9px] font-bold text-[#6B7280] dark:text-gray-400 uppercase">Verified</span>
                    </div>
                    <div className={`p-2 rounded-[16px] text-center border ${isDark ? "bg-[#111827] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}>
                      <span className="block text-lg font-black text-[#B45309]">{pending}</span>
                      <span className="text-[9px] font-bold text-[#6B7280] dark:text-gray-400 uppercase">Pending</span>
                    </div>
                    <div className={`p-2 rounded-[16px] text-center border ${isDark ? "bg-[#111827] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}>
                      <span className="block text-lg font-black text-[#DC2626]">{rejected}</span>
                      <span className="text-[9px] font-bold text-[#6B7280] dark:text-gray-400 uppercase">Rejected</span>
                    </div>
                    <div className={`p-2 rounded-[16px] text-center border ${isDark ? "bg-[#111827] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}>
                      <span className="block text-lg font-black text-[#6B7280] dark:text-gray-400">{total - uploaded}</span>
                      <span className="text-[9px] font-bold text-[#6B7280] dark:text-gray-400 uppercase">Missing</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Card 12: Upload Guidelines & Help */}
        <div className={`rounded-[16px] border-0 p-5 flex flex-col justify-between h-full relative ${
          isDark
            ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
            : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
        }`}>
          <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-sm tracking-tight">Upload Guidelines</h3>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"
                }`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>

              <ul className={`space-y-1.5 text-[10px] leading-relaxed font-medium ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                <li className="flex items-start gap-1">
                  <span className="text-[#3D5EF6] mt-0.5">•</span>
                  <span>Max file size allowed is <strong>10MB</strong> per file.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-[#3D5EF6] mt-0.5">•</span>
                  <span>Supported formats: <strong>PDF, JPG, JPEG, PNG</strong>.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-[#3D5EF6] mt-0.5">•</span>
                  <span>Ensure all document edges are fully visible and readable.</span>
                </li>
              </ul>
            </div>

            <div className={`mt-auto p-2.5 rounded-[16px] border text-[10px] text-center font-bold ${
              isDark ? "bg-[#111827] border-[#1F2937] text-gray-400" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#6B7280]"
            }`}>
              💡 Need assistance? Contact admin at <a href="mailto:support@hariom.com" className="text-[#3D5EF6] underline">support@hariom.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Table */}
      {documents.length > 0 && (
        <section className={`rounded-[16px] border-0 p-6 md:p-8 relative overflow-hidden ${
          isDark ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white" : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
        }`}>
          <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3D5EF6]" />
              <h3 className="text-lg font-black tracking-tight">Uploaded Documents</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EEF1FE] text-[#3D5EF6]">
              Total: {documents.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-semibold border-b uppercase tracking-wider text-[10px] ${
                  isDark ? "text-gray-400 border-[#1F2937]" : "text-[#6B7280] border-[#E5E7EB]"
                }`}>
                  <th className="pb-3 pr-4">Document</th>
                  <th className="pb-3 pr-4">File Name</th>
                  <th className="pb-3 pr-4">Upload Date</th>
                  <th className="pb-3 pr-4">Expiry Date</th>
                  <th className="pb-3 pr-4">Status Check</th>
                  <th className="pb-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
                {documents.map((doc) => (
                  <tr key={doc.id} className={`transition-colors duration-200 ${
                    isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/70"
                  }`}>
                    <td className="py-4 pr-4 font-mono font-bold uppercase tracking-wider text-[#3D5EF6] text-[10px]">
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
                              return <span className={`block text-[9px] font-mono mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Num: {meta.number}</span>;
                            }
                          } catch {}
                        }
                        return null;
                      })()}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
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
                          className={`p-1.5 rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                            isDark 
                              ? "bg-[#111827] border-[#1F2937] text-white/70 hover:text-white hover:bg-white/10" 
                              : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
                          }`}
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={doc.url?.startsWith("http") ? doc.url : `http://localhost:4000${doc.url}`}
                          download
                          className={`p-1.5 rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                            isDark 
                              ? "bg-[#111827] border-[#1F2937] text-white/70 hover:text-white hover:bg-white/10" 
                              : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-[16px] relative animate-zoomIn overflow-hidden border-0 shadow-2xl ${
            isDark ? "bg-[#0B0F19] text-white" : "bg-white text-[#111827]"
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D5EF6]">
                ✍️ Fill {activeDetailsModal.toUpperCase()} Details
              </h3>
              <button
                onClick={() => setActiveDetailsModal(null)}
                className={`p-1.5 rounded-full transition-colors duration-200 ${isDark ? "hover:bg-white/5 text-white/40 hover:text-white" : "hover:bg-slate-100 text-[#6B7280] hover:text-[#111827]"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {activeDetailsModal === "passport" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      value={docNumbers[activeDetailsModal] || ""}
                      onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                      }`}
                      placeholder="Enter Passport Number"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      value={issueDates[activeDetailsModal] || ""}
                      onChange={(e) => setIssueDates(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      Date of Expiry *
                    </label>
                    <input
                      type="date"
                      value={expiryDates[activeDetailsModal] || ""}
                      onChange={(e) => setExpiryDates((prev) => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      Place of Issue *
                    </label>
                    <input
                      type="text"
                      value={issuePlaces[activeDetailsModal] || ""}
                      onChange={(e) => setIssuePlaces(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                      }`}
                      placeholder="Enter Place of Issue"
                    />
                  </div>
                </div>
              )}

              {activeDetailsModal === "cdc" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      CDC Number *
                    </label>
                    <input
                      type="text"
                      value={docNumbers[activeDetailsModal] || ""}
                      onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                      }`}
                      placeholder="Enter CDC Number"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      value={issueDates[activeDetailsModal] || ""}
                      onChange={(e) => setIssueDates(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      Date of Expiry *
                    </label>
                    <input
                      type="date"
                      value={expiryDates[activeDetailsModal] || ""}
                      onChange={(e) => setExpiryDates((prev) => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      Place of Issue *
                    </label>
                    <input
                      type="text"
                      value={issuePlaces[activeDetailsModal] || ""}
                      onChange={(e) => setIssuePlaces(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                      className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                        isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                      }`}
                      placeholder="Enter Place of Issue"
                    />
                  </div>
                </div>
              )}

              {activeDetailsModal === "aadhaar" && (
                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    value={docNumbers[activeDetailsModal] || ""}
                    onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                    className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                      isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                    }`}
                    placeholder="Enter 12-digit Aadhaar"
                  />
                </div>
              )}

              {activeDetailsModal === "pan" && (
                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                    PAN Card Number *
                  </label>
                  <input
                    type="text"
                    value={docNumbers[activeDetailsModal] || ""}
                    onChange={(e) => setDocNumbers(prev => ({ ...prev, [activeDetailsModal]: e.target.value }))}
                    className={`w-full p-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                      isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                    }`}
                    placeholder="Enter 10-digit PAN"
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveDetailsModal(null)}
              className="mt-6 w-full py-2.5 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white font-bold rounded-full text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors duration-200"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
