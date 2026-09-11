"use client";

import React, { createContext, useContext, useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  AlertCircle,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export type DashboardModule =
  | "partner"
  | "seafarer"
  | "course"
  | "admin"
  | "finance"
  | "institute";

export interface StatusItem {
  id: string;
  label: string;
  color: string;
  iconName: string;
  enabled: boolean;
  modules: DashboardModule[];
}

export const STATUS_ICON_MAP: Record<string, LucideIcon> = {
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  AlertCircle,
  ShieldCheck,
};

export const DEFAULT_STATUSES: StatusItem[] = [
  {
    id: "active",
    label: "Active",
    color: "text-emerald-600 dark:text-emerald-400",
    iconName: "CheckCircle2",
    enabled: true,
    modules: ["partner", "seafarer", "course", "admin", "institute"],
  },
  {
    id: "inactive",
    label: "Inactive",
    color: "text-red-500 dark:text-red-400",
    iconName: "XCircle",
    enabled: true,
    modules: ["partner", "seafarer", "course", "admin", "institute"],
  },
  {
    id: "pending",
    label: "Pending",
    color: "text-amber-600 dark:text-amber-400",
    iconName: "Clock",
    enabled: true,
    modules: ["partner", "admin", "finance", "institute"],
  },
  {
    id: "ongoing",
    label: "Ongoing",
    color: "text-sky-600 dark:text-sky-400",
    iconName: "Activity",
    enabled: true,
    modules: ["seafarer"],
  },
  {
    id: "on_hold",
    label: "On Hold",
    color: "text-amber-600 dark:text-amber-400",
    iconName: "Clock",
    enabled: true,
    modules: ["seafarer"],
  },
  {
    id: "completed",
    label: "Completed",
    color: "text-emerald-600 dark:text-emerald-400",
    iconName: "CheckCircle2",
    enabled: true,
    modules: ["seafarer"],
  },
  {
    id: "settled",
    label: "Settled",
    color: "text-emerald-600 dark:text-emerald-400",
    iconName: "CheckCircle2",
    enabled: true,
    modules: ["finance"],
  },
  {
    id: "partially_settled",
    label: "Partially Settled",
    color: "text-emerald-600 dark:text-emerald-400",
    iconName: "Clock",
    enabled: true,
    modules: ["finance"],
  },
  {
    id: "draft",
    label: "Draft",
    color: "text-amber-600 dark:text-amber-400",
    iconName: "Clock",
    enabled: true,
    modules: ["course"],
  },
];

interface StatusContextType {
  statuses: StatusItem[];
  getStatus: (id: string) => StatusItem | undefined;
  getStatusesForModule: (module: DashboardModule, includeDisabled?: boolean) => StatusItem[];
  updateStatus: (id: string, updates: Partial<StatusItem>) => void;
  toggleStatusEnabled: (id: string) => void;
  addStatus: (newStatus: Omit<StatusItem, "enabled">) => void;
  resetToDefaults: () => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

const STORAGE_KEY = "thalassic_global_status_config";

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState<StatusItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_STATUSES;
  });

  const saveStatuses = (items: StatusItem[]) => {
    setStatuses(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage error
    }
  };

  const getStatus = (id: string): StatusItem | undefined => {
    const norm = id.toLowerCase().replace(/[\s-]/g, "_");
    return (
      statuses.find((s) => s.id.toLowerCase() === norm) ||
      statuses.find((s) => s.id.toLowerCase() === id.toLowerCase()) ||
      statuses.find((s) => s.label.toLowerCase() === id.toLowerCase())
    );
  };

  const getStatusesForModule = (
    module: DashboardModule,
    includeDisabled: boolean = false
  ): StatusItem[] => {
    return statuses.filter(
      (s) => s.modules.includes(module) && (includeDisabled || s.enabled)
    );
  };

  const updateStatus = (id: string, updates: Partial<StatusItem>) => {
    const updated = statuses.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    saveStatuses(updated);
  };

  const toggleStatusEnabled = (id: string) => {
    const updated = statuses.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    saveStatuses(updated);
  };

  const addStatus = (newStatus: Omit<StatusItem, "enabled">) => {
    const item: StatusItem = { ...newStatus, enabled: true };
    const updated = [...statuses, item];
    saveStatuses(updated);
  };

  const resetToDefaults = () => {
    saveStatuses(DEFAULT_STATUSES);
  };

  return (
    <StatusContext.Provider
      value={{
        statuses,
        getStatus,
        getStatusesForModule,
        updateStatus,
        toggleStatusEnabled,
        addStatus,
        resetToDefaults,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}

export function useGlobalStatus() {
  const context = useContext(StatusContext);
  if (!context) {
    // Return a safe fallback with default status list if used outside provider
    const getStatus = (id: string) => {
      const norm = id.toLowerCase().replace(/[\s-]/g, "_");
      return (
        DEFAULT_STATUSES.find((s) => s.id.toLowerCase() === norm) ||
        DEFAULT_STATUSES.find((s) => s.id.toLowerCase() === id.toLowerCase()) ||
        DEFAULT_STATUSES.find((s) => s.label.toLowerCase() === id.toLowerCase())
      );
    };
    return {
      statuses: DEFAULT_STATUSES,
      getStatus,
      getStatusesForModule: (module: DashboardModule) =>
        DEFAULT_STATUSES.filter((s) => s.modules.includes(module) && s.enabled),
      updateStatus: () => {},
      toggleStatusEnabled: () => {},
      addStatus: () => {},
      resetToDefaults: () => {},
    };
  }
  return context;
}
