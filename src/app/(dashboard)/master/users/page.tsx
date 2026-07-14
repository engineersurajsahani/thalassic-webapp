"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import { fetchAPI } from "@/lib/api";
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  UserCheck, 
  FileText, 
  Anchor, 
  Award, 
  CheckCircle,
  ExternalLink,
  Eye
} from "lucide-react";

// Mock users based on the PRD schema
const initialUsers = [
  { 
    id: "1", 
    name: "Raj Kumar", 
    email: "raj@example.com", 
    role: "Seafarer", 
    date: "Today", 
    status: "Pending Audit",
    initial: "R", 
    color: "bg-blue-500/20 text-blue-400",
    profile: {
      givenName: "Raj",
      surname: "Kumar",
      dob: "1994-08-12",
      birthPlace: "Varanasi, Uttar Pradesh, India",
      fatherName: "Sanjay Kumar",
      phone: "+91 98765 43210",
      passport: { num: "Z1234567", issue: "2020-01-10", expiry: "2030-01-09", place: "Lucknow" },
      indos: { num: "20N1234", issue: "2020-03-15", status: "Verified" },
      cdc: { num: "MUM123456", issue: "2020-05-20", expiry: "2030-05-19", place: "Mumbai" },
      education: "Diploma in Nautical Science",
      seaService: [
        { rpsl: "Anvay Maritime", vessel: "Pacific Voyager", type: "Container", imo: "9876543", rank: "3rd Officer", on: "2023-01-10", off: "2023-08-15" }
      ]
    }
  },
  { 
    id: "2", 
    name: "Priya Singh", 
    email: "priya@example.com", 
    role: "Seafarer", 
    date: "Yesterday", 
    status: "Verified",
    initial: "P", 
    color: "bg-emerald-500/20 text-emerald-400",
    profile: {
      givenName: "Priya",
      surname: "Singh",
      dob: "1996-05-24",
      birthPlace: "Patna, Bihar, India",
      fatherName: "Rakesh Singh",
      phone: "+91 99887 76655",
      passport: { num: "Y7654321", issue: "2021-04-12", expiry: "2031-04-11", place: "Patna" },
      indos: { num: "21N5678", issue: "2021-06-20", status: "Verified" },
      cdc: { num: "KOL765432", issue: "2021-08-18", expiry: "2031-08-17", place: "Kolkata" },
      education: "B.Sc in Nautical Science",
      seaService: [
        { rpsl: "Synergy Marine", vessel: "Atlantic Jewel", type: "Oil Tanker", imo: "9654321", rank: "Cadet", on: "2022-09-01", off: "2023-03-01" }
      ]
    }
  },
  { 
    id: "3", 
    name: "Amit Patel", 
    email: "amit@example.com", 
    role: "Seafarer", 
    date: "2 days ago", 
    status: "Pending Audit",
    initial: "A", 
    color: "bg-purple-500/20 text-purple-400",
    profile: {
      givenName: "Amit",
      surname: "Patel",
      dob: "1992-11-30",
      birthPlace: "Ahmedabad, Gujarat, India",
      fatherName: "Kishor Patel",
      phone: "+91 98989 89898",
      passport: { num: "X9876543", issue: "2019-12-05", expiry: "2029-12-04", place: "Ahmedabad" },
      indos: { num: "19E9876", issue: "2019-11-20", status: "Pending" },
      cdc: { num: "MUM987654", issue: "2019-12-15", expiry: "2029-12-14", place: "Mumbai" },
      education: "Marine Engineering Degree",
      seaService: [
        { rpsl: "Fleet Management", vessel: "Ganges Star", type: "Bulk Carrier", imo: "9543210", rank: "4th Engineer", on: "2021-05-10", off: "2021-12-10" }
      ]
    }
  },
  { 
    id: "4", 
    name: "Suresh Verma", 
    email: "suresh@example.com", 
    role: "Company Admin", 
    date: "3 days ago", 
    status: "Active",
    initial: "S", 
    color: "bg-orange-500/20 text-orange-400",
    profile: null
  },
];

