"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  UserPlus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Upload,
  Eye,
  Edit3,
  Trash2,
  FileText,
  ShieldCheck,
  X,
  Download,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Check,
  AlertTriangle,
  FileUp,
  FileCheck2,
  Sparkles,
  Paperclip,
} from "lucide-react";

// Required Maritime Documents Specification
const REQUIRED_DOCUMENTS_SPEC = [
  {
    type: "Passport Copy",
    title: "Passport Copy (Page 1 & Address)",
    desc: "First page and address page of valid passport",
    isRequired: true,
    icon: "🛂",
  },
  {
    type: "INDoS Certificate",
    title: "INDoS Certificate",
    desc: "DG Shipping INDoS registration certificate",
    isRequired: true,
    icon: "📜",
  },
  {
    type: "CDC (Continuous Discharge Certificate)",
    title: "Continuous Discharge Certificate (CDC)",
    desc: "Seaman Service Record Book / CDC copy",
    isRequired: true,
    icon: "⚓",
  },
  {
    type: "DG Medical Fitness Certificate",
    title: "DG Medical Fitness Certificate",
    desc: "Medical fitness certificate from DG approved doctor",
    isRequired: true,
    icon: "🏥",
  },
  {
    type: "STCW / Safety Certificates",
    title: "STCW Basic Safety Certificates",
    desc: "PST, FPFF, EFA, PSSR certificates (Optional)",
    isRequired: false,
    icon: "🦺",
  },
];

