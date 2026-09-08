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
  const isDark = theme === "dark";

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const docTypes = [
    { type: "rpslCertificate", label: "RPSL / DG Shipping License", desc: "Mandatory recruitment & placement license" },
    { type: "companyPan", label: "Agency Company PAN Card", desc: "Tax identity proof of agency" },
    { type: "gstCertificate", label: "GST Registration Certificate", desc: "Goods & Services Tax registration" },
    { type: "bankProof", label: "Cancelled Cheque / Bank Letter", desc: "For financial remittance verification" },
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
    ? "bg-[#09162c]/80 border-white/5 shadow-sm"
    : "bg-white border-slate-200/80 shadow-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Verification Documents
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Upload authorized Partner documentation for RPSL licensing, address verification, and tax compliance.
        </p>
      </div>

      <div className="space-y-4">
        {docTypes.map((dt) => {
          const uploaded = documents.find((d) => d.type === dt.type);
          const isUploaded = !!uploaded;
          const isVerified = uploaded?.status === "Verified" || uploaded?.status === "Approved";

          return (
            <div
              key={dt.type}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardBg}`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isVerified ? "bg-emerald-500/10 text-emerald-400" : isUploaded ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-slate-400"}`}>
                  <Files className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-xs">{dt.label}</h3>
                    {isVerified ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Verified ✓
                      </span>
                    ) : isUploaded ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Under Review
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Pending Upload
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{dt.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm">
                  {uploading === dt.type ? "Uploading..." : isUploaded ? "Re-upload" : "Upload File"}
                  <input
                    type="file"
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
    </div>
  );
}
