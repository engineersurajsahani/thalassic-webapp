"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTheme } from "@/providers/theme-provider";
import { useGlobalStatus, STATUS_ICON_MAP } from "@/providers/status-provider";
import { api } from "@/lib/api";
import {
  Building2,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Edit,
  X,
  Check,
  Power,
  PowerOff,
  Shield,
  Briefcase,
  Users,
} from "lucide-react";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "COMPANY_ADMIN" | "PARTNER_ADMIN" | "MASTER";
  status: string;
  company?: string;
  agencyName?: string;
  location?: string;
  totalSeafarers?: number;
  createdAt?: string;
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  role: "COMPANY_ADMIN",
  organization: "",
  location: "",
  status: "Active",
};

type ModalType = "add" | "edit" | null;

export default function AdminManagementPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const { getStatusesForModule, getStatus } = useGlobalStatus();
  const adminStatuses = getStatusesForModule("admin");

  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | "COMPANY_ADMIN" | "PARTNER_ADMIN"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saved, setSaved] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get("/master/users?role=admins");
      if (Array.isArray(res.data)) {
        setAdminList(res.data);
      }
    } catch (e) {
      console.warn("Failed to load admins from database:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Theme styling tokens
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-slate-400" : "text-slate-500";
  const card = dk
    ? "bg-[#0f2035] border border-white/5 rounded-2xl"
    : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk
    ? "bg-white/5 border border-white/8 text-white placeholder:text-slate-500 focus:border-sky-500/50 outline-none"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";
  const dv = dk ? "divide-white/5" : "divide-slate-100";
  const rh = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls = dk
    ? "border-b border-white/5 text-slate-400"
    : "border-b border-slate-100 text-slate-600 font-semibold";
  const modalBg = dk
    ? "bg-[#0f2035] border border-white/10 text-white"
    : "bg-white border border-slate-200 text-slate-800";
  const labelCls = dk
    ? "text-slate-300 font-semibold"
    : "text-slate-700 font-semibold";

  const filtered = adminList.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      (a.name || "").toLowerCase().includes(q) ||
      (a.company || a.agencyName || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q) ||
      (a.location || "").toLowerCase().includes(q);

    const matchRole =
      roleFilter === "ALL" ||
      (roleFilter === "COMPANY_ADMIN" && a.role === "COMPANY_ADMIN") ||
      (roleFilter === "PARTNER_ADMIN" && a.role === "PARTNER_ADMIN");

    const matchStatus =
      statusFilter === "all" ||
      (a.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchRole && matchStatus;
  });

  const openModal = (type: ModalType, admin?: AdminUser) => {
    setSelected(admin ?? null);
    if (type === "edit" && admin) {
      setForm({
        name: admin.name || "",
        email: admin.email || "",
        phone: admin.phone || "",
        role: admin.role || "COMPANY_ADMIN",
        organization: admin.company || admin.agencyName || "",
        location: admin.location || "",
        status: admin.status || "Active",
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setSaved(false);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setSaved(false);
  };

  const handleAddOrEdit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      if (modal === "add") {
        await api.post("/master/users", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status,
          company:
            form.role === "COMPANY_ADMIN" ? form.organization : undefined,
          agencyName:
            form.role === "PARTNER_ADMIN" ? form.organization : undefined,
          location: form.location,
        });
        toast.success("Administrator created successfully!");
      } else if (modal === "edit" && selected) {
        await api.patch(`/master/users/${selected.id}/status`, {
          status: form.status,
        });
        toast.success("Administrator updated successfully!");
      }
      setSaved(true);
      fetchAdmins();
      setTimeout(closeModal, 1000);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to save administrator.",
      );
      console.error(err);
    }
  };

  const toggleStatus = async (admin: AdminUser) => {
    const isCurrentlyActive = (admin.status || "").toLowerCase() === "active";
    const nextStatus = isCurrentlyActive ? "Inactive" : "Active";
    try {
      await api.patch(`/master/users/${admin.id}/status`, {
        status: nextStatus,
      });
      toast.success(`Admin marked as ${nextStatus}`);
      fetchAdmins();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const companyAdminsCount = adminList.filter(
    (a) => a.role === "COMPANY_ADMIN",
  ).length;
  const partnerAdminsCount = adminList.filter(
    (a) => a.role === "PARTNER_ADMIN",
  ).length;
  const activeCount = adminList.filter(
    (a) => (a.status || "").toLowerCase() === "active",
  ).length;
  const pendingCount = adminList.filter(
    (a) => (a.status || "").toLowerCase() === "pending",
  ).length;

  const stats = [
    {
      label: "Total Administrators",
      value: adminList.length,
      color: "bg-sky-500/15",
      iconColor: "text-sky-400",
      Icon: Shield,
    },
    {
      label: "Company Admins",
      value: companyAdminsCount,
      color: "bg-blue-500/15",
      iconColor: "text-blue-400",
      Icon: Building2,
    },
    {
      label: "Partner Admins",
      value: partnerAdminsCount,
      color: "bg-violet-500/15",
      iconColor: "text-violet-400",
      Icon: Briefcase,
    },
    {
      label: "Active Accounts",
      value: activeCount,
      color: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      Icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Modal for Add / Edit */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                dk ? "border-white/8" : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-sky-400" />
                </div>
                <p className={`text-sm font-semibold ${ht}`}>
                  {modal === "edit"
                    ? "Edit Administrator"
                    : "Add Platform Administrator"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className={`p-1.5 rounded-lg transition-colors ${
                  dk
                    ? "hover:bg-white/8 text-white/40"
                    : "hover:bg-slate-100 text-slate-400"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Rajesh Kumar"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Admin Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value as any }))
                    }
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  >
                    <option value="COMPANY_ADMIN">
                      Company Admin (Shipping Co)
                    </option>
                    <option value="PARTNER_ADMIN">
                      Partner Admin (Agency Admin)
                    </option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="admin@company.com"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Mobile Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Organization / Entity Name
                  </label>
                  <input
                    value={form.organization}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, organization: e.target.value }))
                    }
                    placeholder="e.g. Anglo-Eastern / Seaway Agency"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Location
                  </label>
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="Mumbai, Maharashtra"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                >
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div
              className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
                dk ? "border-white/8" : "border-slate-100"
              }`}
            >
              <button
                onClick={closeModal}
                className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  dk
                    ? "border-white/10 text-white/60 hover:bg-white/5"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEdit}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Saved!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />{" "}
                    {modal === "edit" ? "Save Changes" : "Create Admin"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Admin Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Manage Company Administrators and Partner Agency Administrators with
            platform privileges
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors shadow-sm ${
            dk
              ? "bg-sky-500 hover:bg-sky-600 border-sky-400/30 text-white"
              : "bg-sky-600 hover:bg-sky-700 text-white"
          }`}
        >
          <Plus className="w-4 h-4" /> Add Administrator
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-4 flex items-center gap-4`}>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}
            >
              <s.Icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>
                {loading ? "..." : s.value}
              </p>
              <p className={`text-xs font-medium ${mt}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className={card}>
        {/* Toolbar with Role Filters and Status Filters */}
        <div
          className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-4 border-b ${
            dk ? "border-white/5" : "border-slate-100"
          }`}
        >
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, email..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors ${inputCls}`}
            />
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                roleFilter === "ALL"
                  ? "bg-sky-500 text-white font-semibold shadow-sm"
                  : dk
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Admins ({adminList.length})
            </button>
            <button
              onClick={() => setRoleFilter("COMPANY_ADMIN")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                roleFilter === "COMPANY_ADMIN"
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : dk
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Company Admins ({companyAdminsCount})
            </button>
            <button
              onClick={() => setRoleFilter("PARTNER_ADMIN")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                roleFilter === "PARTNER_ADMIN"
                  ? "bg-violet-600 text-white font-semibold shadow-sm"
                  : dk
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Partner Admins ({partnerAdminsCount})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {[
                  "Administrator & Role",
                  "Organization / Agency",
                  "Contact Details",
                  "Location",
                  "Associated Seafarers",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider ${
                      h === "Actions" ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Loading platform administrators...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No administrators found matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const isCompany = a.role === "COMPANY_ADMIN";
                  const roleBadge = isCompany ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/20">
                      <Building2 className="w-3 h-3" /> Company Admin
                    </span>
                  ) : a.role === "PARTNER_ADMIN" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-500/15 text-violet-400 border border-violet-500/20">
                      <Briefcase className="w-3 h-3" /> Partner Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      <Shield className="w-3 h-3" /> Master Admin
                    </span>
                  );

                  const isActive = (a.status || "").toLowerCase() === "active";

                  return (
                    <tr key={a.id} className={`${rh} transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 text-white ${
                              isCompany ? "bg-blue-600" : "bg-violet-600"
                            }`}
                          >
                            {(a.name || "Admin")
                              .split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="space-y-1">
                            <p className={`font-semibold text-xs ${ht}`}>
                              {a.name || "Platform Admin"}
                            </p>
                            <div>{roleBadge}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-xs font-medium ${ht}`}>
                          {a.company ||
                            a.agencyName ||
                            (isCompany
                              ? "Shipping Partner"
                              : "Maritime Agency")}
                        </p>
                        <p className={`text-[11px] ${mt}`}>
                          {isCompany ? "Fleet Operator" : "Recruitment Agency"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p
                            className={`text-xs flex items-center gap-1.5 ${ht}`}
                          >
                            <Mail className="w-3 h-3 text-slate-400" />
                            {a.email}
                          </p>
                          {a.phone && (
                            <p
                              className={`text-[11px] flex items-center gap-1.5 ${mt}`}
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              {a.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-xs ${mt}`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {a.location || "Mumbai, Maharashtra"}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-xs font-semibold ${ht}`}>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {a.totalSeafarers || (isCompany ? 42 : 34)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            isActive ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {a.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openModal("edit", a)}
                            title="Edit"
                            className={`p-1.5 rounded-lg transition-colors ${
                              dk
                                ? "hover:bg-white/8 text-white/40 hover:text-sky-400"
                                : "hover:bg-slate-100 text-slate-400 hover:text-sky-500"
                            }`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleStatus(a)}
                            title={isActive ? "Deactivate" : "Activate"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? dk
                                  ? "hover:bg-red-500/10 text-white/40 hover:text-red-400"
                                  : "hover:bg-red-50 text-slate-400 hover:text-red-500"
                                : dk
                                  ? "hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400"
                                  : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500"
                            }`}
                          >
                            {isActive ? (
                              <PowerOff className="w-3.5 h-3.5" />
                            ) : (
                              <Power className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div
          className={`px-6 py-3 border-t flex items-center justify-between ${
            dk ? "border-white/5" : "border-slate-100"
          }`}
        >
          <p className={`text-[12px] ${mt}`}>
            Showing {filtered.length} of {adminList.length} total administrators
          </p>
        </div>
      </div>
    </div>
  );
}
