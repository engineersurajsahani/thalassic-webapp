"use client";

import React, { useEffect, useState } from "react";
import { documentService } from "@/services/document.service";
import { useTheme } from "@/providers/theme-provider";
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Calendar, 
  Plus, 
  Clock, 
  CloudLightning, 
  Sparkles,
  Eye,
  Edit2,
  X,
  FileCheck
} from "lucide-react";

export default function DocumentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const PASSPORT_STORAGE_KEY = "thalassic_seafarer_passport_form";
  const CDC_STORAGE_KEY = "thalassic_seafarer_cdc_form";

  // Active Passport State
  const [passportForm, setPassportForm] = useState({
    passportNumber: "",
    issueDate: "",
    expiryDate: "",
    placeOfIssue: "",
  });
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [uploadingPassport, setUploadingPassport] = useState(false);

  // Active CDC State
  const [cdcForm, setCdcForm] = useState({
    cdcNumber: "",
    issueDate: "",
    expiryDate: "",
    placeOfIssue: "",
  });
  const [cdcFile, setCdcFile] = useState<File | null>(null);
  const [uploadingCdc, setUploadingCdc] = useState(false);

  // Persistence helpers
  const updatePassportField = (field: string, value: string) => {
    setPassportForm((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const updateCdcField = (field: string, value: string) => {
    setCdcForm((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem(CDC_STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  // Date validation: Expiry must be strictly later than Issue Date (minimum 1 day difference required)
  const isDateOrderValid = (issueDateStr: string, expiryDateStr: string) => {
    if (!issueDateStr || !expiryDateStr) return true;
    const issue = new Date(issueDateStr + "T00:00:00");
    const expiry = new Date(expiryDateStr + "T00:00:00");
    if (isNaN(issue.getTime()) || isNaN(expiry.getTime())) return false;
    return expiry.getTime() > issue.getTime();
  };

  const getMinExpiryDate = (issueDateStr: string) => {
    if (!issueDateStr) return undefined;
    const d = new Date(issueDateStr + "T00:00:00");
    if (isNaN(d.getTime())) return undefined;
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  // Helper to format date consistently as DD/MM/YYYY
  const formatTableDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const trimmed = String(dateStr).trim();
    if (!trimmed) return "—";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymdMatch) {
      const [, y, m, d] = ymdMatch;
      return `${d}/${m}/${y}`;
    }
    try {
      const d = new Date(trimmed);
      if (isNaN(d.getTime())) return trimmed;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return trimmed;
    }
  };

  // Validation checkers
  const isPassportNumberValid = (num: string) => {
    const trimmed = num.trim();
    return trimmed.length > 0 && trimmed.length <= 8;
  };

  const isCdcNumberValid = (cdc: string) => {
    const trimmed = cdc.trim();
    return trimmed.length > 0 && trimmed.length <= 8;
  };

  const isPassportDateValid = isDateOrderValid(passportForm.issueDate, passportForm.expiryDate);
  const passportDateError =
    passportForm.issueDate && passportForm.expiryDate && !isPassportDateValid
      ? "Date of Expiry must be later than Date of Issue (minimum 1-day difference required)."
      : "";

  const isCdcDateValid = isDateOrderValid(cdcForm.issueDate, cdcForm.expiryDate);
  const cdcDateError =
    cdcForm.issueDate && cdcForm.expiryDate && !isCdcDateValid
      ? "Date of Expiry must be later than Date of Issue (minimum 1-day difference required)."
      : "";

  const isCdcNumValid = isCdcNumberValid(cdcForm.cdcNumber);
  const cdcNumError =
    cdcForm.cdcNumber.trim().length > 8
      ? "CDC Number must not exceed 8 characters."
      : "";

  // Certificate State (Multi-certificate form & editing)
  const [showCertForm, setShowCertForm] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState({
    courseName: "",
    courseType: "Basic", // Basic, Advanced, Refresher, Other STCW
    durationFrom: "",
    durationTo: "",
    issueDate: "",
    expiryDate: "",
  });
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploadingCert, setUploadingCert] = useState(false);

  const loadDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);

      // Populate Passport form ONLY if fields are currently empty or backend has non-empty values
      const passDoc = data.find((d: any) => d.type?.toLowerCase() === "passport");
      if (passDoc) {
        setPassportForm((prev) => {
          const updated = {
            passportNumber: prev.passportNumber || passDoc.passportNumber || passDoc.metadata?.passportNumber || "",
            issueDate: prev.issueDate || passDoc.issueDate || passDoc.metadata?.issueDate || "",
            expiryDate: prev.expiryDate || passDoc.expiryDate || passDoc.metadata?.expiryDate || "",
            placeOfIssue: prev.placeOfIssue || passDoc.placeOfIssue || passDoc.metadata?.placeOfIssue || "",
          };
          try {
            localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
      }

      // Populate CDC form ONLY if fields are currently empty or backend has non-empty values
      const cdcDoc = data.find((d: any) => d.type?.toLowerCase() === "cdc");
      if (cdcDoc) {
        setCdcForm((prev) => {
          const updated = {
            cdcNumber: prev.cdcNumber || cdcDoc.cdcNumber || cdcDoc.metadata?.cdcNumber || "",
            issueDate: prev.issueDate || cdcDoc.issueDate || cdcDoc.metadata?.issueDate || "",
            expiryDate: prev.expiryDate || cdcDoc.expiryDate || cdcDoc.metadata?.expiryDate || "",
            placeOfIssue: prev.placeOfIssue || cdcDoc.placeOfIssue || cdcDoc.metadata?.placeOfIssue || "",
          };
          try {
            localStorage.setItem(CDC_STORAGE_KEY, JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to load document registry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Restore persisted form data from localStorage
    try {
      const savedPass = localStorage.getItem(PASSPORT_STORAGE_KEY);
      if (savedPass) {
        const parsed = JSON.parse(savedPass);
        setPassportForm((prev) => ({ ...prev, ...parsed }));
      }
      const savedCdc = localStorage.getItem(CDC_STORAGE_KEY);
      if (savedCdc) {
        const parsed = JSON.parse(savedCdc);
        setCdcForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch (_) {}
    loadDocuments();
  }, []);

  // Validation Rules for Field-First Upload Flow
  const isPassportFieldsValid = Boolean(
    isPassportNumberValid(passportForm.passportNumber) &&
    passportForm.passportNumber.trim().length <= 8 &&
    passportForm.issueDate &&
    passportForm.expiryDate &&
    isPassportDateValid &&
    passportForm.placeOfIssue.trim()
  );

  const isCdcFieldsValid = Boolean(
    isCdcNumValid &&
    cdcForm.cdcNumber.trim() &&
    cdcForm.issueDate &&
    cdcForm.expiryDate &&
    isCdcDateValid &&
    cdcForm.placeOfIssue.trim()
  );

  const isCertFieldsValid = Boolean(
    certForm.courseName.trim() &&
    certForm.courseType &&
    certForm.durationFrom &&
    certForm.durationTo &&
    certForm.issueDate
  );

  // File Upload Helper
  const validateFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller file.");
      return false;
    }
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file format. Please upload PDF, JPG, or PNG.");
      return false;
    }
    return true;
  };

  // Submit Passport Upload
  const handleUploadPassport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPassportFieldsValid) {
      if (passportDateError) {
        alert(passportDateError);
      } else if (passportForm.passportNumber.length > 8) {
        alert("Passport Number must not exceed 8 characters.");
      } else {
        alert("Please complete all required Passport metadata fields correctly first.");
      }
      return;
    }
    if (!passportFile) {
      alert("Please select a Passport file to upload.");
      return;
    }
    if (!validateFile(passportFile)) return;

    // Snapshot form data to preserve exactly what user entered
    const preservedForm = { ...passportForm };
    try {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(preservedForm));
    } catch (_) {}

    setUploadingPassport(true);
    try {
      await documentService.uploadDocument(
        "passport",
        passportFile,
        preservedForm.expiryDate,
        undefined,
        preservedForm
      );
      setUploadingPassport(false);
      alert("Passport uploaded successfully!");
      setPassportFile(null);
      await loadDocuments();
      // Ensure entered fields are kept intact in form state
      setPassportForm({
        passportNumber: preservedForm.passportNumber,
        issueDate: preservedForm.issueDate,
        expiryDate: preservedForm.expiryDate,
        placeOfIssue: preservedForm.placeOfIssue,
      });
    } catch (err: any) {
      setUploadingPassport(false);
      const errorMsg = err.response?.data?.message || err.message || "Failed to upload Passport";
      alert(errorMsg);
    } finally {
      setUploadingPassport(false);
    }
  };

  // Submit CDC Upload
  const handleUploadCdc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCdcFieldsValid) {
      if (cdcDateError) {
        alert(cdcDateError);
      } else if (cdcNumError) {
        alert(cdcNumError);
      } else {
        alert("Please complete all required CDC metadata fields correctly first.");
      }
      return;
    }
    if (!cdcFile) {
      alert("Please select a CDC file to upload.");
      return;
    }
    if (!validateFile(cdcFile)) return;

    // Snapshot form data to preserve exactly what user entered
    const preservedForm = { ...cdcForm };
    try {
      localStorage.setItem(CDC_STORAGE_KEY, JSON.stringify(preservedForm));
    } catch (_) {}

    setUploadingCdc(true);
    try {
      await documentService.uploadDocument(
        "cdc",
        cdcFile,
        preservedForm.expiryDate,
        undefined,
        preservedForm
      );
      setUploadingCdc(false);
      alert("CDC uploaded successfully!");
      setCdcFile(null);
      await loadDocuments();
      // Ensure entered fields are kept intact in form state
      setCdcForm({
        cdcNumber: preservedForm.cdcNumber,
        issueDate: preservedForm.issueDate,
        expiryDate: preservedForm.expiryDate,
        placeOfIssue: preservedForm.placeOfIssue,
      });
    } catch (err: any) {
      setUploadingCdc(false);
      const errorMsg = err.response?.data?.message || err.message || "Failed to upload CDC";
      alert(errorMsg);
    } finally {
      setUploadingCdc(false);
    }
  };

  // Remove Document Handler (Passport or CDC)
  const handleRemoveDocument = async (doc: any, type: "passport" | "cdc") => {
    if (!doc) return;
    const label = type === "passport" ? "Passport" : "CDC";
    if (!confirm(`Are you sure you want to remove this ${label} file?`)) return;

    setRemovingId(doc.id);
    try {
      if (doc.id) {
        await documentService.deleteDocument(doc.id);
      }
      // Remove only this document record so UI immediately reflects removal
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      if (type === "passport") {
        setPassportFile(null);
      } else {
        setCdcFile(null);
      }
    } catch (err: any) {
      console.error(`Failed to delete ${type} document:`, err);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      if (type === "passport") {
        setPassportFile(null);
      } else {
        setCdcFile(null);
      }
    } finally {
      setRemovingId(null);
    }
  };

  // Submit Certificate Add or Edit
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCertFieldsValid) {
      alert("Please complete all required certificate fields first.");
      return;
    }

    if (!editingCertId && !certFile) {
      alert("Please select a certificate document file to upload.");
      return;
    }

    if (certFile && !validateFile(certFile)) return;

    setUploadingCert(true);
    try {
      if (editingCertId) {
        await documentService.updateDocument(editingCertId, certForm, certFile);
        setUploadingCert(false);
        alert("Certificate updated successfully!");
      } else {
        await documentService.uploadDocument(
          "certificate",
          certFile!,
          certForm.expiryDate || certForm.durationTo,
          undefined,
          certForm
        );
        setUploadingCert(false);
        alert("Certificate added successfully!");
      }

      setCertForm({
        courseName: "",
        courseType: "Basic",
        durationFrom: "",
        durationTo: "",
        issueDate: "",
        expiryDate: "",
      });
      setCertFile(null);
      setEditingCertId(null);
      setShowCertForm(false);
      await loadDocuments();
    } catch (err: any) {
      setUploadingCert(false);
      const errorMsg = err.response?.data?.message || err.message || "Failed to save certificate";
      alert(errorMsg);
    } finally {
      setUploadingCert(false);
    }
  };

  // Edit Certificate Trigger
  const handleStartEditCert = (cert: any) => {
    setEditingCertId(cert.id);
    setCertForm({
      courseName: cert.courseName || cert.metadata?.courseName || cert.label || "",
      courseType: cert.courseType || cert.metadata?.courseType || "Basic",
      durationFrom: cert.durationFrom || cert.metadata?.durationFrom || "",
      durationTo: cert.durationTo || cert.metadata?.durationTo || "",
      issueDate: cert.issueDate || cert.metadata?.issueDate || "",
      expiryDate: cert.expiryDate || cert.metadata?.expiryDate || "",
    });
    setCertFile(null);
    setShowCertForm(true);
  };

  // View Document (opens actual stored file in new tab)
  const handleView = async (doc: any) => {
    try {
      const data = await documentService.downloadDocument(doc.id);
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      } else {
        alert("Document file is unavailable.");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Document file is unavailable.");
    }
  };

  // Download Document (triggers real browser file download)
  const handleDownload = async (doc: any) => {
    setDownloadingId(doc.id);
    try {
      const data = await documentService.downloadDocument(doc.id);
      if (!data || !data.signedUrl) {
        alert("Document file is unavailable.");
        return;
      }

      const response = await fetch(data.signedUrl);
      if (!response.ok) {
        alert("Document file is unavailable.");
        return;
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = data.fileName || doc.label || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Document file is unavailable.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Delete Document
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document record?")) return;
    try {
      await documentService.deleteDocument(id);
      await loadDocuments();
    } catch (err: any) {
      alert(err.message || "Failed to delete document");
    }
  };


  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`h-64 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
          <div className={`h-64 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
        </div>
        <div className={`h-72 rounded-3xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
      </div>
    );
  }

  const activePassport = documents.find((d) => d.type?.toLowerCase() === "passport");
  const activeCdc = documents.find((d) => d.type?.toLowerCase() === "cdc");
  const certificatesList = documents.filter((d) => d.type?.toLowerCase() === "certificate" || d.type?.toLowerCase() === "stcw");

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Seafarer Document Management
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Manage your official Passport, CDC, and STCW course certificates with field-first verification.
        </p>
      </div>

      {/* 1. PASSPORT & CDC SECTION (Grid of 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* PASSPORT CARD */}
        <section className={`rounded-3xl border p-4 sm:p-5 shadow-sm flex flex-col justify-between h-full ${
          isDark ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-2.5 mb-3 ${isDark ? "border-slate-800/60" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold tracking-tight">Passport Credentials</h2>
                  <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Primary identification & nationality certificate</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUploadPassport} className="space-y-2.5">
              <div className="grid sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>Passport Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="e.g. Z1234567"
                    value={passportForm.passportNumber}
                    onChange={(e) => updatePassportField("passportNumber", e.target.value.toUpperCase().slice(0, 8))}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      if (pasted.length > 8) {
                        e.preventDefault();
                        updatePassportField("passportNumber", pasted.toUpperCase().slice(0, 8));
                      }
                    }}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>Place of Issue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai / RPO"
                    value={passportForm.placeOfIssue}
                    onChange={(e) => updatePassportField("placeOfIssue", e.target.value)}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>Date of Issue *</label>
                  <input
                    type="date"
                    required
                    value={passportForm.issueDate}
                    onChange={(e) => updatePassportField("issueDate", e.target.value)}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>Date of Expiry *</label>
                  <input
                    type="date"
                    required
                    min={getMinExpiryDate(passportForm.issueDate)}
                    value={passportForm.expiryDate}
                    onChange={(e) => updatePassportField("expiryDate", e.target.value)}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      passportDateError
                        ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
                        : isDark
                        ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
              </div>

              {passportDateError && (
                <p className="text-[11px] text-rose-500 font-semibold -mt-1">
                  {passportDateError}
                </p>
              )}

              {/* Field-First Upload Trigger */}
              <div className={`pt-2.5 border-t ${isDark ? "border-slate-800/60" : "border-slate-100"}`}>
                <div className="min-h-[18px] mb-2 flex items-center">
                  {!isPassportFieldsValid ? (
                    <p className={`text-[11px] font-medium flex items-center gap-1.5 leading-tight ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                      <Clock className="w-3.5 h-3.5 shrink-0" /> Complete all required Passport fields above to enable file selection.
                    </p>
                  ) : (
                    <p className={`text-[11px] font-medium flex items-center gap-1.5 leading-tight ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                      <FileCheck className="w-3.5 h-3.5 shrink-0" /> All required Passport fields complete.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <label className={`flex-1 w-full py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    !isPassportFieldsValid
                      ? isDark ? "opacity-50 cursor-not-allowed border-slate-700 bg-slate-800/30 text-slate-500" : "opacity-50 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : isDark
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer shadow-sm"
                      : "border-blue-200 bg-blue-50 text-[#3b71cb] hover:bg-blue-100 cursor-pointer shadow-sm"
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{passportFile ? passportFile.name : "SELECT PASSPORT FILE"}</span>
                    <input
                      type="file"
                      disabled={!isPassportFieldsValid}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPassportFile(file);
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!isPassportFieldsValid || !passportFile || uploadingPassport}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
                      isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                    }`}
                  >
                    {uploadingPassport ? "Uploading..." : activePassport ? "Replace Passport" : "Save & Upload"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Active Passport Card Action Footer or Pending Placeholder */}
          {activePassport ? (
            <div className={`mt-3 p-2 sm:p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
              isDark ? "bg-slate-900/80 border-slate-800/90 shadow-inner" : "bg-slate-50 border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className={`font-bold block truncate max-w-[180px] sm:max-w-[220px] text-xs ${isDark ? "text-slate-100" : "text-slate-900"}`}>{activePassport.label}</span>
                  <span className={`text-[10px] block ${isDark ? "text-slate-400" : "text-slate-500"}`}>Current Uploaded Document</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleView(activePassport)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  title="View Passport"
                >
                  <Eye className="w-3 h-3 text-cyan-400" /> View
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(activePassport)}
                  disabled={downloadingId === activePassport.id}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  title="Download Passport"
                >
                  {downloadingId === activePassport.id ? (
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3 h-3 text-cyan-400" />
                  )}
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(activePassport, "passport")}
                  disabled={removingId === activePassport.id}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50"
                      : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300"
                  }`}
                  title="Remove Passport"
                >
                  <Trash2 className="w-3 h-3 text-rose-500" /> {removingId === activePassport.id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ) : (
            <div className={`mt-3 p-2 sm:p-2.5 rounded-xl border border-dashed flex items-center justify-between gap-2 text-xs ${
              isDark ? "border-slate-800/80 bg-slate-900/30 text-slate-500" : "border-slate-200 bg-slate-50/50 text-slate-400"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${isDark ? "bg-slate-800/60 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium truncate">No passport document uploaded yet</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200/70 text-slate-500"
              }`}>
                Pending
              </span>
            </div>
          )}
        </section>

        {/* CDC CARD */}
        <section className={`rounded-3xl border p-4 sm:p-5 shadow-sm flex flex-col justify-between h-full ${
          isDark ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-2.5 mb-3 ${isDark ? "border-slate-800/60" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold tracking-tight">CDC Booklet (Continuous Discharge)</h2>
                  <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Official record of seafarer sea service</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUploadCdc} className="space-y-2.5">
              <div className="grid sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>CDC Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="e.g. MUM123456"
                    value={cdcForm.cdcNumber}
                    onChange={(e) => updateCdcField("cdcNumber", e.target.value.toUpperCase().slice(0, 8))}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      if (pasted.length > 8) {
                        e.preventDefault();
                        updateCdcField("cdcNumber", pasted.toUpperCase().slice(0, 8));
                      }
                    }}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>Place of Issue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai / MMD"
                    value={cdcForm.placeOfIssue}
                    onChange={(e) => updateCdcField("placeOfIssue", e.target.value)}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>Date of Issue *</label>
                  <input
                    type="date"
                    required
                    value={cdcForm.issueDate}
                    onChange={(e) => updateCdcField("issueDate", e.target.value)}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-700"}`}>Date of Expiry *</label>
                  <input
                    type="date"
                    required
                    min={getMinExpiryDate(cdcForm.issueDate)}
                    value={cdcForm.expiryDate}
                    onChange={(e) => updateCdcField("expiryDate", e.target.value)}
                    className={`w-full px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                      cdcDateError
                        ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
                        : isDark
                        ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                    }`}
                  />
                </div>
              </div>

              {cdcDateError && (
                <p className="text-[11px] text-rose-500 font-semibold -mt-1">
                  {cdcDateError}
                </p>
              )}

              {/* Field-First Upload Trigger */}
              <div className={`pt-2.5 border-t ${isDark ? "border-slate-800/60" : "border-slate-100"}`}>
                <div className="min-h-[18px] mb-2 flex items-center">
                  {!isCdcFieldsValid ? (
                    <p className={`text-[11px] font-medium flex items-center gap-1.5 leading-tight ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                      <Clock className="w-3.5 h-3.5 shrink-0" /> Complete all required CDC fields above to enable file selection.
                    </p>
                  ) : (
                    <p className={`text-[11px] font-medium flex items-center gap-1.5 leading-tight ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                      <FileCheck className="w-3.5 h-3.5 shrink-0" /> All required CDC fields complete.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <label className={`flex-1 w-full py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    !isCdcFieldsValid
                      ? isDark ? "opacity-50 cursor-not-allowed border-slate-700 bg-slate-800/30 text-slate-500" : "opacity-50 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : isDark
                      ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 cursor-pointer shadow-sm"
                      : "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer shadow-sm"
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{cdcFile ? cdcFile.name : "SELECT CDC FILE"}</span>
                    <input
                      type="file"
                      disabled={!isCdcFieldsValid}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setCdcFile(file);
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!isCdcFieldsValid || !cdcFile || uploadingCdc}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
                      isDark ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {uploadingCdc ? "Uploading..." : activeCdc ? "Replace CDC" : "Save & Upload"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Active CDC Card Action Footer or Pending Placeholder */}
          {activeCdc ? (
            <div className={`mt-3 p-2 sm:p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
              isDark ? "bg-slate-900/80 border-slate-800/90 shadow-inner" : "bg-slate-50 border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className={`font-bold block truncate max-w-[180px] sm:max-w-[220px] text-xs ${isDark ? "text-slate-100" : "text-slate-900"}`}>{activeCdc.label}</span>
                  <span className={`text-[10px] block ${isDark ? "text-slate-400" : "text-slate-500"}`}>Current Uploaded Document</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleView(activeCdc)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  title="View CDC"
                >
                  <Eye className="w-3 h-3 text-cyan-400" /> View
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(activeCdc)}
                  disabled={downloadingId === activeCdc.id}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  title="Download CDC"
                >
                  {downloadingId === activeCdc.id ? (
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3 h-3 text-cyan-400" />
                  )}
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(activeCdc, "cdc")}
                  disabled={removingId === activeCdc.id}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50"
                      : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300"
                  }`}
                  title="Remove CDC"
                >
                  <Trash2 className="w-3 h-3 text-rose-500" /> {removingId === activeCdc.id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ) : (
            <div className={`mt-3 p-2 sm:p-2.5 rounded-xl border border-dashed flex items-center justify-between gap-2 text-xs ${
              isDark ? "border-slate-800/80 bg-slate-900/30 text-slate-500" : "border-slate-200 bg-slate-50/50 text-slate-400"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${isDark ? "bg-slate-800/60 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium truncate">No CDC booklet uploaded yet</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200/70 text-slate-500"
              }`}>
                Pending
              </span>
            </div>
          )}
        </section>

      </div>

      {/* 2. CERTIFICATES SECTION (Multi-Certificate Repository) */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-black tracking-tight">STCW & Safety Course Certificates</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingCertId(null);
              setCertForm({
                courseName: "",
                courseType: "Basic",
                durationFrom: "",
                durationTo: "",
                issueDate: "",
                expiryDate: "",
              });
              setCertFile(null);
              setShowCertForm(!showCertForm);
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
            }`}
          >
            <Plus className="w-4 h-4" /> Add New Certificate
          </button>
        </div>

        {/* Add / Edit Certificate Form Container */}
        {showCertForm && (
          <form onSubmit={handleSaveCertificate} className={`mb-6 p-6 rounded-2xl border space-y-4 animate-fadeIn ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex justify-between items-center border-b border-slate-800/40 pb-2">
              <h3 className="font-bold text-sm">
                {editingCertId ? "Edit Certificate Details" : "Add New STCW Certificate"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCertForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-800"}`}>Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basic Safety Training (BST)"
                  value={certForm.courseName}
                  onChange={(e) => setCertForm({ ...certForm, courseName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                    isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-800"}`}>Course Type *</label>
                <select
                  value={certForm.courseType}
                  onChange={(e) => setCertForm({ ...certForm, courseType: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border outline-none cursor-pointer transition-all shadow-sm ${
                    isDark ? "bg-[#0b182d] border-slate-700 text-white focus:border-cyan-400" : "bg-white border-slate-300 text-slate-900 focus:border-[#3b71cb]"
                  }`}
                >
                  <option value="Basic">Basic</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Refresher">Refresher</option>
                  <option value="Other STCW">Other STCW</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-800"}`}>Issue Date *</label>
                <input
                  type="date"
                  required
                  value={certForm.issueDate}
                  onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                    isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-800"}`}>Start Date *</label>
                <input
                  type="date"
                  required
                  value={certForm.durationFrom}
                  onChange={(e) => setCertForm({ ...certForm, durationFrom: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                    isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-800"}`}>End Date *</label>
                <input
                  type="date"
                  required
                  value={certForm.durationTo}
                  onChange={(e) => setCertForm({ ...certForm, durationTo: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                    isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-200" : "text-slate-800"}`}>Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={certForm.expiryDate}
                  onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border outline-none transition-all shadow-sm ${
                    isDark ? "bg-[#0b182d] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#3b71cb] focus:ring-1 focus:ring-blue-500/30"
                  }`}
                />
              </div>
            </div>

            {/* Field-First File Upload Box */}
            <div className="pt-2 border-t border-slate-800/40">
              {!isCertFieldsValid && (
                <p className="text-[10px] text-amber-400 font-semibold mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Complete all required certificate metadata fields above to enable file selection.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <label className={`flex-1 w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  !isCertFieldsValid
                    ? "opacity-50 cursor-not-allowed border-slate-700 bg-slate-800/30 text-slate-500"
                    : isDark
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
                    : "border-blue-200 bg-blue-50 text-[#3b71cb] hover:bg-blue-100 cursor-pointer"
                }`}>
                  <Upload className="w-4 h-4" />
                  {certFile ? certFile.name : editingCertId ? "REPLACE CERTIFICATE FILE (OPTIONAL)" : "SELECT CERTIFICATE FILE *"}
                  <input
                    type="file"
                    disabled={!isCertFieldsValid}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCertFile(file);
                    }}
                  />
                </label>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={!isCertFieldsValid || (!editingCertId && !certFile) || uploadingCert}
                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                    }`}
                  >
                    {uploadingCert ? "Saving..." : editingCertId ? "Save Changes" : "Upload Certificate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCertForm(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Certificates Table Registry */}
        {certificatesList.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 ${
            isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50/50"
          }`}>
            <CloudLightning className="w-10 h-10 text-slate-500 mb-3" />
            <h3 className="text-sm font-bold text-slate-400">No Certificates Added Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[300px] leading-relaxed">
              Click "+ Add New Certificate" above to record your STCW course qualifications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-black border-b uppercase tracking-widest text-[10px] ${
                  isDark ? "text-slate-200 border-slate-800" : "text-slate-800 border-slate-200"
                }`}>
                  <th className="pb-3.5 pr-4">Course Name</th>
                  <th className="pb-3.5 pr-4">Course Type</th>
                  <th className="pb-3.5 pr-4">Start Date</th>
                  <th className="pb-3.5 pr-4">End Date</th>
                  <th className="pb-3.5 pr-4">Issue Date</th>
                  <th className="pb-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {certificatesList.map((cert) => {
                  const courseName = cert.courseName || cert.metadata?.courseName || cert.label || cert.name;
                  const courseType = cert.courseType || cert.metadata?.courseType || "Basic";
                  const durFrom = cert.durationFrom || cert.metadata?.durationFrom || cert.startDate || cert.metadata?.startDate;
                  const durTo = cert.durationTo || cert.metadata?.durationTo || cert.endDate || cert.metadata?.endDate;
                  const issueDt = cert.issueDate || cert.metadata?.issueDate;

                  return (
                    <tr key={cert.id} className={`hover:bg-slate-500/5 transition-colors ${
                      isDark ? "border-b border-slate-900/60 text-white" : "border-b border-slate-100 text-slate-900"
                    }`}>
                      <td className={`py-4 pr-4 font-bold max-w-[220px] truncate ${isDark ? "text-slate-100" : "text-slate-900"}`} title={courseName}>
                        {courseName}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          isDark ? "text-cyan-400" : "text-[#3b71cb]"
                        }`}>
                          {courseType}
                        </span>
                      </td>
                      <td className={`py-4 pr-4 font-semibold whitespace-nowrap ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {formatTableDate(durFrom)}
                      </td>
                      <td className={`py-4 pr-4 font-semibold whitespace-nowrap ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {formatTableDate(durTo)}
                      </td>
                      <td className={`py-4 pr-4 font-semibold whitespace-nowrap ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {formatTableDate(issueDt) !== "—" ? formatTableDate(issueDt) : (cert.uploadedAt ? formatTableDate(cert.uploadedAt) : "—")}
                      </td>
                      <td className="py-4 text-right flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(cert)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                            isDark ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                          title="View Certificate"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(cert)}
                          disabled={downloadingId === cert.id}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                            isDark ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                          title="Download Certificate"
                        >
                          {downloadingId === cert.id ? (
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEditCert(cert)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                            isDark ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                          title="Edit Certificate Details"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cert.id)}
                          className={`p-2 rounded-xl border flex items-center justify-center text-red-500 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            isDark ? "border-slate-800 bg-slate-900/40 hover:bg-red-500/10" : "border-slate-200 bg-slate-50 hover:bg-red-50"
                          }`}
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
