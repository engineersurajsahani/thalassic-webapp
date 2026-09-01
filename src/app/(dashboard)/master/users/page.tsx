"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import {
  Search, Plus, Users, ShieldCheck, Mail, Phone,
  UserCheck, AlertCircle, X, ShieldAlert
} from "lucide-react";

export default function UsersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "seafarer",
  });

  const roles = ["All", "seafarer", "master"];

  const bg = isDark ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200 shadow-sm";
  const headText = isDark ? "text-white/80" : "text-slate-800";
  const mutedText = isDark ? "text-white/35" : "text-slate-400";
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const divider = isDark ? "divide-white/5" : "divide-slate-100";
  const rowHover = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";

  const fetchUsers = async () => {
    try {
      const data = await masterService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load master users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await masterService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      });
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "seafarer",
      });
      setModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id: string) => {
    if (!confirm("Are you sure you want to verify this user's profile and documents?")) return;
    try {
      await masterService.updateUserStatus(id, "Verified");
      alert("User profile and uploaded documents successfully audited and verified!");
      await fetchUsers();
    } catch (err) {
      alert("Failed to update user audit status");
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRole === "All" || u.role?.toLowerCase() === selectedRole;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role: string) => {
    const r = role?.toLowerCase();
    if (r === "master") {
      return isDark 
        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
        : "bg-red-50 text-red-700 border border-red-200";
    }
    return isDark 
      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
      : "bg-indigo-50 text-indigo-700 border border-indigo-200";
  };

  return (
    <div className="space-y-5 relative min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>User Management</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>{users.length} total registered accounts</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4.5 h-4.5" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className={`${bg} rounded-2xl p-4`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border text-sm ${inputBg}`}>
            <Search className="w-4 h-4 shrink-0 opacity-50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="bg-transparent outline-none w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`text-xs px-3 py-2 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedRole === r 
                    ? "bg-indigo-600 text-white" 
                    : isDark ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`${bg} rounded-2xl overflow-hidden`}>
        {loading ? (
          <div className="text-center py-16 animate-pulse">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className={`text-xs ${mutedText}`}>Loading account registry...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? "border-b border-white/5" : "border-b border-slate-100"}>
                  {["Name", "Contact Info", "Role", "Verification Status", "Registered", "Actions"].map((h) => (
                    <th key={h} className={`text-left px-6 py-4.5 text-[11px] font-black uppercase tracking-wider whitespace-nowrap ${mutedText}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${divider}`}>
                {filtered.map((u) => (
                  <tr key={u.id} className={`${rowHover} transition-colors`}>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 bg-indigo-600`}>
                          {u.name?.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <p className={`text-[13px] font-black ${headText}`}>{u.name}</p>
                          <p className={`text-[10px] font-mono mt-0.5 ${mutedText}`}>{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail className={`w-3.5 h-3.5 ${mutedText}`} />
                        <span className={isDark ? "text-white/60" : "text-slate-650"}>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone className={`w-3.5 h-3.5 ${mutedText}`} />
                        <span className={isDark ? "text-white/60" : "text-slate-650"}>{u.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      {u.role?.toLowerCase() === "seafarer" ? (
                        u.status === "Verified" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified by DGS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending Audit
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-400/10 px-2.5 py-0.5 rounded-full border border-slate-500/20">
                          System Admin
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4.5 text-[12px] ${mutedText}`}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                    </td>
                    <td className="px-6 py-4.5">
                      {u.role?.toLowerCase() === "seafarer" && u.status !== "Verified" && (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm"
                          title="Verify Seafarer Profile & Documents"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className={`text-center py-16 ${mutedText}`}>
            <Users className="w-8 h-8 mx-auto mb-3 opacity-40 animate-pulse" />
            <p className="text-sm font-bold">No accounts match your filters</p>
          </div>
        )}
      </div>

      {/* Elegant Add User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
            isDark ? "bg-[#0b1b36] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
              <div>
                <h3 className="text-lg font-black tracking-tight">Create User Account</h3>
                <p className={`text-xs mt-0.5 ${mutedText}`}>Register a new platform account</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Full Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Capt. Sandeep Roy"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. sandeep@gmail.com"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Password *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Phone Number *</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Account Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark ? "bg-[#0b1b36] border-slate-800 focus:border-indigo-500 text-white" : "bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-950"
                  }`}
                >
                  <option value="seafarer">Seafarer</option>
                  <option value="master">Master (Admin)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                    submitting 
                      ? "bg-slate-650 text-slate-400 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-500 text-white hover:-translate-y-0.5"
                  }`}
                >
                  {submitting ? "Registering..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
