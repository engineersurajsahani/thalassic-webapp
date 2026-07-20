"use client";

import React, { useEffect, useState } from "react";
import { documentService } from "@/features/documents/services/document.service";
import { useTheme } from "@/providers/theme-provider";
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Plus, 
  ShieldAlert, 
  HelpCircle,
  Clock,
  CloudLightning,
  Sparkles
} from "lucide-react";

interface UploadState {
  type: string;
  progress: number;
  loading: boolean;
}

export default function DocumentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  
  // Track upload states for each category
  const [uploads, setUploads] = useState<Record<string, UploadState>>({
    cdc: { type: "cdc", progress: 0, loading: false },
    passport: { type: "passport", progress: 0, loading: false },
    medical: { type: "medical", progress: 0, loading: false },
    stcw: { type: "stcw", progress: 0, loading: false },
  });

  const loadDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
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

    // Validate type (PDF, JPEG, PNG)
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file format. Please upload PDF, JPG, or PNG.");
      return;
    }

    const expiryDate = expiryDates[type] || "";

    setUploads((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, progress: 0 },
    }));

    try {
      await documentService.uploadDocument(
        type,
        file,
        expiryDate,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploads((prev) => ({
            ...prev,
            [type]: { ...prev[type], progress: percentCompleted },
          }));
        }
      );
      
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentService.deleteDocument(id);
      await loadDocuments();
    } catch (err: any) {
      alert(err.message || "Failed to delete document");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Verified
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
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-52 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
          ))}
        </div>
        <div className={`h-72 rounded-3xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
      </div>
    );
  }

  const documentCategories = [
    { type: "passport", label: "Passport", desc: "Front/back bio pages copy", color: "from-cyan-500/5 to-blue-500/5" },
    { type: "cdc", label: "CDC Booklet", desc: "Continuous Discharge Certificate", color: "from-indigo-500/5 to-purple-500/5" },
    { type: "medical", label: "Medical Certificate", desc: "Accredited DGS Physical Fitness Report", color: "from-teal-500/5 to-emerald-500/5" },
    { type: "stcw", label: "STCW Safety Certs", desc: "BST, STSDSD safety courses", color: "from-amber-500/5 to-orange-500/5" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
          isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
        }`}>
          📂 Digital Credentials Vault
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          Marine Document Registry
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Securely upload and manage your passport, CDC, fitness certifications, and course credentials.
        </p>
      </div>

      {/* 1. Document Upload Slots Grid */}
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
              {/* Highlight card backgrounds */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-100 pointer-events-none`} />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm tracking-tight">{cat.label}</h3>
                  <div className={`p-2 rounded-lg ${
                    isDark ? "bg-slate-900/60 text-cyan-400" : "bg-slate-50 text-[#3b71cb]"
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <p className={`text-[10px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {cat.desc}
                </p>

                {/* Expiry Date Datepicker */}
                <div className="space-y-1.5">
                  <label className={`text-[9px] uppercase font-black tracking-wider flex items-center gap-1.5 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}>
                    <Calendar className="w-3 h-3" /> Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={expiryDates[cat.type] || ""}
                    onChange={(e) =>
                      setExpiryDates((prev) => ({ ...prev, [cat.type]: e.target.value }))
                    }
                    className={`w-full p-2 text-xs rounded-lg border outline-none transition-colors ${
                      isDark
                        ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>
              </div>

              {/* Upload Trigger Button & Progress Bar */}
              <div className="mt-5 pt-3 border-t border-slate-800/40 relative z-10">
                {state.loading ? (
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[10px] font-black text-cyan-400 animate-pulse">
                      <span>Uploading File...</span>
                      <span>{state.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-405 rounded-full transition-all duration-300"
                        style={{ width: `${state.progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <label className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                    isDark 
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white" 
                      : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                  }`}>
                    <Upload className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" /> Select File
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

      {/* 2. Uploaded Documents List Table */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
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
              No scanned credentials have been synced yet. Choose document attachments above to populate this secure registry.
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
                  <th className="pb-3 text-right">Actions</th>
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
                    <td className="py-4 text-right flex justify-end gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                          isDark 
                            ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800 hover:border-slate-700" 
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className={`p-2 rounded-xl border flex items-center justify-center text-red-500 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                          isDark 
                            ? "border-slate-800 bg-slate-900/40 hover:bg-red-500/10 hover:border-red-500/30" 
                            : "border-slate-200 bg-slate-50 hover:bg-red-50"
                        }`}
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
