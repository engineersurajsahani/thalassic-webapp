"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  ShoppingCart,
  GraduationCap,
  CheckCircle2,
  Ship,
  Edit2,
  X,
  Receipt,
  Award,
} from "lucide-react";

export default function SeafarerProfilePage() {
  const params = useParams();
  const seafarerId = params.id as string;
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [seafarer, setSeafarer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tab State: 5 tabs in exact specified order
  const [activeTab, setActiveTab] = useState<
    "overview" | "info" | "certificates" | "vessels" | "purchases"
  >("overview");

  // Edit details modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    rank: "",
    department: "",
    phone: "",
    email: "",
    status: "",
    address: "",
  });

  // Partner edit permission check
  const canEdit = !user || user.role === "PARTNER" || user.role === "AGENT" || user.role === "ADMIN" || user.role === "COMPANY_ADMIN" || user.role === "MASTER_ADMIN";

  useEffect(() => {
    async function loadData() {
      try {
        const data: any = await partnerService.getSeafarerById(seafarerId);
        
        // Enrich with baseline maritime data if missing from mock backend
        const enriched = {
          ...data,
          rank: data.rank || "Master",
          department: data.department || "Deck",
          status: data.status || "Active",
          address: data.address || "Flat 402, Sea Breeze Apts, Bandra West, Mumbai, India",
          dob: data.dob || "1978-05-14",
          indosNum: data.indosNum || "15GL2849",
          passportNum: data.passportNum || "Z3902184",
          cdcNum: data.cdcNum || "MUM-892102",
          nationality: data.nationality || "Indian",
          phone: data.phone || "+91 98765 43210",
          email: data.email || "rajesh.kumar@thalassic.in",
          documents: data.documents || [
            { id: "doc1", name: "Certificate of Competency (CoC)", type: "CoC", status: "Approved", expiryDate: "2027-08-09" },
            { id: "doc2", name: "Seaman Book (CDC)", type: "CDC", status: "Approved", expiryDate: "2033-04-11" },
            { id: "doc3", name: "Passport", type: "Passport", status: "Approved", expiryDate: "2030-11-19" },
            { id: "doc4", name: "Medical Certificate (ENG1)", type: "Medical", status: "Expired", expiryDate: "2026-08-31" },
          ],
          seaService: data.seaService || [
            { id: "ss1", vesselName: "Thalassic Wave", vesselType: "Crude Oil Tanker", rank: "Master", signOn: "2025-01-15", signOff: "2025-06-15", duration: 151 },
            { id: "ss2", vesselName: "Pacific Ocean", vesselType: "Container Vessel", rank: "Chief Mate", signOn: "2024-03-01", signOff: "2024-09-01", duration: 184 },
          ],
          enrollments: data.enrollments || [],
          purchases: data.purchases || [],
        };

        setSeafarer(enriched);
        setEditForm({
          name: enriched.name || "",
          rank: enriched.rank || "Master",
          department: enriched.department || "Deck",
          phone: enriched.phone || "",
          email: enriched.email || "",
          status: enriched.status || "Active",
          address: enriched.address || "",
        });
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

  const handleSaveEdit = () => {
    setSeafarer((prev: any) => ({
      ...prev,
      name: editForm.name,
      rank: editForm.rank,
      department: editForm.department,
      phone: editForm.phone,
      email: editForm.email,
      status: editForm.status,
      address: editForm.address,
    }));
    setIsEditModalOpen(false);
  };

  const cardBg = isDark
    ? "bg-[#111827] rounded-[16px] border-0 card-elevated"
    : "bg-[#FFFFFF] rounded-[16px] border-0 card-elevated";

  if (loading) {
    return (
      <div className="space-y-6 mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-full bg-slate-200 dark:bg-white/5" />
        <div className="h-44 rounded-[16px] bg-slate-200 dark:bg-white/5" />
        <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-white/5" />
        <div className="h-64 rounded-[16px] bg-slate-200 dark:bg-white/5" />
      </div>
    );
  }

  if (error || !seafarer) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-sm font-semibold text-rose-400">{error || "Seafarer not found."}</p>
        <Link
          href="/partner/seafarers"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Seafarer Directory
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview Details" },
    { id: "info", label: "Seafarer Info" },
    { id: "certificates", label: "Certificates & CDC" },
    { id: "vessels", label: "Vessel Service & History" },
    { id: "purchases", label: "Documents & Purchases" },
  ];

  const certificates = seafarer.documents || [];
  const vesselDeployments = seafarer.seaService || [];
  const docOrders = seafarer.documentOrders || [
    {
      orderId: `DOC-${(seafarer.indosNum || "9021").slice(-4)}-01`,
      docName: "STCW Advanced Safety & Firefighting Package",
      amount: "₹4,500",
      date: "14/08/26",
      status: "Completed",
      inv: `INV-${(seafarer.indosNum || "9021").slice(-4)}-A`,
    },
    {
      orderId: `DOC-${(seafarer.indosNum || "9021").slice(-4)}-02`,
      docName: "Continuous Discharge Certificate (CDC) Endorsement",
      amount: "₹2,200",
      date: "28/07/26",
      status: "Completed",
      inv: `INV-${(seafarer.indosNum || "9021").slice(-4)}-B`,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* ─────────────────────────────────────────────────────────────
          1. Back button & Action Header (Kept exactly as-is)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs text-[#6B7280] dark:text-gray-400 mb-1 flex items-center gap-1.5">
            <span>Partner Portal</span>
            <span>&gt;</span>
            <span className="font-semibold text-[#111827] dark:text-white">Seafarer Profile</span>
          </div>
          <Link
            href="/partner/seafarers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#3D5EF6] transition-colors duration-200 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Seafarer Directory
          </Link>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 ${isDark ? "text-white" : "text-[#111827]"}`}>
            {seafarer.name}
          </h1>
        </div>

        <Link
          href={`/partner/purchases/create?seafarerId=${seafarer.id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors duration-200 shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          Enroll in Course
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Identity Overview Banner (Kept exactly as-is)
         ───────────────────────────────────────────────────────────── */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center text-xl font-black uppercase shrink-0 shadow-sm">
            {seafarer.name ? seafarer.name.split(" ").map((n: any) => n[0]).join("") : "SM"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.name}</h2>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border ${isDark ? "bg-white/5 text-slate-300 border-white/10" : "bg-[#FAFAFA] text-[#6B7280] border-[#E5E7EB]"}`}>
                Master ID: {seafarer.id}
              </span>
            </div>

            {/* Maritime Identity Badges */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t text-xs ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>INDoS Number</p>
                <p className="font-mono font-bold text-[#3D5EF6] mt-0.5">{seafarer.indosNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>Passport Number</p>
                <p className={`font-mono font-bold mt-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.passportNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>CDC Number</p>
                <p className={`font-mono font-bold mt-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.cdcNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>Nationality</p>
                <p className={`font-bold mt-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.nationality || "Indian"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB BAR NAVIGATION (Underline Style, No Overflow)
         ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E5E7EB] dark:border-[#1F2937] overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 sm:gap-6 min-w-max">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 text-xs md:text-sm font-bold border-b-2 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  active
                    ? "border-[#3D5EF6] text-[#3D5EF6]"
                    : "border-transparent text-gray-500 hover:text-[#3D5EF6] dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TAB CONTENT PANELS
         ───────────────────────────────────────────────────────────── */}

      {/* TAB 1: OVERVIEW DETAILS */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Bio details card */}
          <div className={`p-6 ${cardBg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Biographic Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  INDoS Number
                </span>
                <span className="font-mono font-bold text-[#3D5EF6] text-sm mt-0.5 block">
                  {seafarer.indosNum || "15GL2849"}
                </span>
              </div>
              <div className={`py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Nationality
                </span>
                <span className={`font-semibold text-sm mt-0.5 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.nationality || "Indian"}
                </span>
              </div>
              <div className={`py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Date of Birth
                </span>
                <span className={`font-semibold text-sm mt-0.5 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.dob || "1978-05-14"}
                </span>
              </div>
              <div className={`py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Home / Residential Address
                </span>
                <span className={`font-semibold text-sm mt-0.5 block leading-relaxed ${isDark ? "text-slate-200" : "text-[#111827]"}`}>
                  {seafarer.address || "Flat 402, Sea Breeze Apts, Bandra West, Mumbai, India"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Credentials Card */}
          <div className={`p-6 ${cardBg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-4 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Contact Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDark ? "bg-[#0B0F19] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
              }`}>
                <div className="w-9 h-9 rounded-lg bg-[#EEF1FE] text-[#3D5EF6] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                    Email Address
                  </span>
                  <span className={`font-semibold text-xs mt-0.5 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                    {seafarer.email}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDark ? "bg-[#0B0F19] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
              }`}>
                <div className="w-9 h-9 rounded-lg bg-[#EEF1FE] text-[#3D5EF6] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                    Mobile Phone
                  </span>
                  <span className={`font-semibold text-xs mt-0.5 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                    {seafarer.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEAFARER INFO */}
      {activeTab === "info" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card 1: Identification & Info */}
          <div className={`p-6 ${cardBg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Seafarer Identification & Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Full Legal Name
                </span>
                <span className={`font-bold text-sm mt-1 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.name}
                </span>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  INDoS Number
                </span>
                <span className="font-mono font-bold text-sm text-[#3D5EF6] mt-1 block">
                  {seafarer.indosNum || "15GL2849"}
                </span>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Assigned Rank
                </span>
                <span className={`font-semibold text-sm mt-1 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.rank || "Master"}
                </span>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Operational Department
                </span>
                <span className={`font-semibold text-sm mt-1 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.department || "Deck"}
                </span>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Current Status
                </span>
                <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {seafarer.status || "Active"}
                </span>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Nationality
                </span>
                <span className={`font-semibold text-sm mt-1 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.nationality || "Indian"}
                </span>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Date of Birth
                </span>
                <span className={`font-semibold text-sm mt-1 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.dob || "1978-05-14"}
                </span>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Primary Contact
                </span>
                <span className={`font-semibold text-sm mt-1 block ${isDark ? "text-white" : "text-[#111827]"}`}>
                  {seafarer.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Manage Profile */}
          <div className={`p-6 ${cardBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-1">
                Manage Profile
              </h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                Update rank, department, contact information & status
              </p>
            </div>
            {canEdit ? (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white text-xs font-bold cursor-pointer transition-colors duration-200 shadow-sm shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            ) : (
              <span className="text-xs italic text-gray-400">
                Edit permission restricted
              </span>
            )}
          </div>

          {/* Card 3: Registered Address */}
          <div className={`p-6 ${cardBg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-2">
              Registered Address
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-200" : "text-[#111827]"}`}>
              {seafarer.address || "Flat 402, Sea Breeze Apts, Bandra West, Mumbai, India"}
            </p>
            <p className={`text-xs mt-2 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
              Email: <span className="font-semibold">{seafarer.email}</span>
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATES & CDC */}
      {activeTab === "certificates" && (
        <div className="space-y-4 animate-fadeIn">
          {certificates.length === 0 ? (
            <div className={`p-8 text-center text-xs border border-dashed rounded-xl ${isDark ? "border-white/10 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
              No certificates on file.
            </div>
          ) : (
            certificates.map((cert: any) => {
              const isExpired = cert.status?.toLowerCase() === "expired";
              return (
                <div
                  key={cert.id || cert.name}
                  className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark
                      ? "bg-[#111827] border-white/10 hover:border-white/20"
                      : "bg-white border-[#E5E7EB] hover:border-[#3D5EF6]/30 shadow-sm"
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                      {cert.name}
                    </h4>
                    <div className={`text-[11px] flex items-center gap-3 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                      <span>Type: <strong className={isDark ? "text-slate-200" : "text-gray-800"}>{cert.type}</strong></span>
                      <span>•</span>
                      <span>Exp: <strong className={isDark ? "text-slate-200" : "text-gray-800"}>{cert.expiryDate}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isExpired ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-[#EF4444] text-[#EF4444] bg-transparent">
                        Expired
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-[#16A34A] text-[#16A34A] bg-transparent">
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: VESSEL SERVICE & HISTORY */}
      {activeTab === "vessels" && (
        <div className="space-y-4 animate-fadeIn">
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/10 mb-4">
              <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                Recorded Vessel Deployments
              </span>
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                {vesselDeployments.length} voyages
              </span>
            </div>

            {vesselDeployments.length === 0 ? (
              <div className={`p-8 text-center text-xs border border-dashed rounded-xl ${isDark ? "border-white/10 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
                No vessel history records on file.
              </div>
            ) : (
              <div className="space-y-4">
                {vesselDeployments.map((service: any, idx: number) => (
                  <div
                    key={service.id || idx}
                    className={`p-4 md:p-5 rounded-2xl border space-y-3 transition-all ${
                      isDark ? "bg-[#0B0F19] border-white/10" : "bg-[#FAFAFA] border-[#E5E7EB]"
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#EEF1FE] text-[#3D5EF6] flex items-center justify-center">
                          <Ship className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                          {service.vesselName}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                        {service.duration} Days at Sea
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                          Vessel Type
                        </span>
                        <span className={`font-semibold mt-0.5 block ${isDark ? "text-slate-200" : "text-[#111827]"}`}>
                          {service.vesselType}
                        </span>
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                          Served Rank
                        </span>
                        <span className={`font-semibold mt-0.5 block ${isDark ? "text-slate-200" : "text-[#111827]"}`}>
                          {service.rank}
                        </span>
                      </div>
                    </div>

                    <div className={`text-[11px] pt-2 border-t flex items-center gap-1.5 ${
                      isDark ? "border-white/5 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"
                    }`}>
                      <Calendar className="w-3.5 h-3.5 text-[#3D5EF6]" />
                      <span>
                        Sign-on: <strong>{service.signOn}</strong> • Sign-off: <strong>{service.signOff}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DOCUMENTS & PURCHASES (Merged Tab) */}
      {activeTab === "purchases" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section 1: Document Order Records */}
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/10 mb-4">
              <div>
                <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                  Document Order Records
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Official maritime verification documents, CDC endorsements and STCW records
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-lg bg-[#EEF1FE] text-[#3D5EF6]">
                VERIFIED CDC & STCW
              </span>
            </div>

            <div className="space-y-3">
              {docOrders.map((rec: any) => (
                <div
                  key={rec.orderId}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? "bg-[#0B0F19] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className={`text-xs md:text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                        {rec.docName}
                      </span>
                    </div>
                    <div className={`text-[11px] flex items-center flex-wrap gap-2 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                      <span>Order: <strong className="font-mono">{rec.orderId}</strong></span>
                      <span>•</span>
                      <span>Purchased: {rec.date}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">
                        {rec.inv}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {rec.amount}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A]">
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Course & Service Purchases */}
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/10 mb-4">
              <div>
                <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                  Course & Service Purchases
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                  Courses purchased across all sources (Direct Hari Om and authorized partners)
                </p>
              </div>
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                isDark ? "bg-white/5 text-slate-300 border-white/10" : "bg-[#FAFAFA] text-[#6B7280] border-[#E5E7EB]"
              }`}>
                Total Purchases: {seafarer.purchases?.length || 0}
              </span>
            </div>

            {seafarer.purchases && seafarer.purchases.length > 0 ? (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB]"}>
                    <tr>
                      <th className="py-3 px-3 font-semibold">Purchase ID</th>
                      <th className="py-3 px-3 font-semibold">Course Program</th>
                      <th className="py-3 px-3 font-semibold">Training Type</th>
                      <th className="py-3 px-3 font-semibold">Purchase Source</th>
                      <th className="py-3 px-3 font-semibold">Date</th>
                      <th className="py-3 px-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-[#E5E7EB]"}>
                    {seafarer.purchases.map((p: any) => (
                      <tr key={p.id} className={isDark ? "hover:bg-white/[0.02] transition-colors" : "hover:bg-[#EEF1FE]/30 transition-colors"}>
                        <td className="py-3 px-3 font-mono font-bold text-[#3D5EF6]">{p.id}</td>
                        <td className={`py-3 px-3 font-semibold ${isDark ? "text-white" : "text-[#111827]"}`}>{p.courseName}</td>
                        <td className={`py-3 px-3 ${isDark ? "text-slate-300" : "text-[#6B7280]"}`}>
                          {p.trainingType || "Classroom Training"}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${
                              p.purchaseSource === "Direct"
                                ? "bg-[#EEF1FE] text-[#3D5EF6]"
                                : "bg-[#F3F4F6] text-[#6B7280]"
                            }`}
                          >
                            {p.purchaseSource === "Direct" ? "Direct Hari Om" : "Partner Channel"}
                          </span>
                        </td>
                        <td className={`py-3 px-3 ${isDark ? "text-slate-400" : "text-[#9CA3AF]"}`}>
                          {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A]">
                            {p.purchaseStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`p-8 text-center text-xs border border-dashed rounded-xl ${isDark ? "border-white/10 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
                No course purchases recorded for this Seafarer Master yet.
              </div>
            )}
          </div>

          {/* Section 3: Course Enrollments */}
          <div className={`p-6 ${cardBg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-4 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Course Enrollments ({seafarer.enrollments?.length || 0})
            </h3>
            {seafarer.enrollments && seafarer.enrollments.length > 0 ? (
              <div className="space-y-3">
                {seafarer.enrollments.map((enr: any) => (
                  <div
                    key={enr.id}
                    className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark ? "bg-[#0B0F19] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
                    }`}
                  >
                    <div>
                      <span className={`font-bold block ${isDark ? "text-white" : "text-[#111827]"}`}>{enr.courseName}</span>
                      <span className={`text-[11px] mt-0.5 block ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                        {enr.trainingType || "Classroom"} • Enrolled: {new Date(enr.enrollmentDate).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A] shrink-0">
                      {enr.status || "Completed"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-6 text-center border border-dashed rounded-xl text-xs ${isDark ? "border-white/10 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
                No course enrollments yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. EDIT SEAFARER MODAL (Controlled by partner edit permission)
         ───────────────────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-[16px] shadow-2xl border-0 relative ${
            isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D5EF6]">
                Edit Seafarer Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#3D5EF6] dark:border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                    Assigned Rank
                  </label>
                  <input
                    type="text"
                    value={editForm.rank}
                    onChange={(e) => setEditForm({ ...editForm, rank: e.target.value })}
                    className="w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#3D5EF6] dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#3D5EF6] dark:border-white/10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                    Primary Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#3D5EF6] dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#3D5EF6] dark:border-white/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Registered Address
                </label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#3D5EF6] dark:border-white/10 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-4 border-t dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold border dark:border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#3D5EF6] text-white hover:bg-[#2E4FE0]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
