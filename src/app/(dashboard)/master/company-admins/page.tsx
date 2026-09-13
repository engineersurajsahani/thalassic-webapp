"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useGlobalStatus, STATUS_ICON_MAP } from "@/providers/status-provider";
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
} from "lucide-react";

type CompanyAdmin = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  seafarers: number;
  joined: string;
  lastLogin: string;
  branch?: string;
};

const INITIAL_COMPANY_ADMINS: CompanyAdmin[] = [];

const EMPTY_CA = {
  name: "",
  company: "",
  email: "",
  phone: "",
  location: "",
  status: "pending",
  branch: "",
};

type ModalType = "add" | "edit" | null;

export default function CompanyAdminsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const { getStatusesForModule, getStatus } = useGlobalStatus();
  const adminStatuses = getStatusesForModule("admin");

  const [adminList, setAdminList] = useState<CompanyAdmin[]>(
    INITIAL_COMPANY_ADMINS,
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<CompanyAdmin | null>(null);
  const [form, setForm] = useState({ ...EMPTY_CA });
  const [saved, setSaved] = useState(false);

  //  theme tokens ─
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-slate-400" : "text-black";
  const card = dk
    ? "bg-[#0f2035] border border-white/5 rounded-2xl"
    : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk
    ? "bg-white/5 border border-white/8 text-white placeholder:text-slate-400 focus:border-sky-500/50 outline-none"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-black focus:border-sky-400 outline-none";
  const dv = dk ? "divide-white/5" : "divide-slate-100";
  const rh = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls = dk
    ? "border-b border-white/5 text-slate-300"
    : "border-b border-slate-100 text-black font-semibold";
  const modalBg = dk
    ? "bg-[#0f2035] border border-white/10"
    : "bg-white border border-slate-200";
  const labelCls = dk
    ? "text-slate-300 font-semibold"
    : "text-black font-semibold";

  const filtered = adminList.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const openModal = (type: ModalType, admin?: CompanyAdmin) => {
    setSelected(admin ?? null);
    if (type === "edit" && admin)
      setForm({
        name: admin.name,
        company: admin.company,
        email: admin.email,
        phone: admin.phone,
        location: admin.location,
        status: admin.status,
        branch: admin.branch ?? "",
      });
    if (type === "add") setForm({ ...EMPTY_CA });
    setSaved(false);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setSaved(false);
  };

  const handleAddOrEdit = () => {
    if (!form.name.trim() || !form.company.trim() || !form.email.trim()) return;
    if (modal === "add") {
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const newAdmin: CompanyAdmin = {
        id: `CA${String(adminList.length + 1).padStart(3, "0")}`,
        ...form,
        seafarers: 0,
        joined: today,
        lastLogin: "Never",
      };
      setAdminList((prev) => [newAdmin, ...prev]);
    } else if (modal === "edit" && selected) {
      setAdminList((prev) =>
        prev.map((a) => (a.id === selected.id ? { ...a, ...form } : a)),
      );
    }
    setSaved(true);
    setTimeout(closeModal, 1200);
  };

  const toggleStatus = (admin: CompanyAdmin) => {
    const next = admin.status === "active" ? "inactive" : "active";
    setAdminList((prev) =>
      prev.map((a) => (a.id === admin.id ? { ...a, status: next } : a)),
    );
  };

  const stats = [
    {
      label: "Total",
      value: adminList.length,
      color: "bg-sky-500/15",
      iconColor: "text-sky-400",
    },
    {
      label: "Active",
      value: adminList.filter((a) => a.status === "active").length,
      color: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
    },
    {
      label: "Pending",
      value: adminList.filter((a) => a.status === "pending").length,
      color: "bg-amber-500/15",
      iconColor: "text-amber-400",
    },
    {
      label: "Inactive",
      value: adminList.filter((a) => a.status === "inactive").length,
      color: "bg-red-500/15",
      iconColor: "text-red-400",
    },
  ];

  //  Modal inner content
  const renderModal = () => {
    if (!modal) return null;

    //  ADD / EDIT form
    if (modal === "add" || modal === "edit") {
      const isEdit = modal === "edit";
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-sky-400" />
                </div>
                <p className={`text-sm font-semibold ${ht}`}>
                  {isEdit ? "Edit Company Admin" : "Add Company Admin"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}
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
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    placeholder="e.g. Maritime Solutions"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
              </div>
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
                  placeholder="admin@company.in"
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Mobile Number
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
                    placeholder="e.g. Mumbai"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${labelCls}`}
                  >
                    Branch (Optional)
                  </label>
                  <input
                    value={form.branch}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, branch: e.target.value }))
                    }
                    placeholder="e.g. South"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
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
                    {adminStatuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div
              className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}
            >
              <button
                onClick={closeModal}
                className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEdit}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"}`}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Saved!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />{" "}
                    {isEdit ? "Save Changes" : "Add Admin"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {renderModal()}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Admin Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Manage company administrators and access privileges across the
            platform
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors shadow-sm ${
            dk
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
              : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Plus className="w-4 h-4" /> Add Administrator
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-4 flex items-center gap-4`}>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}
            >
              <Building2 className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>{s.value}</p>
              <p className={`text-xs font-medium ${mt}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className={card}>
        {/* Toolbar */}
        <div
          className={`flex items-center gap-3 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}
        >
          <div className="relative flex-1 max-w-xs">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company admins..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors ${inputCls}`}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`text-xs capitalize transition-colors ${
                filter === "all"
                  ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-sky-500"
                  : dk
                    ? "text-slate-400 hover:text-white font-medium"
                    : "text-black hover:text-black font-medium"
              }`}
            >
              All
            </button>
            {adminStatuses.map((s) => {
              const isSel = filter === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setFilter(s.id)}
                  className={`text-xs capitalize transition-colors ${
                    isSel
                      ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-sky-500"
                      : dk
                        ? "text-slate-400 hover:text-white font-medium"
                        : "text-black hover:text-black font-medium"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {[
                  "Company Admin",
                  "Contact",
                  "Location",
                  "Seafarers",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-[10px] font-semibold uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {filtered.map((a) => {
                const statusItem = getStatus(a.status);
                const statusLabel = statusItem?.label || a.status;
                const statusColor = statusItem?.color || "text-slate-400";
                const SIcon =
                  (statusItem &&
                    STATUS_ICON_MAP[
                      statusItem.iconName as keyof typeof STATUS_ICON_MAP
                    ]) ||
                  CheckCircle2;
                return (
                  <tr key={a.id} className={`${rh} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {a.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className={`font-semibold text-xs ${ht}`}>
                            {a.name}
                          </p>
                          <p className={`text-[10px] ${mt}`}>{a.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p
                          className={`text-xs flex items-center gap-1.5 ${ht}`}
                        >
                          <Mail className="w-3 h-3 text-slate-400" />
                          {a.email}
                        </p>
                        <p
                          className={`text-[11px] flex items-center gap-1.5 ${mt}`}
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          {a.phone}
                        </p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-xs ${mt}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {a.location}
                        {a.branch ? ` (${a.branch})` : ""}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-semibold ${ht}`}>
                      {a.seafarers}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusColor}`}
                      >
                        <SIcon className="w-3.5 h-3.5" />
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit */}
                        <button
                          onClick={() => openModal("edit", a)}
                          title="Edit"
                          className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-sky-400" : "hover:bg-slate-100 text-slate-400 hover:text-sky-500"}`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {/* Activate / Deactivate */}
                        <button
                          onClick={() => toggleStatus(a)}
                          title={
                            a.status === "active" ? "Deactivate" : "Activate"
                          }
                          className={`p-1.5 rounded-lg transition-colors ${a.status === "active" ? (dk ? "hover:bg-red-500/10 text-white/40 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500") : dk ? "hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400" : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500"}`}
                        >
                          {a.status === "active" ? (
                            <PowerOff className="w-3.5 h-3.5" />
                          ) : (
                            <Power className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className={`px-6 py-3 border-t ${dk ? "border-white/5" : "border-slate-100"}`}
        >
          <p className={`text-[12px] ${mt}`}>
            Showing {filtered.length} of {adminList.length} company admins
          </p>
        </div>
      </div>
    </div>
  );
}
