"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";

export function Skeleton({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`animate-pulse rounded ${
        isDark ? "bg-white/10" : "bg-slate-200"
      } ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1a2e] space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-3.5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2.5 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
