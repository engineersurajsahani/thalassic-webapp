"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Building2,
  Search,
  Plus,
  X,
  Edit,
  Eye,
  BookOpen,
  BarChart3,
  Check,
  MapPin,
  Hash,
} from "lucide-react";

type Institute = {
  id: string;
  name: string;
  idtNumber: string;
  location: string;
  company: string;
  courses: string[];
  students: number;
  status: "active" | "inactive";
};

const INITIAL_INSTITUTES: Institute[] = [
  {
    id: "INS001",
    name: "Hari Om Maritime Training Centre",
    idtNumber: "IDT-1001",
    location: "Mumbai",
    company: "Maritime Solutions Pvt Ltd",
    courses: ["STCW Basic Safety", "Advanced Fire Fighting"],
    students: 124,
    status: "active",
  },
  {
    id: "INS002",
    name: "Ocean Training Institute",
    idtNumber: "IDT-1002",
    location: "Chennai",
    company: "Ocean Freight Carriers",
    courses: ["STCW Basic Safety"],
    students: 86,
    status: "active",
  },
  {
    id: "INS003",
    name: "Coastal Maritime Academy",
    idtNumber: "IDT-1003",
    location: "Kochi",
    company: "",
    courses: ["Personal Survival Techniques"],
    students: 54,
    status: "inactive",
  },
];

const EMPTY_FORM = {
  name: "",
  idtNumber: "",
  location: "",
  company: "",
  courses: "",
  status: "active" as "active" | "inactive",
};

type ModalType = "add" | "edit" | "view" | "courses" | "performance" | null;

