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
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
            <CheckCircle2 className="w-3 h-3" /> Converted
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
            <XCircle className="w-3 h-3" /> Expired
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case "Contacted":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EEF1FE] text-[#3D5EF6]">
            <Clock className="w-3 h-3" /> Contacted
          </span>
        );
      case "Registered":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EEF1FE] text-[#3D5EF6]">
            <Users className="w-3 h-3" /> Registered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
            <Clock className="w-3 h-3" /> New
          </span>
        );
    }
  };

  const getPurchaseStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
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
    
    if (diffDays <= 0) return <span className="text-[#DC2626] font-bold text-[10px]">EXPIRED</span>;
    if (diffDays <= 7) return <span className="text-[#B45309] font-bold text-[10px]">{diffDays} days left</span>;
    return <span className={`text-[10px] ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>{diffDays} days left</span>;
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
        <div className="h-16 rounded-[16px] bg-slate-100 dark:bg-[#0B0F19]" />
        <div className="h-96 rounded-[16px] bg-slate-100 dark:bg-[#0B0F19]" />
      </div>
    );
  }

  const borderB = isDark ? "border-[#1F2937]" : "border-[#E5E7EB]";
  const labelText = isDark ? "text-gray-400" : "text-[#6B7280]";
  const inputBg = isDark ? "bg-[#111827] border-[#1F2937] text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]";

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Referrals Directory
          </h1>
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
            Track prospective leads in pipeline or monitor course bookings completed using your code.
          </p>
        </div>

        {activeTab === "leads" && (
          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-full font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors duration-200 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
          >
            <Plus className="w-4 h-4" /> Add Referral Lead
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors duration-200 cursor-pointer ${
            activeTab === "leads"
              ? "border-[#3D5EF6] text-[#3D5EF6] font-extrabold"
              : isDark ? "border-transparent text-gray-400 hover:text-white" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Referral Pipeline (Leads)
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors duration-200 cursor-pointer ${
            activeTab === "purchases"
              ? "border-[#3D5EF6] text-[#3D5EF6] font-extrabold"
              : isDark ? "border-transparent text-gray-400 hover:text-white" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Referred Purchases (Bookings)
        </button>
      </div>

      {activeTab === "leads" ? (
        <section className={`rounded-[16px] border-0 p-6 md:p-8 relative overflow-hidden ${
          isDark ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white" : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
        }`}>
          {/* Search & Filters (Leads) */}
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-5 mb-5 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <div className="flex-1 w-full max-w-sm">
              <label className={`flex items-center gap-2 px-3 py-2.5 rounded-full border text-sm ${inputBg}`}>
                <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, or mobile..."
                  value={searchTermLeads}
                  onChange={(e) => setSearchTermLeads(e.target.value)}
                  className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-gray-500" : "placeholder:text-[#9CA3AF]"}`}
                />
              </label>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <Filter className="w-4 h-4 opacity-50" />
              <select
                value={statusFilterLeads}
                onChange={(e) => setStatusFilterLeads(e.target.value)}
                className={`p-2.5 text-xs rounded-full border outline-none cursor-pointer ${inputBg}`}
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
            <div className="text-center py-16 text-[#6B7280]">
              <Users className="w-10 h-10 mx-auto opacity-30 mb-3" />
              <h4 className="text-sm font-bold">No referral leads found</h4>
              <p className="text-xs mt-1">Try modifying your query or click Add Lead on the top right.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal">
                <thead>
                  <tr className={`font-semibold border-b uppercase tracking-wider text-[10px] ${
                    isDark ? "text-gray-400 border-[#1F2937]" : "text-[#6B7280] border-[#E5E7EB]"
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
                <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className={`transition-colors duration-200 ${
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/70"
                    }`}>
                      <td className="py-4 pr-4 font-bold text-sm">
                        {lead.name}
                        {lead.city && <span className={`block text-[10px] font-medium ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>{lead.city}</span>}
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
                          className={`p-2 rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                            isDark 
                              ? "border-[#1F2937] bg-[#111827] text-white/70 hover:text-white hover:bg-white/10" 
                              : "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
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
        <section className={`rounded-[16px] border-0 p-6 md:p-8 relative overflow-hidden ${
          isDark ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white" : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
        }`}>
          {/* Search & Filters (Purchases) */}
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-5 mb-5 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <div className="flex-1 w-full max-w-sm">
              <label className={`flex items-center gap-2 px-3 py-2.5 rounded-full border text-sm ${inputBg}`}>
                <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
                <input
                  type="text"
                  placeholder="Search by invoice, course, or crew name..."
                  value={searchTermPurchases}
                  onChange={(e) => setSearchTermPurchases(e.target.value)}
                  className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-gray-500" : "placeholder:text-[#9CA3AF]"}`}
                />
              </label>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <Filter className="w-4 h-4 opacity-50" />
              <select
                value={statusFilterPurchases}
                onChange={(e) => setStatusFilterPurchases(e.target.value)}
                className={`p-2.5 text-xs rounded-full border outline-none cursor-pointer ${inputBg}`}
              >
                <option value="all">All Purchases</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Directory Table (Purchases) */}
          {filteredPurchases.length === 0 ? (
            <div className="text-center py-16 text-[#6B7280]">
              <ClipboardList className="w-10 h-10 mx-auto opacity-30 mb-3" />
              <h4 className="text-sm font-bold">No purchase records found</h4>
              <p className="text-xs mt-1">Referred checkouts will display here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal">
                <thead>
                  <tr className={`font-semibold border-b uppercase tracking-wider text-[10px] ${
                    isDark ? "text-gray-400 border-[#1F2937]" : "text-[#6B7280] border-[#E5E7EB]"
                  }`}>
                    <th className="pb-3 pr-4">Invoice Number</th>
                    <th className="pb-3 pr-4">Seafarer Name</th>
                    <th className="pb-3 pr-4">Course Name</th>
                    <th className="pb-3 pr-4">Purchase Date</th>
                    <th className="pb-3 pr-4">Course Fee</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
                  {filteredPurchases.map((pur, i) => (
                    <tr key={i} className={`transition-colors duration-200 ${
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/70"
                    }`}>
                      <td className="py-4 pr-4 font-mono font-bold tracking-wider text-[10px] text-[#3D5EF6]">
                        {pur.invoiceNumber}
                      </td>
                      <td className="py-4 pr-4 font-extrabold">
                        {pur.seafarerName}
                      </td>
                      <td className="py-4 pr-4 font-semibold max-w-[250px] truncate">
                        {pur.courseName}
                      </td>
                      <td className={`py-4 pr-4 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                        {new Date(pur.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 pr-4 font-bold text-[#111827] dark:text-white">
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
          <div className={`w-full max-w-lg rounded-[16px] border-0 shadow-2xl p-6 md:p-8 animate-zoomIn relative ${
            isDark ? "bg-[#0B0F19] text-white" : "bg-white text-[#111827]"
          }`}>
            
            <h3 className={`text-xl font-extrabold tracking-tight border-b pb-4 mb-6 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              {modalMode === "add" ? "Register New Referral Lead" : "Edit Lead Details"}
            </h3>

            {errorMsg && (
              <div className="mb-5 p-4 rounded-[16px] flex items-start gap-3 text-xs bg-[#FEE2E2] border border-[#FEE2E2] text-[#DC2626]">
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
                  <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Seafarer Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Amit Kadam"
                    required
                    className={`w-full px-3 py-2 text-xs rounded-full border outline-none transition-colors duration-200 ${
                      isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Mobile Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+919876543210"
                    required
                    className={`w-full px-3 py-2 text-xs rounded-full border outline-none transition-colors duration-200 ${
                      isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="amit@crew.in"
                    required
                    className={`w-full px-3 py-2 text-xs rounded-full border outline-none transition-colors duration-200 ${
                      isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className={`w-full px-3 py-2 text-xs rounded-full border outline-none transition-colors duration-200 ${
                      isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Interested Course</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-xs rounded-full border outline-none cursor-pointer transition-colors duration-200 ${
                    isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
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
                  <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Lead Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-xs rounded-full border outline-none cursor-pointer transition-colors duration-200 ${
                      isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Registered">Registered</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Additional notes about lead qualifications..."
                  rows={3}
                  className={`w-full px-3 py-2 text-xs rounded-[16px] border outline-none transition-colors duration-200 ${
                    isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className={`pt-4 flex justify-end gap-3 border-t mt-4 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors duration-200 cursor-pointer ${
                    isDark ? "border-[#1F2937] bg-[#111827] text-white hover:bg-white/10" : "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-colors duration-200 cursor-pointer bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
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