export default function UsersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Audit Drawer State
  const [auditUser, setAuditUser] = useState<any>(null);
  const [auditDetails, setAuditDetails] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seafarer"
  });
  const [addingUser, setAddingUser] = useState(false);
  const [addError, setAddError] = useState("");

  // Fetch Users List
  const loadUsers = () => {
    setLoading(true);
    fetchAPI('/master/users')
      .then(res => {
        const mapped = res.map((u: any) => {
          const isSeafarer = u.role?.toUpperCase() === 'SEAFARER';
          const isCompany = u.role?.toUpperCase() === 'COMPANY_ADMIN';
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: isSeafarer ? 'Seafarer' : isCompany ? 'Company Admin' : 'Master',
            date: new Date(u.createdAt || u.created_at || Date.now()).toLocaleDateString(),
            status: u.status ? (u.status === 'Active' ? 'Verified' : u.status) : 'Verified',
            initial: u.name ? u.name.charAt(0).toUpperCase() : "?",
            color: isSeafarer ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400',
          };
        });
        setUsers(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Fetch details of specific user profile for auditing
  const handleAuditProfile = (user: any) => {
    setAuditUser(user);
    setLoadingProfile(true);
    setAuditDetails(null);
    fetchAPI(`/master/users/${user.id}/profile`)
      .then(res => {
        const p = res.profile || {};
        const mappedDetails = {
          givenName: p.givenName || user.name.split(" ")[0] || "N/A",
          surname: p.surname || user.name.split(" ").slice(1).join(" ") || "N/A",
          dob: p.dob || "N/A",
          birthPlace: p.birthPlace || p.birth_place || "N/A",
          fatherName: p.fatherName || p.father_name || "N/A",
          phone: user.phone || "+91 99887 76655",
          passport: {
            num: p.passport?.num || "N/A",
            issue: p.passport?.issue || "N/A",
            expiry: p.passport?.expiry || "N/A",
            place: p.passport?.place || "N/A"
          },
          indos: {
            num: p.indos?.num || "N/A",
            issue: p.indos?.issue || "N/A",
            status: p.indos?.status || "Pending"
          },
          cdc: {
            num: p.cdc?.num || "N/A",
            issue: p.cdc?.issue || "N/A",
            expiry: p.cdc?.expiry || "N/A",
            place: p.cdc?.place || "N/A"
          },
          education: p.education || "N/A",
          seaService: (res.seaService || []).map((s: any) => ({
            rpsl: s.rpsl,
            vessel: s.vessel,
            type: s.vessel_type || s.type || "N/A",
            imo: s.imo || "N/A",
            rank: s.rank,
            on: s.sign_on || s.on || "N/A",
            off: s.sign_off || s.off || "N/A"
          }))
        };
        setAuditDetails(mappedDetails);
        setLoadingProfile(false);
      })
      .catch(err => {
        console.error("Failed to load audit profile details:", err);
        setLoadingProfile(false);
      });
  };

  // Filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Verify Handler
  const handleVerifyUser = (id: string) => {
    fetchAPI(`/master/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Active' })
    })
      .then(() => {
        loadUsers(); // reload main users list
        setAuditUser((prev: any) => prev ? { ...prev, status: "Verified" } : null);
      })
      .catch(err => {
        alert("Failed to verify user: " + err.message);
      });
  };

  // Add User Submit Handler
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserForm.name || !addUserForm.email || !addUserForm.password) {
      setAddError("Please fill out all fields.");
      return;
    }
    setAddingUser(true);
    setAddError("");

    fetchAPI('/master/users', {
      method: 'POST',
      body: JSON.stringify(addUserForm)
    })
      .then(() => {
        setAddingUser(false);
        setShowAddModal(false);
        setAddUserForm({
          name: "",
          email: "",
          password: "",
          role: "seafarer"
        });
        loadUsers(); // reload users
      })
      .catch(err => {
        setAddingUser(false);
        setAddError(err.message || "Failed to create user");
      });
  };

  // Glassmorphic Styles
  const glassStyle = isDark
    ? "bg-slate-900/60 border-slate-800/80 backdrop-blur-xl"
    : "bg-white border-slate-200/80 shadow-md shadow-slate-100";

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* Header Panel */}
      <div className="border-b pb-6 border-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            User Management
          </h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Monitor registered seafarers, view their uploaded documents, and approve their audit profiles.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border cursor-pointer ${
              isDark
                ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700/80"
                : "bg-zinc-950 border-zinc-950 text-white hover:bg-zinc-900"
            }`}
          >
            + Add New User
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${glassStyle}`}>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all ${
              isDark 
                ? "bg-slate-950/40 border-slate-800 text-white focus:border-cyan-500/50" 
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50"
            }`}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {["all", "Seafarer", "Company Admin"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all border cursor-pointer ${
                selectedRole === role
                  ? isDark
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-blue-50 border-blue-200 text-blue-600"
                  : isDark
                  ? "bg-transparent border-slate-800 text-slate-400 hover:bg-slate-900/30"
                  : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {role === "all" ? "All Roles" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-3xl border overflow-hidden ${glassStyle}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-850 bg-slate-950/20" : "border-slate-100 bg-slate-50/50"}`}>
                <th className="p-4.5 text-slate-450 uppercase tracking-wider">User Info</th>
                <th className="p-4.5 text-slate-450 uppercase tracking-wider">Assigned Role</th>
                <th className="p-4.5 text-slate-450 uppercase tracking-wider">Registered</th>
                <th className="p-4.5 text-slate-450 uppercase tracking-wider">Audit Status</th>
                <th className="p-4.5 text-slate-450 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/40">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`transition-colors duration-150 ${
                      isDark ? "hover:bg-slate-900/30" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="p-4.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${user.color}`}>
                          {user.initial}
                        </div>
                        <div>
                          <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-850"}`}>{user.name}</p>
                          <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4.5">
                      <span className={`px-2.5 py-0.5 rounded-lg border font-black uppercase text-[10px] ${
                        user.role === "Seafarer"
                          ? isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                          : isDark ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-orange-50 border-orange-100 text-orange-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className={`p-4.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{user.date}</td>
                    <td className="p-4.5">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                        user.status === "Verified"
                          ? isDark ? "bg-green-500/15 text-green-400" : "bg-green-50 text-green-600"
                          : isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-50 text-yellow-600"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4.5 text-right">
                      {user.role === "Seafarer" && (
                        <button
                          onClick={() => handleAuditProfile(user)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            isDark 
                              ? "border-slate-800 hover:bg-slate-800 hover:text-cyan-400 text-slate-300" 
                              : "border-slate-200 hover:bg-slate-50 hover:text-blue-600 text-slate-600"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" /> Audit Profile
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                    <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-850"}`}>No Users Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Drawer Side-Over Panel */}
      {/* Audit Drawer Side-Over Panel */}
      {auditUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className={`w-full max-w-xl h-full border-l p-6 space-y-6 overflow-y-auto animate-slideLeft ${
            isDark ? "bg-[#0b1d30] border-gray-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-2xl"
          }`}>
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-800/40">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <ShieldCheck className="w-5.5 h-5.5 text-cyan-400" /> Audit Seafarer Profile
                </h3>
                <p className={`text-[10px] uppercase font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Reviewing: {auditUser.name}
                </p>
              </div>
              <button 
                onClick={() => setAuditUser(null)}
                className={`p-1.5 rounded-lg border cursor-pointer hover:bg-slate-800/40 ${isDark ? "border-slate-800" : "border-slate-200"}`}
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {loadingProfile ? (
              <div className="py-16 text-center text-xs text-slate-500 font-bold uppercase animate-pulse">
                Fetching profile credentials from secure database...
              </div>
            ) : auditDetails ? (
              <>
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Basic Information
                  </h4>
                  <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border text-xs font-semibold ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <div>
                      <span className="text-slate-450 block text-[9px] uppercase font-bold">Given Name</span>
                      <span className="font-extrabold text-sm">{auditDetails.givenName}</span>
                    </div>
                    <div>
                      <span className="text-slate-450 block text-[9px] uppercase font-bold">Surname</span>
                      <span className="font-extrabold text-sm">{auditDetails.surname}</span>
                    </div>
                    <div>
                      <span className="text-slate-450 block text-[9px] uppercase font-bold">Date of Birth</span>
                      <span>{auditDetails.dob}</span>
                    </div>
                    <div>
                      <span className="text-slate-450 block text-[9px] uppercase font-bold">Father's Name</span>
                      <span>{auditDetails.fatherName}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-450 block text-[9px] uppercase font-bold">Birth Place</span>
                      <span>{auditDetails.birthPlace}</span>
                    </div>
                  </div>
                </div>

                {/* Document Audits */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Uploaded Document Details
                  </h4>
                  <div className="space-y-3">
                    {/* Passport */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex justify-between items-center border-b pb-1.5 border-slate-800/40">
                        <span className="font-black text-xs text-blue-500 uppercase tracking-wide">Passport Details</span>
                        <span className="text-[10px] text-green-500 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Provided</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Passport Number</span>
                          <span className="font-black text-slate-300">{auditDetails.passport.num}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Place of Issue</span>
                          <span>{auditDetails.passport.place}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Issue Date</span>
                          <span>{auditDetails.passport.issue}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Expiry Date</span>
                          <span>{auditDetails.passport.expiry}</span>
                        </div>
                      </div>
                    </div>

                    {/* INDOS */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex justify-between items-center border-b pb-1.5 border-slate-800/40">
                        <span className="font-black text-xs text-blue-500 uppercase tracking-wide">INDOS Number</span>
                        <span className={`text-[10px] flex items-center gap-1 ${
                          auditDetails.indos.status === "Verified" ? "text-green-500" : "text-yellow-500 animate-pulse"
                        }`}>
                          <CheckCircle className="w-3.5 h-3.5" /> {auditDetails.indos.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">INDOS Number</span>
                          <span className="font-black text-slate-300">{auditDetails.indos.num}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Issue Date</span>
                          <span>{auditDetails.indos.issue}</span>
                        </div>
                      </div>
                    </div>

                    {/* CDC */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex justify-between items-center border-b pb-1.5 border-slate-800/40">
                        <span className="font-black text-xs text-blue-500 uppercase tracking-wide">Continuous Discharge Book (CDC)</span>
                        <span className="text-[10px] text-green-500 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Provided</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">CDC Number</span>
                          <span className="font-black text-slate-300">{auditDetails.cdc.num}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Place of Issue</span>
                          <span>{auditDetails.cdc.place}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Issue Date</span>
                          <span>{auditDetails.cdc.issue}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Expiry Date</span>
                          <span>{auditDetails.cdc.expiry}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sea Service Experience */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Anchor className="w-4 h-4" /> Sea Service Records (Master Checker approved)
                  </h4>
                  {auditDetails.seaService.length === 0 ? (
                    <div className="text-xs text-slate-500">No sea service records found</div>
                  ) : auditDetails.seaService.map((ship: any, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border space-y-2.5 ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex justify-between items-center border-b pb-1.5 border-slate-800/40">
                        <span className="font-black text-xs text-slate-300 uppercase tracking-wide">{ship.vessel}</span>
                        <span className="text-[10px] text-slate-450 font-bold uppercase">RPSL: {ship.rpsl}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Rank Served</span>
                          <span className="font-extrabold">{ship.rank}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Vessel IMO</span>
                          <span>{ship.imo}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Sign On Date</span>
                          <span>{ship.on}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] uppercase">Sign Off Date</span>
                          <span>{ship.off}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-xs text-red-400 font-bold uppercase">
                Error loading seafarer records profiles details.
              </div>
            )}

            {/* Verification action panel */}
            <div className="pt-4 border-t border-slate-800/40 flex gap-4">
              <button
                type="button"
                onClick={() => setAuditUser(null)}
                className={`flex-1 py-3.5 rounded-xl font-bold uppercase text-center border transition-all cursor-pointer text-xs ${
                  isDark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                Close Audit
              </button>
              {auditUser && auditUser.status !== "Verified" && (
                <button
                  onClick={() => handleVerifyUser(auditUser.id)}
                  className="flex-1 py-3.5 rounded-xl font-black uppercase text-center text-white cursor-pointer text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/20"
                >
                  Verify and Approve Seafarer
                </button>
              )}
            </div>

          </div>
        </div>
      )}
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-xl transition-all ${
            isDark ? "bg-[#09090b] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
          }`}>
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-4">
              <h3 className="text-base font-bold">Add New User Profile</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark ? "border-zinc-800 hover:bg-zinc-850" : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {addError}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className={`block mb-1.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
                      : "bg-zinc-50 border-zinc-200 focus:border-zinc-300 text-zinc-850"
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@company.com"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
                      : "bg-zinc-50 border-zinc-200 focus:border-zinc-300 text-zinc-850"
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Account Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
                      : "bg-zinc-50 border-zinc-200 focus:border-zinc-300 text-zinc-850"
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>System Role</label>
                <select
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className={`w-full p-2.5 rounded-xl border outline-none cursor-pointer transition-all ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
                      : "bg-zinc-50 border-zinc-200 focus:border-zinc-300 text-zinc-855"
                  }`}
                >
                  <option value="seafarer">Seafarer (Crew)</option>
                  <option value="company_admin">Company Admin (Maritime Academy / Recruiter)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-2.5 rounded-xl border font-bold uppercase transition-all cursor-pointer ${
                    isDark ? "border-zinc-800 hover:bg-zinc-850 text-zinc-300" : "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className={`flex-1 py-2.5 rounded-xl font-bold uppercase text-white cursor-pointer transition-all ${
                    addingUser
                      ? "bg-zinc-800 border-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-zinc-950 border-zinc-950 hover:bg-zinc-900"
                  }`}
                >
                  {addingUser ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
