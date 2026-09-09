"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  FileText,
  ShoppingCart,
  GraduationCap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Upload,
  Eye,
  Edit3,
  Trash2,
  Plus,
  X,
  Download,
} from "lucide-react";

export default function SeafarerProfilePage() {
  const params = useParams();
  const seafarerId = params.id as string;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [seafarer, setSeafarer] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Upload Form State
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadDocType, setUploadDocType] = useState("Passport Copy");
  const [uploadDocNum, setUploadDocNum] = useState("");
  const [uploadExpiry, setUploadExpiry] = useState("");
  const [uploadPlace, setUploadPlace] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    async function loadData() {
      try {
        const [profile, docs] = await Promise.all([
          partnerService.getSeafarerById(seafarerId),
          partnerService.getSeafarerDocuments(seafarerId),
        ]);
        setSeafarer(profile);
        setDocuments(docs || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load seafarer profile.");
      } finally {
        setLoading(false);
      }
    }
    if (seafarerId) {
      loadData();
    }
  }, [seafarerId]);

  // Handle Upload
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const doc = await partnerService.uploadSeafarerDocument(seafarerId, {
        type: uploadDocType,
        file: uploadFile || undefined,
        documentNumber: uploadDocNum,
        expiryDate: uploadExpiry,
        placeOfIssue: uploadPlace,
      });
      setDocuments((prev) => [...prev, doc]);
      setShowUploadForm(false);
      setUploadDocNum("");
      setUploadExpiry("");
      setUploadPlace("");
      setUploadFile(null);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
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

  // Save Edit
  const handleSaveEditDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    setSavingEdit(true);
    try {
      const updated = await partnerService.updateSeafarerDocument(seafarerId, editingDoc.id, {
        ...editingDoc,
        ...editFormData,
        fileName: editFile ? editFile.name : editingDoc.fileName,
        fileUrl: editFile ? URL.createObjectURL(editFile) : editingDoc.fileUrl,
      });

      setDocuments((prev) => prev.map((d) => (d.id === editingDoc.id ? { ...d, ...updated } : d)));
      setEditingDoc(null);
    } catch (err) {
      console.error("Save edit error:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Document
  const handleDeleteDoc = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await partnerService.deleteSeafarerDocument(seafarerId, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error("Delete doc error:", err);
    }
  };

  const cardBg = isDark
    ? "bg-[#09162c]/90 border-white/10 shadow-lg"
    : "bg-white border-slate-200 shadow-sm";

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300" : "text-slate-600";
  const labelText = isDark ? "text-slate-200 font-bold" : "text-slate-800 font-bold";
  const inputStyle = isDark
    ? "bg-[#0B1528] border-white/15 text-white placeholder-slate-400 focus:border-cyan-400"
    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-600";

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-200 dark:bg-white/5" />
        <div className="h-44 rounded-3xl bg-slate-200 dark:bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
        </div>
      </div>
    );
  }

  if (error || !seafarer) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-sm font-bold text-rose-500">{error || "Seafarer not found."}</p>
        <Link
          href="/partner/seafarers"
          className={`mt-4 inline-flex items-center gap-2 text-xs font-extrabold ${
            isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Seafarer Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/partner/seafarers"
            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors mb-2 ${
              isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Seafarer Directory
          </Link>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 ${headingText}`}>
            {seafarer.name}
          </h1>
        </div>

        <Link
          href={`/partner/purchases/create?seafarerId=${seafarer.id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all shrink-0 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          Enroll in Physical Course
        </Link>
      </div>

      {/* Identity Overview Banner */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-black uppercase shrink-0 shadow-lg shadow-blue-500/25">
            {seafarer.name ? seafarer.name.split(" ").map((n: any) => n[0]).join("") : "SM"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className={`text-lg font-extrabold ${headingText}`}>{seafarer.name}</h2>
              <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border ${
                isDark ? "bg-white/5 text-slate-200 border-white/10" : "bg-slate-100 text-slate-800 border-slate-300"
              }`}>
                Master ID: {seafarer.id}
              </span>
            </div>

            {/* Maritime Identity Badges */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t text-xs ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <div>
                <p className={`text-[10px] font-bold ${subText}`}>INDoS Number</p>
                <p className={`font-mono font-extrabold mt-0.5 ${isDark ? "text-cyan-300" : "text-blue-700"}`}>{seafarer.indosNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] font-bold ${subText}`}>Passport Number</p>
                <p className={`font-mono font-extrabold mt-0.5 ${headingText}`}>{seafarer.passportNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] font-bold ${subText}`}>CDC Number</p>
                <p className={`font-mono font-extrabold mt-0.5 ${headingText}`}>{seafarer.cdcNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] font-bold ${subText}`}>Nationality</p>
                <p className={`font-extrabold mt-0.5 ${headingText}`}>{seafarer.nationality || "Indian"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seafarer Documents Section (Upload, View, Edit) */}
      <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <div>
            <h3 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
              <FileText className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} /> Maritime Documents & Certificates ({documents.length})
            </h3>
            <p className={`text-xs mt-0.5 font-medium ${subText}`}>
              Partner/Agent managed documents for candidate verification and DG Shipping requirements
            </p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className={`px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
          >
            <Plus className="w-4 h-4" /> {showUploadForm ? "Close Form" : "Upload New Document"}
          </button>
        </div>

        {/* Upload Form toggle */}
        {showUploadForm && (
          <form onSubmit={handleUploadDocument} className={`p-4.5 rounded-2xl border space-y-3 text-xs font-medium animate-fadeIn ${
            isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={`block mb-1 ${labelText}`}>Document Type</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-bold ${
                    isDark ? "bg-[#09162c] border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"
                  }`}
                >
                  <option value="Passport Copy">Passport Copy</option>
                  <option value="INDoS Certificate">INDoS Certificate</option>
                  <option value="CDC (Continuous Discharge Certificate)">CDC (Continuous Discharge Certificate)</option>
                  <option value="DG Medical Fitness Certificate">DG Medical Fitness Certificate</option>
                  <option value="STCW / Safety Certificates">STCW / Safety Certificates</option>
                  <option value="Educational Certificate">Educational Certificate</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 ${labelText}`}>Document Number</label>
                <input
                  type="text"
                  value={uploadDocNum}
                  onChange={(e) => setUploadDocNum(e.target.value)}
                  placeholder="Doc / Reg #"
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-mono font-bold ${inputStyle}`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${labelText}`}>Expiry Date</label>
                <input
                  type="date"
                  value={uploadExpiry}
                  onChange={(e) => setUploadExpiry(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-semibold ${inputStyle}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block mb-1 ${labelText}`}>Place of Issue</label>
                <input
                  type="text"
                  value={uploadPlace}
                  onChange={(e) => setUploadPlace(e.target.value)}
                  placeholder="Place of issue"
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-medium ${inputStyle}`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${labelText}`}>Upload File (PDF/Image)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className={`w-full px-3 py-1.5 rounded-xl border outline-none font-medium file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-extrabold ${
                    isDark 
                      ? "bg-white/5 border-white/10 text-slate-200 file:bg-cyan-500/20 file:text-cyan-300" 
                      : "bg-white border-slate-300 text-slate-800 file:bg-blue-100 file:text-blue-800"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
                  isDark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-800"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
              >
                {uploading ? "Uploading..." : "Save Document"}
              </button>
            </div>
          </form>
        )}

        {/* Documents Cards Grid */}
        {documents.length === 0 ? (
          <div className={`p-6 text-center border border-dashed rounded-xl text-xs font-semibold ${
            isDark ? "border-white/10 text-slate-400" : "border-slate-300 text-slate-500"
          }`}>
            No maritime documents uploaded yet for this candidate.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-4.5 rounded-2xl border flex flex-col justify-between space-y-3 ${
                  isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-extrabold text-xs truncate ${isDark ? "text-white" : "text-slate-900"}`}>{doc.type}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}>
                      {doc.status || "Verified"}
                    </span>
                  </div>
                  <p className={`text-xs font-mono font-bold mt-1 ${isDark ? "text-cyan-300" : "text-blue-700"}`}>
                    Doc #: {doc.documentNumber || "N/A"}
                  </p>
                  <div className={`flex items-center gap-3 text-[11px] font-medium mt-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    <span>Expiry: {doc.expiryDate || "N/A"}</span>
                    <span>Issue: {doc.placeOfIssue || "Mumbai"}</span>
                  </div>
                </div>

                {/* View, Edit, Delete Actions */}
                <div className={`flex items-center gap-2 pt-2 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
                  <button
                    type="button"
                    onClick={() => setViewingDoc(doc)}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-extrabold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isDark
                        ? "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(doc)}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-extrabold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isDark
                        ? "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30"
                        : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(doc.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                      isDark
                        ? "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/30"
                        : "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Contact & Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <h3 className={`text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2 ${
            isDark ? "text-cyan-400" : "text-blue-700"
          }`}>
            <Mail className="w-4 h-4" /> Contact Information
          </h3>
          <div className="space-y-3 text-xs font-medium">
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <span className={subText}>Email Address</span>
              <span className={`font-bold ${headingText}`}>{seafarer.email}</span>
            </div>
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <span className={subText}>Mobile Phone</span>
              <span className={`font-bold ${headingText}`}>{seafarer.phone}</span>
            </div>
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <span className={subText}>Date of Birth</span>
              <span className={`font-semibold ${headingText}`}>{seafarer.dob || "Not Provided"}</span>
            </div>
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <span className={subText}>Residential Address</span>
              <span className={`font-semibold text-right max-w-[220px] ${headingText}`}>
                {seafarer.address || "Not Provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Course Enrollments */}
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <h3 className={`text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2 ${
            isDark ? "text-cyan-400" : "text-blue-700"
          }`}>
            <GraduationCap className="w-4 h-4" /> Physical Course Enrollments ({seafarer.enrollments?.length || 0})
          </h3>
          {seafarer.enrollments && seafarer.enrollments.length > 0 ? (
            <div className="space-y-3">
              {seafarer.enrollments.map((enr: any) => (
                <div
                  key={enr.id}
                  className={`p-3.5 rounded-xl border text-xs ${
                    isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-extrabold ${headingText}`}>{enr.courseName}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}>
                      {enr.status}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between mt-1.5 text-[11px] font-medium ${subText}`}>
                    <span>{enr.trainingType}</span>
                    <span>Enrolled: {new Date(enr.enrollmentDate).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 text-center border border-dashed rounded-xl text-xs font-semibold ${
              isDark ? "border-white/10 text-slate-400" : "border-slate-300 text-slate-500"
            }`}>
              No physical enrollments yet.
            </div>
          )}
        </div>
      </div>

      {/* Unified Multi-source Purchase History (Direct vs Partner) */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base font-extrabold ${headingText}`}>Unified Course Purchase History</h3>
            <p className={`text-xs font-medium ${subText}`}>
              Courses purchased across all sources (Direct Hari Om and authorized partners)
            </p>
          </div>
          <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded border ${
            isDark ? "bg-white/5 text-slate-200 border-white/10" : "bg-slate-100 text-slate-800 border-slate-300"
          }`}>
            Total Courses: {seafarer.purchases?.length || 0}
          </span>
        </div>

        {seafarer.purchases && seafarer.purchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.04] text-slate-300 border-b border-white/10" : "bg-slate-100 text-slate-700 border-b border-slate-300"}>
                <tr>
                  <th className="py-3 px-3.5 font-bold">Purchase ID</th>
                  <th className="py-3 px-3.5 font-bold">Course Program</th>
                  <th className="py-3 px-3.5 font-bold">Training Type</th>
                  <th className="py-3 px-3.5 font-bold">Purchase Source</th>
                  <th className="py-3 px-3.5 font-bold">Date</th>
                  <th className="py-3 px-3.5 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-slate-200"}`}>
                {seafarer.purchases.map((p: any) => (
                  <tr key={p.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}>
                    <td className={`py-3 px-3.5 font-mono font-bold ${isDark ? "text-cyan-400" : "text-blue-700"}`}>{p.id}</td>
                    <td className={`py-3 px-3.5 font-extrabold ${headingText}`}>{p.courseName}</td>
                    <td className={`py-3 px-3.5 font-medium ${subText}`}>Physical Training</td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          p.purchaseSource === "Direct"
                            ? isDark
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-purple-100 text-purple-900 border border-purple-300"
                            : isDark
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-blue-100 text-blue-900 border border-blue-300"
                        }`}
                      >
                        {p.purchaseSource === "Direct" ? "Direct Hari Om" : "Partner Channel"}
                      </span>
                    </td>
                    <td className={`py-3 px-3.5 font-medium ${subText}`}>
                      {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}>
                        {p.purchaseStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`p-8 text-center text-xs font-semibold ${subText}`}>
            No course purchases recorded for this Seafarer Master yet.
          </div>
        )}
      </div>

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
                <span className={`font-extrabold ${headingText}`}>{seafarer?.name}</span>
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
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md"
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
