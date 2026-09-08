"use client";

import React, { useEffect, useState } from "react";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Files,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function PartnerDocumentsPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);

  const docTypes = [
    { type: "rpslCertificate", label: "RPSL / DG Shipping License", desc: "Mandatory recruitment & placement license for maritime operations" },
    { type: "companyPan", label: "Agency Company PAN Card", desc: "Tax identity proof of agency" },
    { type: "gstCertificate", label: "GST Registration Certificate", desc: "Goods & Services Tax registration certificate" },
    { type: "bankProof", label: "Cancelled Cheque / Bank Letter", desc: "Required for financial remittance and UTR verification" },
    { type: "officePhoto", label: "Office Premises Photo", desc: "Proof of physical operating address" },
  ];

  const loadDocuments = async () => {
    try {
      const data = await partnerService.getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (type: string, file: File) => {
    if (!file) return;
    setUploading(type);
    try {
      await partnerService.uploadDocument(type, file);
      await loadDocuments();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(null);
    }
  };

  const cardBg = isDark
    ? "bg-[#09162c]/90 border-white/10 shadow-xl"
    : "bg-white border-slate-200 shadow-md";

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-slate-600 font-medium";
  const accentText = isDark ? "text-cyan-300 font-extrabold" : "text-blue-700 font-extrabold";

  // Calculate compliance percentage
  const uploadedCount = docTypes.filter((dt) => documents.some((d) => d.type === dt.type)).length;
  const verifiedCount = docTypes.filter((dt) => {
    const d = documents.find((doc) => doc.type === dt.type);
    return d?.status === "Verified" || d?.status === "Approved";
  }).length;
  const progressPercent = Math.round((uploadedCount / docTypes.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              isDark ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "bg-blue-100 text-blue-900 border border-blue-300"
            }`}
          >
            Partner Compliance & Licensing
          </span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 ${headingText}`}>
          Agency Verification Documents
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${subText}`}>
          Upload authorized Partner documentation for RPSL licensing, address verification, and tax compliance.
        </p>
      </div>

      {/* Compliance Health Progress Banner */}
      <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-base font-extrabold ${headingText}`}>Agency Compliance Health</h2>
              <p className={`text-xs ${subText}`}>
                {uploadedCount} of {docTypes.length} documents uploaded • {verifiedCount} verified by Hari Om Admin
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className={`text-2xl font-black ${accentText}`}>{progressPercent}%</span>
            <span className={`text-xs block font-bold ${subText}`}>Compliance Complete</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Document Items Stack */}
      <div className="space-y-4">
        {docTypes.map((dt) => {
          const uploaded = documents.find((d) => d.type === dt.type);
          const isUploaded = !!uploaded;
          const isVerified = uploaded?.status === "Verified" || uploaded?.status === "Approved";

          return (
            <div
              key={dt.type}
              className={`p-5 md:p-6 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardBg}`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isVerified
                    ? isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : isUploaded
                    ? isDark ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-blue-100 text-blue-900 border border-blue-300"
                    : isDark ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}>
                  <Files className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className={`font-extrabold text-base ${headingText}`}>{dt.label}</h3>
                    {isVerified ? (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}>
                        Verified ✓
                      </span>
                    ) : isUploaded ? (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-blue-100 text-blue-900 border border-blue-300"
                      }`}>
                        Under Review
                      </span>
                    ) : (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}>
                        Pending Upload
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mt-1 ${subText}`}>{dt.desc}</p>

                  {isUploaded && (
                    <div className={`flex flex-wrap items-center gap-3 text-[11px] font-mono mt-2 pt-2 border-t ${
                      isDark ? "border-white/5 text-slate-400" : "border-slate-200 text-slate-600"
                    }`}>
                      <span>File: {uploaded.fileName || `${dt.type}.pdf`}</span>
                      <span>•</span>
                      <span>Uploaded: {uploaded.uploadedAt ? new Date(uploaded.uploadedAt).toLocaleDateString("en-IN") : "Recent"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200 dark:border-white/10">
                {isUploaded && (
                  <button
                    type="button"
                    onClick={() => setViewingDoc({ ...uploaded, label: dt.label })}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isDark ? "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                    }`}
                  >
                    View File
                  </button>
                )}

                <label className={`cursor-pointer px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md ${
                  isDark ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}>
                  {uploading === dt.type ? "Uploading..." : isUploaded ? "Re-upload" : "Upload File"}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUpload(dt.type, e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document View Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className={`w-full max-w-lg p-6 md:p-8 rounded-3xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Files className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
                <h3 className={`text-base font-extrabold ${headingText}`}>{viewingDoc.label}</h3>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className={`text-xs font-bold ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                ✕ Close
              </button>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 text-xs font-semibold ${
              isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex justify-between">
                <span className={subText}>Document Type:</span>
                <span className={`font-bold ${headingText}`}>{viewingDoc.label}</span>
              </div>
              <div className="flex justify-between">
                <span className={subText}>File Name:</span>
                <span className={`font-mono ${accentText}`}>{viewingDoc.fileName || "document.pdf"}</span>
              </div>
              <div className="flex justify-between">
                <span className={subText}>Verification Status:</span>
                <span className={`font-bold ${isDark ? "text-emerald-300" : "text-emerald-800"}`}>
                  {viewingDoc.status || "Verified"}
                </span>
              </div>
            </div>

            <div className={`p-8 border border-dashed rounded-2xl text-center space-y-3 ${
              isDark ? "border-white/10" : "border-slate-300"
            }`}>
              <Files className={`w-10 h-10 mx-auto ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
              <p className={`text-xs font-bold ${headingText}`}>Document Verified & Logged</p>
              {viewingDoc.fileUrl ? (
                <a
                  href={viewingDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download / Open Document
                </a>
              ) : (
                <p className={`text-[11px] italic ${subText}`}>
                  File stored in secure partner verification vault.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingDoc(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold ${
                  isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                }`}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