export default function InstitutesPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [institutes, setInstitutes] =
    useState<Institute[]>(INITIAL_INSTITUTES);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Institute | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/45" : "text-slate-400";

  const card = dk
    ? "bg-[#0f2035] border border-white/5 rounded-2xl"
    : "bg-white border border-slate-200 rounded-2xl shadow-sm";

  const inputCls = dk
    ? "bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-sky-500 outline-none"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";

  const modalBg = dk
    ? "bg-[#0f2035] border border-white/10"
    : "bg-white border border-slate-200";

  const filteredInstitutes = institutes.filter((institute) => {
    const q = search.toLowerCase();

    return (
      institute.name.toLowerCase().includes(q) ||
      institute.idtNumber.toLowerCase().includes(q) ||
      institute.location.toLowerCase().includes(q) ||
      institute.company.toLowerCase().includes(q)
    );
  });

  const openModal = (type: ModalType, institute?: Institute) => {
    setModal(type);
    setSelected(institute ?? null);
    setError("");
    setSaved(false);

    if (type === "edit" && institute) {
      setForm({
        name: institute.name,
        idtNumber: institute.idtNumber,
        location: institute.location,
        company: institute.company,
        courses: institute.courses.join(", "),
        status: institute.status,
      });
    }

    if (type === "add") {
      setForm(EMPTY_FORM);
    }
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setError("");
    setSaved(false);
  };

  const handleSave = () => {
    // Institute Name is mandatory
    if (!form.name.trim()) {
      setError("Institute Name is required.");
      return;
    }

    const courses = form.courses
      .split(",")
      .map((course) => course.trim())
      .filter(Boolean);

    if (modal === "add") {
      const newInstitute: Institute = {
        id: `INS${String(institutes.length + 1).padStart(3, "0")}`,
        name: form.name.trim(),
        idtNumber: form.idtNumber.trim(),
        location: form.location.trim(),
        company: form.company.trim(),
        courses,
        students: 0,
        status: form.status,
      };

      setInstitutes((prev) => [newInstitute, ...prev]);
    }

    if (modal === "edit" && selected) {
      setInstitutes((prev) =>
        prev.map((institute) =>
          institute.id === selected.id
            ? {
                ...institute,
                name: form.name.trim(),
                idtNumber: form.idtNumber.trim(),
                location: form.location.trim(),
                company: form.company.trim(),
                courses,
                status: form.status,
              }
            : institute
        )
      );
    }

    setSaved(true);

    setTimeout(() => {
      closeModal();
    }, 800);
  };

  const renderFormModal = () => {
    if (modal !== "add" && modal !== "edit") return null;

    const isEdit = modal === "edit";

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div
          className={`relative z-10 w-full max-w-lg rounded-2xl shadow-2xl ${modalBg}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              dk ? "border-white/10" : "border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-sky-400" />
              </div>

              <div>
                <h2 className={`text-sm font-bold ${ht}`}>
                  {isEdit ? "Edit Institute" : "Add Institute"}
                </h2>

                <p className={`text-xs ${mt}`}>
                  Institute Management
                </p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className={`p-2 rounded-lg ${
                dk
                  ? "text-white/40 hover:bg-white/5"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Institute Name */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${ht}`}>
                Institute Name <span className="text-red-500">*</span>
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter institute name"
                className={`w-full px-3 py-2.5 rounded-lg text-sm ${inputCls}`}
              />

              {error && (
                <p className="text-xs text-red-500 mt-1.5">{error}</p>
              )}
            </div>

            {/* IDT + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${ht}`}>
                  Institute ID / IDT Number
                </label>

                <input
                  value={form.idtNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      idtNumber: e.target.value,
                    }))
                  }
                  placeholder="IDT-1001"
                  className={`w-full px-3 py-2.5 rounded-lg text-sm ${inputCls}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${ht}`}>
                  Location
                </label>

                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Mumbai"
                  className={`w-full px-3 py-2.5 rounded-lg text-sm ${inputCls}`}
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${ht}`}>
                Associated Company
              </label>

              <input
                value={form.company}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Optional"
                className={`w-full px-3 py-2.5 rounded-lg text-sm ${inputCls}`}
              />
            </div>

            {/* Courses */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${ht}`}>
                Courses Offered
              </label>

              <input
                value={form.courses}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    courses: e.target.value,
                  }))
                }
                placeholder="STCW Basic Safety, Advanced Fire Fighting"
                className={`w-full px-3 py-2.5 rounded-lg text-sm ${inputCls}`}
              />

              <p className={`text-[11px] mt-1 ${mt}`}>
                Separate multiple courses with commas.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${ht}`}>
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as "active" | "inactive",
                  }))
                }
                className={`w-full px-3 py-2.5 rounded-lg text-sm ${inputCls}`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div
            className={`flex justify-end gap-3 px-6 py-4 border-t ${
              dk ? "border-white/10" : "border-slate-100"
            }`}
          >
            <button
              onClick={closeModal}
              className={`px-4 py-2 text-sm rounded-xl border ${
                dk
                  ? "border-white/10 text-white/50"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl text-white ${
                saved
                  ? "bg-emerald-500"
                  : "bg-sky-500 hover:bg-sky-600"
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isEdit ? "Save Changes" : "Add Institute"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderViewModal = () => {
    if (!selected || modal !== "view") return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div
          className={`relative z-10 w-full max-w-lg rounded-2xl shadow-2xl ${modalBg}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <div>
              <h2 className={`text-sm font-bold ${ht}`}>
                Institute Details
              </h2>
              <p className={`text-xs mt-1 ${mt}`}>{selected.id}</p>
            </div>

            <button onClick={closeModal}>
              <X className={`w-4 h-4 ${mt}`} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div>
              <p className={`text-xs ${mt}`}>Institute Name</p>
              <p className={`text-base font-bold mt-1 ${ht}`}>
                {selected.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className={`text-xs ${mt}`}>Institute ID / IDT</p>
                <p className={`text-sm font-semibold mt-1 ${ht}`}>
                  {selected.idtNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className={`text-xs ${mt}`}>Location</p>
                <p className={`text-sm font-semibold mt-1 ${ht}`}>
                  {selected.location || "Not provided"}
                </p>
              </div>
            </div>

            <div>
              <p className={`text-xs ${mt}`}>Associated Company</p>
              <p className={`text-sm font-semibold mt-1 ${ht}`}>
                {selected.company || "Not associated"}
              </p>
            </div>

            <div>
              <p className={`text-xs ${mt}`}>Courses Offered</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {selected.courses.length > 0 ? (
                  selected.courses.map((course) => (
                    <span
                      key={course}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-500 text-xs font-semibold"
                    >
                      {course}
                    </span>
                  ))
                ) : (
                  <span className={`text-sm ${mt}`}>
                    No courses assigned
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className={`text-xs ${mt}`}>Status</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  selected.status === "active"
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-red-500/15 text-red-500"
                }`}
              >
                {selected.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCoursesModal = () => {
    if (!selected || modal !== "courses") return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div
          className={`relative z-10 w-full max-w-md rounded-2xl shadow-2xl ${modalBg}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <div>
              <h2 className={`text-sm font-bold ${ht}`}>
                Courses Offered
              </h2>
              <p className={`text-xs mt-1 ${mt}`}>{selected.name}</p>
            </div>

            <button onClick={closeModal}>
              <X className={`w-4 h-4 ${mt}`} />
            </button>
          </div>

          <div className="p-6">
            {selected.courses.length > 0 ? (
              <div className="space-y-2">
                {selected.courses.map((course, index) => (
                  <div
                    key={course}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      dk ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                    </div>

                    <span className={`text-sm font-medium ${ht}`}>
                      {index + 1}. {course}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${mt}`}>
                No courses assigned to this institute.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceModal = () => {
    if (!selected || modal !== "performance") return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div
          className={`relative z-10 w-full max-w-md rounded-2xl shadow-2xl ${modalBg}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <div>
              <h2 className={`text-sm font-bold ${ht}`}>
                Institute Performance
              </h2>
              <p className={`text-xs mt-1 ${mt}`}>{selected.name}</p>
            </div>

            <button onClick={closeModal}>
              <X className={`w-4 h-4 ${mt}`} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <div className={`${card} p-4`}>
              <p className={`text-xs ${mt}`}>Active Students</p>
              <p className={`text-2xl font-bold mt-1 ${ht}`}>
                {selected.students}
              </p>
            </div>

            <div className={`${card} p-4`}>
              <p className={`text-xs ${mt}`}>Courses</p>
              <p className={`text-2xl font-bold mt-1 ${ht}`}>
                {selected.courses.length}
              </p>
            </div>

            <div className={`${card} p-4`}>
              <p className={`text-xs ${mt}`}>Status</p>
              <p className="text-sm font-bold text-emerald-500 mt-2">
                {selected.status}
              </p>
            </div>

            <div className={`${card} p-4`}>
              <p className={`text-xs ${mt}`}>Institute ID</p>
              <p className={`text-sm font-bold mt-2 ${ht}`}>
                {selected.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeCount = institutes.filter(
    (i) => i.status === "active"
  ).length;

  const totalStudents = institutes.reduce(
    (sum, institute) => sum + institute.students,
    0
  );

  return (
    <div className="space-y-6">
      {renderFormModal()}
      {renderViewModal()}
      {renderCoursesModal()}
      {renderPerformanceModal()}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>
            Institute Management
          </h1>

          <p className={`text-sm mt-0.5 ${mt}`}>
            Manage training institutes where Hari Om courses are conducted
          </p>
        </div>

        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Institute
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={`${card} p-4`}>
          <p className={`text-xs ${mt}`}>Total Institutes</p>
          <p className={`text-2xl font-bold mt-1 ${ht}`}>
            {institutes.length}
          </p>
        </div>

        <div className={`${card} p-4`}>
          <p className={`text-xs ${mt}`}>Active Institutes</p>
          <p className="text-2xl font-bold mt-1 text-emerald-500">
            {activeCount}
          </p>
        </div>

        <div className={`${card} p-4`}>
          <p className={`text-xs ${mt}`}>Courses</p>
          <p className={`text-2xl font-bold mt-1 ${ht}`}>
            {institutes.reduce(
              (sum, institute) => sum + institute.courses.length,
              0
            )}
          </p>
        </div>

        <div className={`${card} p-4`}>
          <p className={`text-xs ${mt}`}>Students</p>
          <p className={`text-2xl font-bold mt-1 ${ht}`}>
            {totalStudents}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className={card}>
        {/* Search */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="relative max-w-md">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mt}`}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institutes..."
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg ${inputCls}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className={`border-b ${
                  dk
                    ? "border-white/5 text-white/30"
                    : "border-slate-100 text-slate-400"
                }`}
              >
                {[
                  "Institute",
                  "IDT Number",
                  "Location",
                  "Company",
                  "Courses",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredInstitutes.map((institute) => (
                <tr
                  key={institute.id}
                  className={`border-b ${
                    dk
                      ? "border-white/5 hover:bg-white/[0.02]"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-sky-500" />
                      </div>

                      <div>
                        <p className={`text-sm font-semibold ${ht}`}>
                          {institute.name}
                        </p>

                        <p className={`text-xs mt-0.5 ${mt}`}>
                          {institute.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className={`px-6 py-4 text-xs ${mt}`}>
                    <span className="flex items-center gap-1.5">
                      <Hash className="w-3 h-3" />
                      {institute.idtNumber || "—"}
                    </span>
                  </td>

                  <td className={`px-6 py-4 text-xs ${mt}`}>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {institute.location || "—"}
                    </span>
                  </td>

                  <td className={`px-6 py-4 text-xs ${mt}`}>
                    {institute.company || "Not associated"}
                  </td>

                  <td className={`px-6 py-4 text-xs ${ht}`}>
                    {institute.courses.length}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        institute.status === "active"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-red-500/15 text-red-500"
                      }`}
                    >
                      {institute.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        title="View"
                        onClick={() => openModal("view", institute)}
                        className="p-2 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-500/10"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Edit"
                        onClick={() => openModal("edit", institute)}
                        className="p-2 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-500/10"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Courses"
                        onClick={() => openModal("courses", institute)}
                        className="p-2 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-500/10"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Performance"
                        onClick={() =>
                          openModal("performance", institute)
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInstitutes.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className={`px-6 py-12 text-center text-sm ${mt}`}
                  >
                    No institutes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={`px-6 py-3 text-xs ${mt}`}>
          Showing {filteredInstitutes.length} of {institutes.length} institutes
        </div>
      </div>
    </div>
  );
}