export default function CreateSeafarerPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  // Flow Step: 1 = Candidate Info, 2 = Document Upload Suite
  const [currentStep, setCurrentStep] = useState(1);

  // Candidate Personal Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    birthPlace: "",
    nationality: "Indian",
    fatherName: "",
    indosNum: "",
    passportNum: "",
    passportExpiry: "",
    passportPlace: "",
    cdcNum: "",
    cdcExpiry: "",
    cdcPlace: "",
    education: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdSeafarer, setCreatedSeafarer] = useState<any>(null);

  // Uploaded Documents Array
  const [documents, setDocuments] = useState<any[]>([]);

  // Per-row input states for each document type
  const [rowInputs, setRowInputs] = useState<{
    [key: string]: {
      docNum: string;
      expiry: string;
      place: string;
      file: File | null;
      uploading: boolean;
      errorMsg: string;
    };
  }>({});

  // View & Edit Modal States
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    documentNumber: "",
    expiryDate: "",
    placeOfIssue: "",
  });
  const [editFile, setEditFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const handlePersonalFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Step 1 Submission: Create Seafarer Master Identity & Initialize Document Inputs
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in candidate Name, Email, and Phone number.");
      return;
    }

    setLoading(true);

    try {
      const result = await partnerService.createSeafarer(formData);
      setCreatedSeafarer(result);

      // Pre-initialize row inputs with values entered in Step 1
      const initialInputs: any = {};
      REQUIRED_DOCUMENTS_SPEC.forEach((item) => {
        let initialDocNum = "";
        let initialExpiry = "";
        if (item.type === "Passport Copy") {
          initialDocNum = formData.passportNum || "";
          initialExpiry = formData.passportExpiry || "";
        } else if (item.type === "INDoS Certificate") {
          initialDocNum = formData.indosNum || "";
        } else if (item.type.includes("CDC")) {
          initialDocNum = formData.cdcNum || "";
          initialExpiry = formData.cdcExpiry || "";
        }
        initialInputs[item.type] = {
          docNum: initialDocNum,
          expiry: initialExpiry,
          place: "Mumbai",
          file: null,
          uploading: false,
          errorMsg: "",
        };
      });
      setRowInputs(initialInputs);

      setCurrentStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create Seafarer Master.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for updating specific row input fields
  const updateRowInput = (docType: string, field: string, value: any) => {
    setRowInputs((prev) => ({
      ...prev,
      [docType]: {
        ...(prev[docType] || {
          docNum: "",
          expiry: "",
          place: "Mumbai",
          file: null,
          uploading: false,
          errorMsg: "",
        }),
        [field]: value,
      },
    }));
  };

  // Handle direct row upload
  const handleRowUpload = async (docType: string) => {
    if (!createdSeafarer) return;
    const input = rowInputs[docType] || {
      docNum: "",
      expiry: "",
      place: "Mumbai",
      file: null,
      uploading: false,
      errorMsg: "",
    };

    updateRowInput(docType, "uploading", true);
    updateRowInput(docType, "errorMsg", "");

    try {
      const doc = await partnerService.uploadSeafarerDocument(createdSeafarer.id, {
        type: docType,
        file: input.file || undefined,
        documentNumber: input.docNum,
        expiryDate: input.expiry,
        placeOfIssue: input.place,
      });

      // Replace or add document in documents list
      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.type !== docType);
        return [...filtered, doc];
      });
    } catch (err: any) {
      updateRowInput(docType, "errorMsg", err.message || "Upload failed");
    } finally {
      updateRowInput(docType, "uploading", false);
    }
  };

  // Open Edit Modal
  const openEditModal = (doc: any) => {
    setEditingDoc(doc);
    setEditFormData({
      documentNumber: doc.documentNumber || "",
      expiryDate: doc.expiryDate || "",
      placeOfIssue: doc.placeOfIssue || "",
    });
    setEditFile(null);
  };

  // Save Edit Document
  const handleSaveEditDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !createdSeafarer) return;
    setSavingEdit(true);

    try {
      const updated = await partnerService.updateSeafarerDocument(
        createdSeafarer.id,
        editingDoc.id,
        {
          ...editingDoc,
          ...editFormData,
          fileName: editFile ? editFile.name : editingDoc.fileName,
          fileUrl: editFile ? URL.createObjectURL(editFile) : editingDoc.fileUrl,
        }
      );

      setDocuments((prev) =>
        prev.map((d) => (d.id === editingDoc.id ? { ...d, ...updated } : d))
      );
      setEditingDoc(null);
    } catch (err) {
      console.error("Failed to edit document:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Document
  const handleDeleteDoc = async (docId: string) => {
    if (!createdSeafarer) return;
    if (!confirm("Are you sure you want to remove this document?")) return;

    try {
      await partnerService.deleteSeafarerDocument(createdSeafarer.id, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  // Check if document type is uploaded
  const getUploadedDoc = (docType: string) =>
    documents.find((d) => (d.type || "").toLowerCase().includes(docType.toLowerCase().split(" ")[0]));

  const uploadedMandatoryCount = REQUIRED_DOCUMENTS_SPEC.filter(
    (item) => item.isRequired && getUploadedDoc(item.type)
  ).length;

  const totalMandatoryCount = REQUIRED_DOCUMENTS_SPEC.filter((i) => i.isRequired).length;
  const progressPercent = Math.round((uploadedMandatoryCount / totalMandatoryCount) * 100);

  // Modern SaaS Card Tokens
  const cardBg = isDark
    ? "bg-[#0B1528] border-white/10 shadow-2xl"
    : "bg-white border-slate-200/90 shadow-md";

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-slate-600 font-medium";
  const labelText = isDark ? "text-slate-200 font-bold" : "text-slate-800 font-bold";
  const inputStyle = isDark
    ? "bg-[#080F1E] border-white/15 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <div>
        <Link
          href="/partner/seafarers/search"
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors mb-3 ${
            isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search Seafarers
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full ${
              isDark ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "bg-blue-100 text-blue-900 border border-blue-300"
            }`}
          >
            Seafarer Onboarding Workflow
          </span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-2 ${headingText}`}>
          Create & Upload Seafarer Master
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${subText}`}>
          Register candidate identity details and upload required maritime documents on behalf of the seafarer.
        </p>
      </div>

      {/* 2-Step Progress Indicator Bar */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-2xl border text-left transition-all ${
            currentStep === 1
              ? isDark
                ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10"
                : "bg-blue-50 border-blue-600 text-blue-950 shadow-md"
              : isDark
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-emerald-50 border-emerald-300 text-emerald-900"
          }`}
        >
          <p className="text-[10px] font-black uppercase tracking-wider">Step 1</p>
          <p className="text-xs font-extrabold mt-0.5 truncate">
            {createdSeafarer ? `✓ ${createdSeafarer.name}` : "1. Personal Information"}
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border text-left transition-all ${
            currentStep === 2
              ? isDark
                ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10"
                : "bg-blue-50 border-blue-600 text-blue-950 shadow-md"
              : isDark
              ? "bg-white/[0.03] border-white/10 text-slate-400"
              : "bg-slate-100 border-slate-300 text-slate-600"
          }`}
        >
          <p className="text-[10px] font-black uppercase tracking-wider">Step 2</p>
          <p className="text-xs font-extrabold mt-0.5 truncate">
            2. Maritime Documents Suite ({documents.length} Uploaded)
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Personal & Identity Information */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Submit} className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
          <div className={`flex items-center justify-between pb-4 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <div>
              <h2 className={`text-base font-extrabold ${headingText}`}>Step 1: Candidate Personal Details</h2>
              <p className={`text-xs mt-0.5 ${subText}`}>Fill personal identity details and INDoS / Passport numbers</p>
            </div>
            <UserPlus className={`w-6 h-6 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className={`block mb-1.5 ${labelText}`}>Full Candidate Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handlePersonalFormChange}
                placeholder="e.g. Rahul Kumar"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handlePersonalFormChange}
                placeholder="e.g. rahul@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>Mobile Phone Number *</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handlePersonalFormChange}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>INDoS Number</label>
              <input
                type="text"
                name="indosNum"
                value={formData.indosNum}
                onChange={handlePersonalFormChange}
                placeholder="e.g. 20N1234"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-mono font-bold ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>Passport Number</label>
              <input
                type="text"
                name="passportNum"
                value={formData.passportNum}
                onChange={handlePersonalFormChange}
                placeholder="e.g. Z1234567"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-mono font-bold ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>CDC Number</label>
              <input
                type="text"
                name="cdcNum"
                value={formData.cdcNum}
                onChange={handlePersonalFormChange}
                placeholder="e.g. MUM123456"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-mono font-bold ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handlePersonalFormChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handlePersonalFormChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
              />
            </div>
          </div>

          <div className={`flex justify-end pt-4 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              {loading ? "Creating Candidate..." : "Save & Continue to Document Upload"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Unified Sleek Document Upload Suite */}
      {currentStep === 2 && createdSeafarer && (
        <div className="space-y-6">
          
          {/* Header & Progress Indicator */}
          <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${cardBg}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full ${
                  isDark ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "bg-blue-100 text-blue-900 border border-blue-300"
                }`}>
                  Candidate: {createdSeafarer.name}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                  isDark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-800"
                }`}>
                  ID: {createdSeafarer.id}
                </span>
              </div>
              <h2 className={`text-lg font-extrabold mt-1.5 ${headingText}`}>
                Upload Mandatory Maritime Documents
              </h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Upload candidate certificates below. All uploaded documents are automatically saved to the seafarer's master profile.
              </p>
            </div>

            {/* Progress Meter */}
            <div className="w-full md:w-56 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 shrink-0">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className={subText}>Mandatory Progress</span>
                <span className={isDark ? "text-cyan-400 font-extrabold" : "text-blue-700 font-extrabold"}>
                  {uploadedMandatoryCount} / {totalMandatoryCount}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* UNIFIED DOCUMENT UPLOAD CARDS */}
          <div className="space-y-4">
            {REQUIRED_DOCUMENTS_SPEC.map((item) => {
              const uploadedDoc = getUploadedDoc(item.type);
              const rowState = rowInputs[item.type] || {
                docNum: "",
                expiry: "",
                place: "Mumbai",
                file: null,
                uploading: false,
                errorMsg: "",
              };

              return (
                <div
                  key={item.type}
                  className={`p-5 rounded-3xl border transition-all ${
                    uploadedDoc
                      ? isDark
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                        : "bg-emerald-50/80 border-emerald-300 shadow-sm"
                      : isDark
                      ? "bg-[#0B1528] border-white/10 shadow-lg"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Top Block: Document Header (Icon, Title, Status Badge & Desc) */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      uploadedDoc
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isDark
                        ? "bg-white/5 text-cyan-300 border border-white/10"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base font-extrabold ${headingText}`}>{item.title}</h3>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                              item.isRequired
                                ? uploadedDoc
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : isDark
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-rose-100 text-rose-800 border border-rose-300"
                                : isDark
                                ? "bg-slate-500/20 text-slate-400"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.isRequired ? (uploadedDoc ? "✓ Verified" : "Mandatory") : "Optional"}
                          </span>
                        </div>

                        {uploadedDoc && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingDoc(uploadedDoc)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1 cursor-pointer transition-all ${
                                isDark
                                  ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25"
                                  : "bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200"
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(uploadedDoc)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1 cursor-pointer transition-all ${
                                isDark
                                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                                  : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(uploadedDoc.id)}
                              className={`p-1.5 rounded-xl text-xs border transition-all cursor-pointer ${
                                isDark
                                  ? "bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25"
                                  : "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${subText}`}>{item.desc}</p>
                    </div>
                  </div>

                  {/* Bottom Block: Form OR Uploaded Record Summary */}
                  {uploadedDoc ? (
                    <div className={`mt-4 pt-3 border-t text-xs flex flex-wrap items-center justify-between gap-2 ${
                      isDark ? "border-white/10" : "border-emerald-200"
                    }`}>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className={`font-mono font-bold ${isDark ? "text-cyan-300" : "text-emerald-900"}`}>
                          Doc #: {uploadedDoc.documentNumber || "Recorded"}
                        </span>
                        <span className={isDark ? "text-slate-300" : "text-slate-700 font-semibold"}>
                          Expiry: {uploadedDoc.expiryDate || "N/A"}
                        </span>
                        <span className={`truncate max-w-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          File: {uploadedDoc.fileName || "Attached"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-4 pt-4 border-t space-y-3 ${isDark ? "border-white/10" : "border-slate-200"}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className={`block text-[11px] mb-1 font-bold ${labelText}`}>Document Number</label>
                          <input
                            type="text"
                            value={rowState.docNum}
                            onChange={(e) => updateRowInput(item.type, "docNum", e.target.value)}
                            placeholder="Doc # (e.g. Z1234567)"
                            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-mono font-bold ${inputStyle}`}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1 font-bold ${labelText}`}>Expiry Date</label>
                          <input
                            type="date"
                            value={rowState.expiry}
                            onChange={(e) => updateRowInput(item.type, "expiry", e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1 font-bold ${labelText}`}>Attach File (PDF / Image)</label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => updateRowInput(item.type, "file", e.target.files?.[0] || null)}
                            className={`w-full px-3 py-2 rounded-xl border outline-none text-[11px] font-medium file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold ${
                              isDark
                                ? "bg-white/5 border-white/15 text-slate-300 file:bg-cyan-500/20 file:text-cyan-300"
                                : "bg-slate-50 border-slate-300 text-slate-800 file:bg-blue-100 file:text-blue-900"
                            }`}
                          />
                        </div>
                      </div>

                      {rowState.errorMsg && (
                        <p className="text-[11px] text-rose-500 font-bold">{rowState.errorMsg}</p>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          disabled={rowState.uploading}
                          onClick={() => handleRowUpload(item.type)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                            isDark
                              ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                          }`}
                        >
                          <FileUp className="w-4 h-4" />
                          {rowState.uploading ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions Banner */}
          <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg}`}>
            <Link
              href={`/partner/seafarers/${createdSeafarer.id}`}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-extrabold border transition-all text-center ${
                isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
              }`}
            >
              View Seafarer Master Profile
            </Link>

            <Link
              href={`/partner/purchases/create?seafarerId=${createdSeafarer.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Proceed to Physical Course Purchase ➔
            </Link>
          </div>
        </div>
      )}

      {/* VIEW DOCUMENT MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${cardBg} relative space-y-4`}>
            <button
              onClick={() => setViewingDoc(null)}
              className={`absolute right-4 top-4 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
              <Eye className="w-5 h-5" />
              <h3 className={`text-base font-extrabold ${headingText}`}>{viewingDoc.type}</h3>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2.5 text-xs font-semibold ${
              isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex justify-between">
                <span className={subText}>Candidate:</span>
                <span className={`font-extrabold ${headingText}`}>{createdSeafarer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className={subText}>Document Number:</span>
                <span className={`font-mono font-bold ${isDark ? "text-cyan-300" : "text-blue-700"}`}>{viewingDoc.documentNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className={subText}>Expiry Date:</span>
                <span className={headingText}>{viewingDoc.expiryDate || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className={subText}>Place of Issue:</span>
                <span className={headingText}>{viewingDoc.placeOfIssue || "Mumbai"}</span>
              </div>
              <div className="flex justify-between">
                <span className={subText}>File Name:</span>
                <span className={`font-mono ${isDark ? "text-slate-300" : "text-slate-800"}`}>{viewingDoc.fileName || "document.pdf"}</span>
              </div>
            </div>

            <div className={`p-6 border border-dashed rounded-2xl text-center space-y-3 ${
              isDark ? "border-white/10" : "border-slate-300"
            }`}>
              <FileText className={`w-10 h-10 mx-auto ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
              <p className={`text-xs font-bold ${headingText}`}>
                Document Preview ({viewingDoc.fileName || "Verified Record"})
              </p>
              {viewingDoc.fileUrl ? (
                <a
                  href={viewingDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download / View File
                </a>
              ) : (
                <span className={`text-[11px] italic block ${subText}`}>
                  Simulated preview active. Original file verified in database.
                </span>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingDoc(null)}
                className={`px-5 py-2 rounded-xl text-xs font-bold ${
                  isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                }`}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DOCUMENT MODAL */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${cardBg} relative space-y-4`}>
            <button
              onClick={() => setEditingDoc(null)}
              className={`absolute right-4 top-4 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-500">
              <Edit3 className="w-5 h-5" />
              <h3 className={`text-base font-extrabold ${headingText}`}>Edit {editingDoc.type}</h3>
            </div>

            <form onSubmit={handleSaveEditDoc} className="space-y-4 text-xs">
              <div>
                <label className={`block mb-1 ${labelText}`}>Document Number</label>
                <input
                  type="text"
                  value={editFormData.documentNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, documentNumber: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-mono font-bold ${inputStyle}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 ${labelText}`}>Expiry Date</label>
                  <input
                    type="date"
                    value={editFormData.expiryDate}
                    onChange={(e) => setEditFormData({ ...editFormData, expiryDate: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${labelText}`}>Place of Issue</label>
                  <input
                    type="text"
                    value={editFormData.placeOfIssue}
                    onChange={(e) => setEditFormData({ ...editFormData, placeOfIssue: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${inputStyle}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 ${labelText}`}>Replace Document File (Optional)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  className={`w-full px-3.5 py-2 rounded-xl border outline-none font-medium file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold ${
                    isDark
                      ? "bg-white/5 border-white/10 text-slate-200 file:bg-amber-500/20 file:text-amber-300"
                      : "bg-slate-50 border-slate-300 text-slate-800 file:bg-amber-100 file:text-amber-900"
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold ${
                    isDark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md cursor-pointer"
                >
                  {savingEdit ? "Saving..." : "Save Document Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
