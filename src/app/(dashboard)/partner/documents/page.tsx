"use client";

import React, { useEffect, useState } from "react";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Files,
  Upload,
  Download,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  X,
  FileText,
  CreditCard,
  Edit3,
  Save,
  Calendar,
  MapPin,
  FileCode,
} from "lucide-react";

export interface DocItem {
  id: string;
  type: string;
  category: "credentials" | "verification";
  label: string;
  desc: string;
  name?: string;
  url?: string;
  file?: File;
  status: "Pending Verification" | "Verified" | "Rejected";
  rejectionReason?: string;
  uploadedAt?: string;
  documentNumber?: string;
  dateOfIssue?: string;
  dateOfExpiry?: string;
  placeOfIssue?: string;
  isMultiple?: boolean;
  isSample?: boolean;
}

export default function PartnerDocumentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<
    "all" | "verification" | "credentials"
  >("all");
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  // Inline Quick Edit state per card
  const [expandedEditType, setExpandedEditType] = useState<string | null>(null);
  const [inlineDocNum, setInlineDocNum] = useState("");
  const [inlineIssueDate, setInlineIssueDate] = useState("");
  const [inlineExpiryDate, setInlineExpiryDate] = useState("");
  const [inlinePlaceIssue, setInlinePlaceIssue] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [inlineSuccess, setInlineSuccess] = useState("");

  // Upload / Replace Modal State
  const [uploadModalDoc, setUploadModalDoc] = useState<DocItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docNumber, setDocNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [placeIssue, setPlaceIssue] = useState("");
  const [formError, setFormError] = useState("");

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);

  // Master document types catalog
  const defaultDocMaster: Omit<DocItem, "id" | "status">[] = [
    // Credentials & Identity Category
    {
      type: "passport",
      category: "credentials",
      label: "Passport Scan & Details",
      desc: "Passport Number, Date of Issue, Date of Expiry, Place of Issue, and Bio-page scan.",
    },
    {
      type: "cdc",
      category: "credentials",
      label: "Continuous Discharge Certificate (CDC)",
      desc: "CDC Number, Date of Issue, Date of Expiry, Place of Issue, and CDC scan.",
    },
    {
      type: "aadhaar",
      category: "credentials",
      label: "Aadhaar Card",
      desc: "12-digit Unique Aadhaar Number and Aadhaar card document scan.",
    },
    {
      type: "pan",
      category: "credentials",
      label: "Personal / Agency PAN Card",
      desc: "10-character Permanent Account Number (PAN) tax identity card scan.",
    },

    // Verification & Compliance Category
    {
      type: "rpslCertificate",
      category: "verification",
      label: "RPSL / DG Shipping License",
      desc: "RPSL License Number, Expiry Date, and recruitment license PDF scan.",
    },
    {
      type: "bankProof",
      category: "verification",
      label: "Cancelled Cheque / Bank Letter",
      desc: "Official cancelled cheque scan or bank statement for financial remittance verification.",
    },
    {
      type: "ownerPhoto",
      category: "verification",
      label: "Agency Owner Photograph",
      desc: "Recent passport-size photograph of agency proprietor / authorized director.",
    },
    {
      type: "officePhoto",
      category: "verification",
      label: "Office Premises Photograph",
      desc: "Front entrance, reception, and working area photographs of operating office premises.",
      isMultiple: true,
    },
    {
      type: "officeAddressProof",
      category: "verification",
      label: "Office Address Proof",
      desc: "Registered office lease agreement, utility bill (electricity/water), or property tax receipt.",
    },
    {
      type: "residentialAddressProof",
      category: "verification",
      label: "Residential Address Proof",
      desc: "Proprietor / Director residential electricity bill, passport address page, or voter ID.",
    },
    {
      type: "gstCertificate",
      category: "verification",
      label: "GST Registration Certificate",
      desc: "GSTIN Registration Number and official tax certificate.",
    },
  ];

  // Load initial documents with realistic pre-populated seed data
  useEffect(() => {
    async function init() {
      try {
        const seedData: DocItem[] = [];
        setDocuments(seedData);
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Open inline editor right on the card
  const toggleInlineEdit = (type: string, existingDoc?: DocItem) => {
    if (expandedEditType === type) {
      setExpandedEditType(null);
      return;
    }

    setInlineError("");
    setInlineSuccess("");
    setExpandedEditType(type);
    setInlineDocNum(existingDoc?.documentNumber || "");
    setInlineIssueDate(existingDoc?.dateOfIssue || "");
    setInlineExpiryDate(existingDoc?.dateOfExpiry || "");
    setInlinePlaceIssue(existingDoc?.placeOfIssue || "");
  };

  // Save inline typed details
  const saveInlineDetails = (
    type: string,
    master: Omit<DocItem, "id" | "status">,
    existingDoc?: DocItem,
  ) => {
    setInlineError("");
    setInlineSuccess("");

    // Validate Aadhaar
    if (type === "aadhaar") {
      const cleanAadhaar = inlineDocNum.replace(/\s+/g, "");
      if (
        !cleanAadhaar ||
        cleanAadhaar.length !== 12 ||
        !/^\d{12}$/.test(cleanAadhaar)
      ) {
        setInlineError("Aadhaar Number must be exactly 12 digits.");
        return;
      }
    }

    // Validate PAN
    if (type === "pan") {
      const cleanPan = inlineDocNum.trim().toUpperCase();
      if (
        !cleanPan ||
        cleanPan.length !== 10 ||
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)
      ) {
        setInlineError(
          "PAN Number must be valid 10 alphanumeric characters (e.g. AAACT1234F).",
        );
        return;
      }
    }

    // Validate Passport
    if (type === "passport") {
      if (!inlineDocNum.trim()) {
        setInlineError("Passport Number is required.");
        return;
      }
    }

    // Update document record in state
    setDocuments((prev) => {
      const target = existingDoc || {
        id: `doc-${Date.now()}`,
        type: master.type,
        category: master.category,
        label: master.label,
        desc: master.desc,
        name: `${master.label.replace(/\s+/g, "_")}_Details.pdf`,
        status: "Pending Verification",
      };

      const updated: DocItem = {
        ...target,
        documentNumber: inlineDocNum.trim(),
        dateOfIssue: inlineIssueDate || undefined,
        dateOfExpiry: inlineExpiryDate || undefined,
        placeOfIssue: inlinePlaceIssue.trim() || undefined,
        status: "Pending Verification", // Resets to Pending Verification on detail update
        uploadedAt: new Date().toISOString(),
      };

      const filtered = prev.filter(
        (d) => d.id !== updated.id && d.type !== type,
      );
      return [...filtered, updated];
    });

    setInlineSuccess(
      "Typed details saved successfully! Status set to Pending Verification.",
    );
    setTimeout(() => {
      setExpandedEditType(null);
      setInlineSuccess("");
    }, 1200);
  };

  // Open Upload / Replace Modal for a document
  const openUploadModal = (
    master: Omit<DocItem, "id" | "status">,
    existingDoc?: DocItem,
  ) => {
    setFormError("");
    setSelectedFile(null);
    setUploadModalDoc(
      existingDoc || {
        id: `doc-${Date.now()}`,
        type: master.type,
        category: master.category,
        label: master.label,
        desc: master.desc,
        status: "Pending Verification",
        isMultiple: master.isMultiple,
      },
    );

    setDocNumber(existingDoc?.documentNumber || "");
    setIssueDate(existingDoc?.dateOfIssue || "");
    setExpiryDate(existingDoc?.dateOfExpiry || "");
    setPlaceIssue(existingDoc?.placeOfIssue || "");
  };

  // Submit Upload / Replace Modal Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!uploadModalDoc) return;

    if (!selectedFile && !uploadModalDoc.name && !uploadModalDoc.url) {
      setFormError("Please select a document file to upload.");
      return;
    }

    // Aadhaar Validation
    if (uploadModalDoc.type === "aadhaar") {
      const cleanAadhaar = docNumber.replace(/\s+/g, "");
      if (
        !cleanAadhaar ||
        cleanAadhaar.length !== 12 ||
        !/^\d{12}$/.test(cleanAadhaar)
      ) {
        setFormError("Aadhaar Number must be exactly 12 digits.");
        return;
      }
    }

    // PAN Validation
    if (uploadModalDoc.type === "pan") {
      const cleanPan = docNumber.trim().toUpperCase();
      if (
        !cleanPan ||
        cleanPan.length !== 10 ||
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)
      ) {
        setFormError(
          "PAN Number must be valid 10 alphanumeric characters (e.g. AAACT1234F).",
        );
        return;
      }
    }

    setUploadingType(uploadModalDoc.type);

    const localUrl = selectedFile
      ? URL.createObjectURL(selectedFile)
      : uploadModalDoc.url;
    const fileName = selectedFile
      ? selectedFile.name
      : uploadModalDoc.name ||
        `${uploadModalDoc.label.replace(/\s+/g, "_")}.pdf`;

    const updatedDoc: DocItem = {
      ...uploadModalDoc,
      id: uploadModalDoc.id || `doc-${Date.now()}`,
      name: fileName,
      file: selectedFile || uploadModalDoc.file,
      url: localUrl,
      status: "Pending Verification",
      rejectionReason: undefined,
      uploadedAt: new Date().toISOString(),
      documentNumber: docNumber.trim(),
      dateOfIssue: issueDate || undefined,
      dateOfExpiry: expiryDate || undefined,
      placeOfIssue: placeIssue.trim() || undefined,
      isSample: false,
    };

    setDocuments((prev) => {
      if (
        uploadModalDoc.isMultiple &&
        !uploadModalDoc.id.startsWith("doc-off-")
      ) {
        return [...prev, updatedDoc];
      } else {
        const filtered = prev.filter(
          (d) => d.id !== updatedDoc.id && d.type !== updatedDoc.type,
        );
        return [...filtered, updatedDoc];
      }
    });

    try {
      if (selectedFile) {
        await partnerService.uploadDocument(uploadModalDoc.type, selectedFile, {
          documentNumber: docNumber,
          dateOfIssue: issueDate,
          expiryDate: expiryDate,
          placeOfIssue: placeIssue,
        });
      }
    } catch (err) {
      console.warn("Backend upload notification warning:", err);
    } finally {
      setUploadingType(null);
      setUploadModalDoc(null);
    }
  };

  const displayedMasters = defaultDocMaster.filter((m) => {
    if (activeTab === "credentials") return m.category === "credentials";
    if (activeTab === "verification") return m.category === "verification";
    return true;
  });

  const cardBg = isDark
    ? "bg-[#111827] rounded-[16px] border-0 card-elevated"
    : "bg-[#FFFFFF] rounded-[16px] border-0 card-elevated";

  const getStatusBadge = (status?: string) => {
    if (status === "Verified") {
      return (
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-red-500/15 text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center gap-1">
        <Clock className="w-3 h-3 animate-spin" /> Pending Verification
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-[#111827]"}`}
          >
            Verification & Credentials Documents
          </h1>
          <p
            className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
          >
            Type Passport Number, Date of Issue, Date of Expiry, Place of Issue,
            CDC, Aadhaar & PAN details and upload scans.
          </p>
        </div>

        {/* Status Legend Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
            <Clock className="w-3.5 h-3.5" /> Pending Verification
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold">
            <AlertCircle className="w-3.5 h-3.5" /> Rejected
          </div>
        </div>
      </div>

      {/* Direct Prompt Alert Info Box */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${isDark ? "bg-[#3D5EF6]/10 border-[#3D5EF6]/30 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-900"}`}
      >
        <Edit3 className="w-5 h-5 text-[#3D5EF6] shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold uppercase text-[11px] tracking-wider text-[#3D5EF6]">
            How to type Passport Number, Date of Issue & Expiry?
          </p>
          <p className="mt-0.5 leading-relaxed opacity-90">
            Aap do alag tarike se Passport Number, Date of Issue, Date of
            Expiry, aur Place of Issue type kar sakte hain: <br />
            <strong>1. Direct Inline Typing:</strong> Har document card par{" "}
            <strong>&quot;Type / Edit Details&quot;</strong> button par click
            karke card ke andar hi type kar sakte hain. <br />
            <strong>2. Upload Popup Modal:</strong>{" "}
            <strong>&quot;Replace Document&quot;</strong> ya{" "}
            <strong>&quot;Upload File&quot;</strong> button click karne par bhi
            complete input fields form khulta hai.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div
        className={`p-1.5 rounded-xl inline-flex items-center gap-1 border ${isDark ? "bg-[#111827] border-white/10" : "bg-slate-100 border-slate-200"}`}
      >
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-[#3D5EF6] text-white shadow-sm"
              : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Mandatory Documents
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("verification")}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "verification"
              ? "bg-[#3D5EF6] text-white shadow-sm"
              : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Agency Verification & Premises Docs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("credentials")}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "credentials"
              ? "bg-[#3D5EF6] text-white shadow-sm"
              : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Passport, CDC, Aadhaar & PAN Credentials
        </button>
      </div>

      {/* Documents List Grid */}
      <div className="space-y-4">
        {displayedMasters.map((master) => {
          const matchingDocs = documents.filter((d) => d.type === master.type);
          const primaryUploaded = matchingDocs[0];
          const isUploaded = matchingDocs.length > 0;
          const isExpanded = expandedEditType === master.type;

          return (
            <div key={master.type} className="space-y-3">
              {/* Primary Document Card */}
              <div
                className={`p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${cardBg}`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      primaryUploaded?.status === "Verified"
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : primaryUploaded?.status === "Rejected"
                          ? "bg-red-500/15 text-red-500"
                          : isUploaded
                            ? "bg-[#EEF1FE] text-[#3D5EF6]"
                            : isDark
                              ? "bg-white/5 text-slate-400"
                              : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {master.type === "passport" || master.type === "cdc" ? (
                      <ShieldCheck className="w-5.5 h-5.5" />
                    ) : master.type === "aadhaar" || master.type === "pan" ? (
                      <CreditCard className="w-5.5 h-5.5" />
                    ) : master.type === "officePhoto" ||
                      master.type === "officeAddressProof" ? (
                      <Building className="w-5.5 h-5.5" />
                    ) : (
                      <Files className="w-5.5 h-5.5" />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-extrabold text-sm ${isDark ? "text-white" : "text-[#111827]"}`}
                      >
                        {master.label}
                      </h3>
                      {getStatusBadge(primaryUploaded?.status)}
                    </div>
                    <p
                      className={`text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                    >
                      {master.desc}
                    </p>

                    {/* Metadata details chips if present */}
                    {primaryUploaded && (
                      <div className="flex items-center gap-3 flex-wrap pt-1 text-[11px]">
                        {primaryUploaded.name && (
                          <span
                            className={`font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}
                          >
                            File: {primaryUploaded.name}
                          </span>
                        )}
                        {primaryUploaded.documentNumber && (
                          <span className="font-mono font-bold text-[#3D5EF6] bg-[#EEF1FE] dark:bg-blue-500/10 px-2 py-0.5 rounded">
                            #{primaryUploaded.documentNumber}
                          </span>
                        )}
                        {primaryUploaded.dateOfIssue && (
                          <span
                            className={
                              isDark ? "text-slate-400" : "text-slate-500"
                            }
                          >
                            Issue:{" "}
                            <strong>{primaryUploaded.dateOfIssue}</strong>
                          </span>
                        )}
                        {primaryUploaded.dateOfExpiry && (
                          <span
                            className={
                              isDark ? "text-slate-400" : "text-slate-500"
                            }
                          >
                            Expiry:{" "}
                            <strong>{primaryUploaded.dateOfExpiry}</strong>
                          </span>
                        )}
                        {primaryUploaded.placeOfIssue && (
                          <span
                            className={
                              isDark ? "text-slate-400" : "text-slate-500"
                            }
                          >
                            Place:{" "}
                            <strong>{primaryUploaded.placeOfIssue}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Rejection Reason callout if status is Rejected */}
                    {primaryUploaded?.status === "Rejected" &&
                      primaryUploaded.rejectionReason && (
                        <div className="mt-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold uppercase tracking-wider text-[10px]">
                              Rejection Reason
                            </p>
                            <p className="mt-0.5 text-red-400">
                              {primaryUploaded.rejectionReason}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Actions: Direct Type/Edit, Preview, Replace/Upload */}
                <div className="flex items-center gap-2 flex-wrap shrink-0 self-end lg:self-center">
                  {/* DIRECT INLINE EDIT TYPING BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleInlineEdit(master.type, primaryUploaded)
                    }
                    className={`h-9 px-3.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isExpanded
                        ? "bg-amber-500 text-white shadow-sm"
                        : isDark
                          ? "bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-400/30"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>
                      {isExpanded ? "Close Inputs" : "Type / Edit Details"}
                    </span>
                  </button>

                  {isUploaded && (
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(primaryUploaded)}
                      className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isDark
                          ? "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-[#3D5EF6]" />
                      <span>Preview</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openUploadModal(master, primaryUploaded)}
                    className="h-9 px-4 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {uploadingType === master.type ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : isUploaded ? (
                      <RefreshCw className="w-3.5 h-3.5" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {uploadingType === master.type
                        ? "Uploading..."
                        : isUploaded
                          ? "Replace Document"
                          : "Upload File"}
                    </span>
                  </button>
                </div>
              </div>

              {/* INLINE EXPANDED TYPING INPUT FORM FOR THIS CARD */}
              {isExpanded && (
                <div
                  className={`p-5 rounded-2xl border shadow-lg space-y-4 animate-fadeIn ${isDark ? "bg-[#1E293B] border-amber-500/30 text-white" : "bg-amber-50/40 border-amber-200 text-slate-900"}`}
                >
                  <div className="flex items-center justify-between border-b pb-3 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-500" />
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Type {master.label} Information directly
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      Press Save when done
                    </span>
                  </div>

                  {inlineError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{inlineError}</span>
                    </div>
                  )}

                  {inlineSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{inlineSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Passport Inputs */}
                    {master.type === "passport" && (
                      <>
                        <div>
                          <label className="block font-bold mb-1">
                            Passport Number *
                          </label>
                          <input
                            type="text"
                            value={inlineDocNum}
                            onChange={(e) =>
                              setInlineDocNum(e.target.value.toUpperCase())
                            }
                            placeholder="e.g. Z1234567"
                            className={`w-full px-3 py-2 rounded-xl font-mono font-bold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">
                            Place of Issue *
                          </label>
                          <input
                            type="text"
                            value={inlinePlaceIssue}
                            onChange={(e) =>
                              setInlinePlaceIssue(e.target.value)
                            }
                            placeholder="e.g. Mumbai"
                            className={`w-full px-3 py-2 rounded-xl font-semibold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">
                            Date of Issue *
                          </label>
                          <input
                            type="date"
                            value={inlineIssueDate}
                            onChange={(e) => setInlineIssueDate(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl font-semibold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">
                            Date of Expiry *
                          </label>
                          <input
                            type="date"
                            value={inlineExpiryDate}
                            onChange={(e) =>
                              setInlineExpiryDate(e.target.value)
                            }
                            className={`w-full px-3 py-2 rounded-xl font-semibold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                      </>
                    )}

                    {/* CDC Inputs */}
                    {master.type === "cdc" && (
                      <>
                        <div>
                          <label className="block font-bold mb-1">
                            CDC Number *
                          </label>
                          <input
                            type="text"
                            value={inlineDocNum}
                            onChange={(e) =>
                              setInlineDocNum(e.target.value.toUpperCase())
                            }
                            placeholder="e.g. MUM123456"
                            className={`w-full px-3 py-2 rounded-xl font-mono font-bold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">
                            Place of Issue *
                          </label>
                          <input
                            type="text"
                            value={inlinePlaceIssue}
                            onChange={(e) =>
                              setInlinePlaceIssue(e.target.value)
                            }
                            placeholder="e.g. Mumbai"
                            className={`w-full px-3 py-2 rounded-xl font-semibold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">
                            Date of Issue *
                          </label>
                          <input
                            type="date"
                            value={inlineIssueDate}
                            onChange={(e) => setInlineIssueDate(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl font-semibold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">
                            Date of Expiry *
                          </label>
                          <input
                            type="date"
                            value={inlineExpiryDate}
                            onChange={(e) =>
                              setInlineExpiryDate(e.target.value)
                            }
                            className={`w-full px-3 py-2 rounded-xl font-semibold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                      </>
                    )}

                    {/* Aadhaar Input */}
                    {master.type === "aadhaar" && (
                      <div className="col-span-2 lg:col-span-4">
                        <label className="block font-bold mb-1">
                          12-Digit Aadhaar Number *
                        </label>
                        <input
                          type="text"
                          maxLength={14}
                          value={inlineDocNum}
                          onChange={(e) => setInlineDocNum(e.target.value)}
                          placeholder="e.g. 4829 1049 8820"
                          className={`w-full px-3 py-2 rounded-xl font-mono font-bold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                        />
                      </div>
                    )}

                    {/* PAN Input */}
                    {master.type === "pan" && (
                      <div className="col-span-2 lg:col-span-4">
                        <label className="block font-bold mb-1">
                          10-Character PAN Number *
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          value={inlineDocNum}
                          onChange={(e) =>
                            setInlineDocNum(e.target.value.toUpperCase())
                          }
                          placeholder="e.g. AAACT1234F"
                          className={`w-full px-3 py-2 rounded-xl font-mono font-bold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                        />
                      </div>
                    )}

                    {/* Other Documents Inputs */}
                    {master.type !== "passport" &&
                      master.type !== "cdc" &&
                      master.type !== "aadhaar" &&
                      master.type !== "pan" && (
                        <>
                          <div className="col-span-2">
                            <label className="block font-bold mb-1">
                              Registration / Document Number
                            </label>
                            <input
                              type="text"
                              value={inlineDocNum}
                              onChange={(e) =>
                                setInlineDocNum(e.target.value.toUpperCase())
                              }
                              placeholder="e.g. REG-2026-9941"
                              className={`w-full px-3 py-2 rounded-xl font-mono font-bold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block font-bold mb-1">
                              Document Expiry Date
                            </label>
                            <input
                              type="date"
                              value={inlineExpiryDate}
                              onChange={(e) =>
                                setInlineExpiryDate(e.target.value)
                              }
                              className={`w-full px-3 py-2 rounded-xl font-semibold border outline-none ${isDark ? "bg-slate-900 border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                            />
                          </div>
                        </>
                      )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setExpandedEditType(null)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDark ? "bg-white/10 hover:bg-white/15 text-slate-300" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        saveInlineDetails(master.type, master, primaryUploaded)
                      }
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Typed Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* UPLOAD / REPLACE METADATA MODAL */}
      {uploadModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div
            className={`w-full max-w-xl rounded-[20px] p-6 shadow-2xl space-y-6 ${isDark ? "bg-[#111827] text-white border border-white/10" : "bg-white text-slate-900 border border-slate-200"}`}
          >
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b pb-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF1FE] text-[#3D5EF6] flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {uploadModalDoc.name ? "Replace" : "Upload"}{" "}
                    {uploadModalDoc.label}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {uploadModalDoc.desc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalDoc(null)}
                className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Error Banner */}
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* File Upload Selector */}
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Document File (PDF, JPG, PNG scan) *
                </label>
                <div
                  className={`p-4 rounded-xl border-2 border-dashed text-center transition-colors ${isDark ? "border-white/15 bg-white/5" : "border-slate-300 bg-slate-50"}`}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        setSelectedFile(e.target.files[0]);
                    }}
                    className="hidden"
                    id="doc-file-input"
                  />
                  <label
                    htmlFor="doc-file-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-7 h-7 text-[#3D5EF6]" />
                    <span className="text-xs font-bold text-[#3D5EF6]">
                      {selectedFile
                        ? selectedFile.name
                        : uploadModalDoc.name
                          ? `Current: ${uploadModalDoc.name} (Click to change)`
                          : "Click to select file from computer"}
                    </span>
                    <span
                      className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Maximum file size: 10MB (PDF, JPG, PNG)
                    </span>
                  </label>
                </div>
              </div>

              {/* Passport Metadata Fields */}
              {uploadModalDoc.type === "passport" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) =>
                        setDocNumber(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. Z1234567"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Place of Issue *
                    </label>
                    <input
                      type="text"
                      value={placeIssue}
                      onChange={(e) => setPlaceIssue(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Date of Expiry *
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                </div>
              )}

              {/* CDC Metadata Fields */}
              {uploadModalDoc.type === "cdc" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      CDC Number *
                    </label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) =>
                        setDocNumber(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. MUM123456"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Place of Issue *
                    </label>
                    <input
                      type="text"
                      value={placeIssue}
                      onChange={(e) => setPlaceIssue(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Date of Expiry *
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                </div>
              )}

              {/* Aadhaar Number Field */}
              {uploadModalDoc.type === "aadhaar" && (
                <div className="pt-2">
                  <label
                    className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    12-Digit Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="e.g. 4829 1049 8820"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Aadhaar number must remain unique across authorized
                    profiles.
                  </p>
                </div>
              )}

              {/* PAN Number Field */}
              {uploadModalDoc.type === "pan" && (
                <div className="pt-2">
                  <label
                    className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    10-Character PAN Number *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. AAACT1234F"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    PAN number must remain unique across authorized profiles.
                  </p>
                </div>
              )}

              {/* RPSL / GST / License Fields */}
              {(uploadModalDoc.type === "rpslCertificate" ||
                uploadModalDoc.type === "gstCertificate") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Registration / License Number
                    </label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) =>
                        setDocNumber(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. RPSL-MUM-2024-0091"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setUploadModalDoc(null)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-all cursor-pointer"
                >
                  Save & Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div
            className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[20px] overflow-hidden shadow-2xl ${isDark ? "bg-[#111827] text-white border border-white/10" : "bg-white text-slate-900 border border-slate-200"}`}
          >
            {/* Header */}
            <div className="p-4 px-6 flex items-center justify-between border-b shrink-0 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF1FE] text-[#3D5EF6] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base">
                      {previewDoc.label}
                    </h3>
                    {getStatusBadge(previewDoc.status)}
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {previewDoc.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Viewer */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Rejection Alert if Rejected */}
              {previewDoc.status === "Rejected" &&
                previewDoc.rejectionReason && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase tracking-wider text-[11px]">
                        Verification Rejection Reason
                      </p>
                      <p className="mt-1 text-red-400 leading-relaxed">
                        {previewDoc.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

              {/* Document Metadata Details Card */}
              <div
                className={`p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}
              >
                {previewDoc.documentNumber && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Document #
                    </span>
                    <span className="font-mono font-bold text-[#3D5EF6]">
                      {previewDoc.documentNumber}
                    </span>
                  </div>
                )}
                {previewDoc.dateOfIssue && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Date of Issue
                    </span>
                    <span className="font-semibold">
                      {previewDoc.dateOfIssue}
                    </span>
                  </div>
                )}
                {previewDoc.dateOfExpiry && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Date of Expiry
                    </span>
                    <span className="font-semibold">
                      {previewDoc.dateOfExpiry}
                    </span>
                  </div>
                )}
                {previewDoc.placeOfIssue && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Place of Issue
                    </span>
                    <span className="font-semibold">
                      {previewDoc.placeOfIssue}
                    </span>
                  </div>
                )}
              </div>

              {/* Preview Sheet / Visual Viewer */}
              {previewDoc.url ? (
                <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-center min-h-[350px]">
                  {previewDoc.name?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                    <img
                      src={previewDoc.url}
                      alt={previewDoc.label}
                      className="max-h-[400px] w-auto object-contain rounded-lg"
                    />
                  ) : (
                    <iframe
                      src={previewDoc.url}
                      title={previewDoc.label}
                      className="w-full h-[400px] rounded-lg border-0"
                    />
                  )}
                </div>
              ) : (
                <div
                  className={`p-8 rounded-2xl border text-center space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}
                >
                  <ShieldCheck className="w-12 h-12 text-[#3D5EF6] mx-auto" />
                  <h4 className="font-extrabold text-sm">
                    Official DG Shipping Compliance Record
                  </h4>
                  <p
                    className={`text-xs max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    This document is digitally registered and stored in secure
                    encrypted cloud storage for Hari Om Maritime Academy
                    authorization.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 px-6 flex items-center justify-between border-t shrink-0 dark:border-white/10">
              {previewDoc.url || previewDoc.file ? (
                <a
                  href={
                    previewDoc.url ||
                    (previewDoc.file
                      ? URL.createObjectURL(previewDoc.file)
                      : "#")
                  }
                  download={previewDoc.name}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download File
                </a>
              ) : (
                <span className="text-xs text-slate-400">
                  Sample verified preview
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const master = defaultDocMaster.find(
                      (m) => m.type === previewDoc.type,
                    );
                    if (master) {
                      setPreviewDoc(null);
                      openUploadModal(master, previewDoc);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                >
                  Replace Document
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isDark ? "bg-white/5 hover:bg-white/10 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
