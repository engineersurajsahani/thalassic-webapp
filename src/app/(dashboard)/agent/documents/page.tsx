"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Files, Upload, Download, CheckCircle2, AlertCircle, Clock, ShieldAlert,
  Sparkles, CloudLightning, Eye, X
} from "lucide-react";

interface UploadState {
  type: string;
  progress: number;
  loading: boolean;
}

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
      console.error("Failed to load document list details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileUpload = async (type: string, file: File) => {
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

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
      [type]: { ...prev[type], loading: true, progress: 0 },
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
        [type]: { ...prev[type], loading: false, progress: 0 },
      }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            <ShieldAlert className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> Pending Verification
          </span>
        );
    }
  };

  const documentCategories = [
    { type: "passport", label: "Owner Passport", desc: "Identity & Validity pages copy", color: "from-cyan-500/5 to-blue-500/5" },
    { type: "cdc", label: "CDC Booklet", desc: "Continuous Discharge Certificate pages", color: "from-indigo-500/5 to-purple-500/5" },
    { type: "aadhaar", label: "Aadhaar Card", desc: "National Identity copy", color: "from-teal-500/5 to-emerald-500/5" },
    { type: "pan", label: "PAN Card", desc: "Permanent Account Number card", color: "from-amber-500/5 to-orange-500/5" },
    { type: "cancelledCheque", label: "Cancelled Cheque", desc: "Bank Account Details receipt copy", color: "from-rose-500/5 to-red-500/5" },
    { type: "ownerPhoto", label: "Photograph", desc: "Agency Owner profile photograph", color: "from-blue-500/5 to-indigo-500/5" },
    { type: "officePhotos", label: "Office Premises Proof", desc: "Photographs of operational offices", color: "from-violet-500/5 to-purple-500/5" },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-52 rounded-2xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
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
          📂 Credentials Management
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          Digital Document Registry
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Upload, replace, and audit your verification credentials. Document approval or rejection is restricted to the **Agent Admin**.
        </p>
      </div>

      {/* Grid slots */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documentCategories.map((cat) => {
          const state = uploads[cat.type];
          return (
            <div
              key={cat.type}
              className={`rounded-2xl p-5 border shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative overflow-hidden group ${
                isDark 
                  ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white hover:border-cyan-500/20" 
                  : "bg-white border-slate-200 text-slate-900 hover:border-[#3b71cb]/20"
              }`}
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
                ) : (
                  <label className={`w-full py-2 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                    isDark 
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white" 
                      : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                  }`}>
                    <Upload className="w-4 h-4" /> Upload File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(cat.type, file);
                      }}
                    />
                  </label>
                )}
              </div>

            </div>
          );
        })}
      </section>

      {/* Registry Table */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-black tracking-tight">Active Credential Registry</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
          }`}>
            Total uploads: {documents.length}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 ${
            isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50/50"
          }`}>
            <CloudLightning className="w-10 h-10 text-slate-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-400">Vault is Empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[300px] leading-relaxed">
              No files uploaded yet. Upload documents above to begin verification.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-black border-b uppercase tracking-widest text-[9px] ${
                  isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                }`}>
                  <th className="pb-3 pr-4">Document Category</th>
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
