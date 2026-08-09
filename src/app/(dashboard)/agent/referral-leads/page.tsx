"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { api } from "@/lib/axios";
import { useTheme } from "@/providers/theme-provider";
import {
  Users, Plus, Search, Filter, Calendar, Edit2, AlertCircle, CheckCircle2,
  Clock, XCircle, FileText, ChevronRight, ClipboardList
} from "lucide-react";
import Link from "next/link";

export default function ReferralsTrackerPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"leads" | "purchases">("leads");
  const [loading, setLoading] = useState(true);

  // Leads Data
  const [leads, setLeads] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTermLeads, setSearchTermLeads] = useState("");
  const [statusFilterLeads, setStatusFilterLeads] = useState("all");

  // Purchases Data
  const [purchases, setPurchases] = useState<any[]>([]);
  const [searchTermPurchases, setSearchTermPurchases] = useState("");
  const [statusFilterPurchases, setStatusFilterPurchases] = useState("all");

  // Modal states for Leads
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    courseId: "",
    remarks: "",
    status: "New"
  });

  const loadAllData = async () => {
    try {
      const [leadsData, purchasesData, courseRes] = await Promise.all([
        agentService.getLeads(),
        agentService.getPurchases(),
        api.get("/courses")
      ]);
      setLeads(leadsData);
      setPurchases(purchasesData);
      setCourses(courseRes.data || []);
    } catch (err) {
      console.error("Failed to load referrals tracker data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedLeadId(null);
    setErrorMsg("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      courseId: "",
      remarks: "",
      status: "New"
    });
    setShowModal(true);
  };

  const openEditModal = (lead: any) => {
    setModalMode("edit");
    setSelectedLeadId(lead.id);
    setErrorMsg("");
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      city: lead.city || "",
      courseId: lead.course_id || "",
      remarks: lead.remarks || "",
      status: lead.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg("Name, Email, and Phone number are required fields.");
      return;
    }

    try {
      if (modalMode === "add") {
        await agentService.createLead(formData);
      } else if (modalMode === "edit" && selectedLeadId) {
        await agentService.updateLead(selectedLeadId, formData);
      }
      setShowModal(false);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to submit lead. Please try again.");
    }
  };

  const getLeadStatusBadge = (status: string) => {
    switch (status) {
      case "Converted":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? "text-emerald-400 bg-emerald-400/10 border border-emerald-500/20" : "text-emerald-600 bg-emerald-50 border border-emerald-200"}`}>
            <CheckCircle2 className="w-3 h-3" /> Converted
          </span>
        );
      case "Expired":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? "text-red-400 bg-red-400/10 border border-red-500/20" : "text-red-600 bg-red-50 border border-red-200"}`}>
            <XCircle className="w-3 h-3" /> Expired
          </span>
        );
      case "Cancelled":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? "text-slate-400 bg-slate-400/10 border border-slate-500/20" : "text-slate-600 bg-slate-100 border border-slate-300"}`}>
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case "Contacted":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? "text-blue-400 bg-blue-400/10 border border-blue-500/20" : "text-blue-600 bg-blue-50 border border-blue-200"}`}>
            <Clock className="w-3 h-3" /> Contacted
          </span>
        );
      case "Registered":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse ${isDark ? "text-indigo-400 bg-indigo-400/10 border border-indigo-500/20" : "text-indigo-600 bg-indigo-50 border border-indigo-200"}`}>
            <Users className="w-3 h-3" /> Registered
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse ${isDark ? "text-amber-400 bg-amber-400/10 border border-amber-500/20" : "text-amber-600 bg-amber-50 border border-amber-200"}`}>
            <Clock className="w-3 h-3" /> New
          </span>
        );
    }
  };

  const getPurchaseStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
        <XCircle className="w-3 h-3" /> Cancelled
      </span>
    );
  };

  const getDaysRemaining = (expiryDate: string, status: string) => {
    if (status === "Converted" || status === "Cancelled" || status === "Expired") return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return <span className="text-red-500 font-extrabold text-[10px]">EXPIRED</span>;
    if (diffDays <= 7) return <span className="text-rose-450 font-bold text-[10px]">{diffDays} days left</span>;
    return <span className="text-slate-500 text-[10px]">{diffDays} days left</span>;
  };

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTermLeads.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTermLeads.toLowerCase()) ||
      lead.phone.includes(searchTermLeads);

    const matchesStatus =
      statusFilterLeads === "all" ||
      lead.status.toLowerCase() === statusFilterLeads.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Filter Purchases
  const filteredPurchases = purchases.filter((pur) => {
    const matchesSearch =
      pur.seafarerName.toLowerCase().includes(searchTermPurchases.toLowerCase()) ||
      pur.courseName.toLowerCase().includes(searchTermPurchases.toLowerCase()) ||
      pur.invoiceNumber.toLowerCase().includes(searchTermPurchases.toLowerCase());

    const matchesStatus =
      statusFilterPurchases === "all" ||
      pur.status.toLowerCase() === statusFilterPurchases.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 rounded-2xl bg-slate-100 dark:bg-[#09162c]" />
        <div className="h-96 rounded-3xl bg-slate-100 dark:bg-[#09162c]" />
      </div>
    );
  }

  const borderB = isDark ? "border-slate-800" : "border-slate-100";
  const labelText = isDark ? "text-slate-500" : "text-slate-400";
  const inputBg = isDark ? "bg-[#0b182d] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800";

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
            isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
          }`}>
            👥 Referrals Tracker
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
            Referrals Directory
          </h1>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Track prospective leads in pipeline or monitor course bookings completed using your code.
          </p>
        </div>

        {activeTab === "leads" && (
          <button
            onClick={openAddModal}
            className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all ${
              isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/15" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white shadow-blue-200"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Referral Lead
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "leads"
              ? "border-cyan-500 text-cyan-400 font-extrabold"
              : "border-transparent text-slate-450 hover:text-slate-250"
          }`}
        >
          Referral Pipeline (Leads)
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "purchases"
              ? "border-cyan-500 text-cyan-400 font-extrabold"
              : "border-transparent text-slate-450 hover:text-slate-250"
          }`}
        >
          Referred Purchases (Bookings)
        </button>
      </div>

      {activeTab === "leads" ? (
        <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
          isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
        }`}>
          {/* Search & Filters (Leads) */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800/40 pb-5 mb-5">
            <div className="flex-1 w-full max-w-sm">
              <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm ${inputBg}`}>
                <Search className="w-3.5 h-3.5 shrink-0 opacity-55" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, or mobile..."
                  value={searchTermLeads}
                  onChange={(e) => setSearchTermLeads(e.target.value)}
                  className="bg-transparent outline-none w-full text-[13px]"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <Filter className="w-4 h-4 opacity-55" />
              <select
                value={statusFilterLeads}
                onChange={(e) => setStatusFilterLeads(e.target.value)}
                className={`p-2.5 text-xs rounded-lg border outline-none cursor-pointer ${inputBg}`}
              >
                <option value="all">All Lead Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="registered">Registered</option>
                <option value="converted">Converted</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Directory Table (Leads) */}
          {filteredLeads.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Users className="w-10 h-10 mx-auto opacity-30 mb-3" />
              <h4 className="text-sm font-bold">No referral leads found</h4>
              <p className="text-xs mt-1">Try modifying your query or click Add Lead on the top right.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal">
                <thead>
                  <tr className={`font-black border-b uppercase tracking-widest text-[9px] ${
                    isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                  }`}>
                    <th className="pb-3 pr-4">Seafarer Name</th>
                    <th className="pb-3 pr-4">Contact Info</th>
                    <th className="pb-3 pr-4">Interested Course</th>
                    <th className="pb-3 pr-4">Created Date</th>
                    <th className="pb-3 pr-4">Validity status</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className={`hover:bg-slate-500/5 transition-colors ${
                      isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                    }`}>
                      <td className="py-4 pr-4 font-black text-sm">
                        {lead.name}
                        {lead.city && <span className="block text-[10px] text-slate-500 font-medium">{lead.city}</span>}
                      </td>
                      <td className="py-4 pr-4 space-y-0.5">
                        <span className="block font-bold">{lead.phone}</span>
                        <span className={`block text-[10px] ${labelText}`}>{lead.email}</span>
                      </td>
                      <td className="py-4 pr-4 font-semibold max-w-[200px] truncate">
                        {lead.courseName}
                      </td>
                      <td className="py-4 pr-4">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 pr-4 font-semibold">
                        {getDaysRemaining(lead.expiry_at, lead.status) || "—"}
                      </td>
                      <td className="py-4 pr-4">
                        {getLeadStatusBadge(lead.status)}
                      </td>
                      <td className="py-4 text-right flex justify-end">
                        <button
                          onClick={() => openEditModal(lead)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            isDark 
                              ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800 hover:border-slate-700" 
                              : "border-slate-200 bg-slate-50 text-slate-750 hover:bg-slate-100"
                          }`}
                          title="Edit lead details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
          isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
        }`}>
          {/* Search & Filters (Purchases) */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800/40 pb-5 mb-5">
            <div className="flex-1 w-full max-w-sm">
              <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm ${inputBg}`}>
                <Search className="w-3.5 h-3.5 shrink-0 opacity-55" />
                <input
                  type="text"
                  placeholder="Search by invoice, course, or crew name..."
                  value={searchTermPurchases}
                  onChange={(e) => setSearchTermPurchases(e.target.value)}
                  className="bg-transparent outline-none w-full text-[13px]"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <Filter className="w-4 h-4 opacity-55" />
              <select
                value={statusFilterPurchases}
                onChange={(e) => setStatusFilterPurchases(e.target.value)}
                className={`p-2.5 text-xs rounded-lg border outline-none cursor-pointer ${inputBg}`}
              >
                <option value="all">All Purchases</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Directory Table (Purchases) */}
          {filteredPurchases.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <ClipboardList className="w-10 h-10 mx-auto opacity-30 mb-3" />
              <h4 className="text-sm font-bold">No purchase records found</h4>
              <p className="text-xs mt-1">Referred checkouts will display here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal">
                <thead>
                  <tr className={`font-black border-b uppercase tracking-widest text-[9px] ${
                    isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                  }`}>
                    <th className="pb-3 pr-4">Invoice Number</th>
                    <th className="pb-3 pr-4">Seafarer Name</th>
                    <th className="pb-3 pr-4">Course Name</th>
                    <th className="pb-3 pr-4">Purchase Date</th>
                    <th className="pb-3 pr-4">Course Fee</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10">
                  {filteredPurchases.map((pur, i) => (
                    <tr key={i} className={`hover:bg-slate-500/5 transition-colors ${
                      isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                    }`}>
                      <td className="py-4 pr-4 font-black tracking-wider text-cyan-400 text-[10px]">
                        {pur.invoiceNumber}
                      </td>
                      <td className="py-4 pr-4 font-extrabold">
                        {pur.seafarerName}
                      </td>
                      <td className="py-4 pr-4 font-semibold max-w-[250px] truncate">
                        {pur.courseName}
                      </td>
                      <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                        {new Date(pur.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 pr-4 font-black">
                        ₹{pur.courseFee?.toLocaleString()}
                      </td>
                      <td className="py-4 text-right">
                        {getPurchaseStatusBadge(pur.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ADD / EDIT LEAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 md:p-8 animate-zoomIn relative ${
            isDark ? "bg-[#0a1122]/90 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white backdrop-blur-2xl" : "bg-white border-slate-200/80 shadow-2xl text-slate-900 backdrop-blur-2xl"
          }`}>
            
            <h3 className="text-xl font-black tracking-tight border-b border-slate-800/40 pb-4 mb-6">
              {modalMode === "add" ? "Register New Referral Lead" : "Edit Lead Details"}
            </h3>

            {errorMsg && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Submission Error</p>
                  <p className="mt-0.5 opacity-90">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Seafarer Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Amit Kadam"
                    required
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mobile Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+919876543210"
                    required
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="amit@crew.in"
                    required
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Interested Course</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${
                    isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} (Code: {course.code})
                    </option>
                  ))}
                </select>
              </div>

              {modalMode === "edit" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lead Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${
                      isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Registered">Registered</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Additional notes about lead qualifications..."
                  rows={3}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/40 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isDark ? "border-slate-800 hover:bg-white/5" : "border-slate-300 hover:bg-slate-50 text-slate-650"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
                    isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                  }`}
                >
                  {modalMode === "add" ? "Register Lead" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
