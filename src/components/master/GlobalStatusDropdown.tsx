"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  useGlobalStatus,
  DashboardModule,
  STATUS_ICON_MAP,
} from "@/providers/status-provider";
import {
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Edit2,
  Check,
  X,
  Plus,
  RotateCcw,
} from "lucide-react";

const MODULE_OPTIONS: { id: DashboardModule; label: string }[] = [
  { id: "partner", label: "Partner" },
  { id: "seafarer", label: "Seafarer" },
  { id: "course", label: "Course" },
  { id: "admin", label: "Admin" },
  { id: "finance", label: "Finance" },
  { id: "institute", label: "Institute" },
];

export default function GlobalStatusDropdown() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const {
    statuses,
    updateStatus,
    toggleStatusEnabled,
    addStatus,
    resetToDefaults,
  } = useGlobalStatus();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<"all" | DashboardModule>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newModules, setNewModules] = useState<DashboardModule[]>(["partner"]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setEditingId(null);
        setShowAddForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStatuses = statuses.filter(
    (s) => selectedModule === "all" || s.modules.includes(selectedModule)
  );

  const startRename = (id: string, currentLabel: string) => {
    setEditingId(id);
    setEditLabel(currentLabel);
  };

  const saveRename = (id: string) => {
    if (editLabel.trim()) {
      updateStatus(id, { label: editLabel.trim() });
    }
    setEditingId(null);
  };

  const handleCreateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const id = newLabel.trim().toLowerCase().replace(/[\s-]/g, "_");
    addStatus({
      id,
      label: newLabel.trim(),
      color: "text-indigo-600 dark:text-indigo-400",
      iconName: "CheckCircle2",
      modules: newModules.length > 0 ? newModules : ["partner"],
    });
    setNewLabel("");
    setShowAddForm(false);
  };

  const toggleNewModule = (mod: DashboardModule) => {
    setNewModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
          isOpen
            ? (dk ? "bg-violet-500/15 text-white border-violet-500/40" : "bg-violet-500/15 text-black border-violet-500/40")
            : dk
            ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
        }`}
        title="Global Status Configuration"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-violet-500" />
        <span>Status Controls</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl border z-50 p-4 animate-fadeIn ${
            dk
              ? "bg-[#0b1626] border-white/10 text-white"
              : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h4 className="text-xs font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
                Global Status Management
              </h4>
              <p className="text-[11px] opacity-60 mt-0.5">
                Centralized status options across all dashboard modules
              </p>
            </div>
            <button
              onClick={resetToDefaults}
              title="Reset all statuses to defaults"
              className="p-1 rounded text-[11px] opacity-60 hover:opacity-100 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module Filter Tabs */}
          <div className="flex items-center gap-2.5 py-2.5 overflow-x-auto border-b border-white/10 text-[11px]">
            <button
              onClick={() => setSelectedModule("all")}
              className={`transition-colors ${
                selectedModule === "all"
                  ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                  : dk
                  ? "text-white/40 hover:text-white/80 font-medium"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              All
            </button>
            {MODULE_OPTIONS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className={`transition-colors capitalize ${
                  selectedModule === m.id
                    ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                    : dk
                    ? "text-white/40 hover:text-white/80 font-medium"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Status List */}
          <div className="max-h-64 overflow-y-auto py-2 space-y-1.5 pr-1">
            {filteredStatuses.length === 0 ? (
              <p className="text-center py-4 text-xs opacity-50">
                No statuses configured for this module.
              </p>
            ) : (
              filteredStatuses.map((s) => {
                const IconComponent = STATUS_ICON_MAP[s.iconName] || CheckCircle2;
                const isEditing = editingId === s.id;

                return (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                      s.enabled
                        ? dk
                          ? "bg-white/[0.02] border-white/5 hover:border-white/15"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                        : "opacity-40 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <IconComponent className={`w-3.5 h-3.5 shrink-0 ${s.color}`} />

                      {isEditing ? (
                        <div className="flex items-center gap-1 flex-1 mr-2">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveRename(s.id)}
                            className="px-1.5 py-0.5 text-xs rounded border bg-transparent outline-none border-violet-500 w-full"
                            autoFocus
                          />
                          <button
                            onClick={() => saveRename(s.id)}
                            className="p-1 rounded text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded text-slate-400 hover:bg-white/10"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold ${s.color}`}>
                              {s.label}
                            </span>
                            <button
                              onClick={() => startRename(s.id, s.label)}
                              title="Rename status globally"
                              className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[10px] opacity-50 truncate">
                            {s.modules.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Enable/Disable Toggle */}
                    <button
                      onClick={() => toggleStatusEnabled(s.id)}
                      title={s.enabled ? "Deactivate status globally" : "Activate status globally"}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                        s.enabled
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                          : dk
                          ? "bg-white/5 text-white/40 hover:bg-white/10"
                          : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                      }`}
                    >
                      {s.enabled ? "Active" : "Disabled"}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Status Option */}
          <div className="pt-2 border-t border-white/10">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-black dark:text-white hover:bg-violet-500/10 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Status Option
              </button>
            ) : (
              <form onSubmit={handleCreateStatus} className="space-y-2.5 p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Status Name
                  </label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Under Review"
                    className={`w-full px-2 py-1 text-xs rounded border bg-transparent outline-none ${
                      dk ? "border-white/15 focus:border-violet-400" : "border-slate-300 focus:border-violet-500"
                    }`}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Apply to Modules
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {MODULE_OPTIONS.map((m) => {
                      const isSel = newModules.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleNewModule(m.id)}
                          className={`px-1.5 py-0.5 text-[9px] font-semibold rounded capitalize transition-colors ${
                            isSel
                              ? "bg-violet-500 text-white"
                              : "bg-white/5 text-white/50 border border-white/10"
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-2.5 py-1 text-[11px] rounded bg-white/5 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-[11px] font-semibold rounded bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    Save Status
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
