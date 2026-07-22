"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Files, Upload, Download, CheckCircle2, AlertCircle, Clock, ShieldAlert,
  Sparkles, CloudLightning
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

    const expiryDate = expiryDates[type] || "";

    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, progress: 0 },
    }));

    try {
      await agentService.uploadDocument(type, expiryDate, file.name);
      
      // Clear inputs
      setExpiryDates((prev) => ({ ...prev, [type]: "" }));
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

                {(cat.type === "passport" || cat.type === "cdc") && (
                  <div className="space-y-1.5">
                    <label className={`text-[9px] uppercase font-black tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={expiryDates[cat.type] || ""}
                      onChange={(e) =>
                        setExpiryDates((prev) => ({ ...prev, [cat.type]: e.target.value }))
                      }
                      className={`w-full p-2 text-xs rounded-lg border outline-none ${
                        isDark
                          ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500"
                          : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
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
                    <td className="py-4 pr-4 max-w-[200px] truncate font-semibold" title={doc.label}>
                      {doc.label || "—"}
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
