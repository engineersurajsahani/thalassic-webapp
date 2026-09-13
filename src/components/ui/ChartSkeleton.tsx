"use client";

import React from "react";

interface ChartSkeletonProps {
  height?: number | string;
  className?: string;
  title?: string;
}

export default function ChartSkeleton({
  height = "260px",
  className = "",
  title,
}: ChartSkeletonProps) {
  return (
    <div
      style={{ height }}
      className={`w-full rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 p-4 flex flex-col justify-between animate-pulse ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded-md" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-white/10 rounded-md" />
        </div>
      )}
      <div className="flex-1 flex items-end gap-3 px-2 pb-2">
        <div className="w-1/6 h-3/5 bg-slate-200 dark:bg-white/10 rounded-t-md" />
        <div className="w-1/6 h-4/5 bg-slate-200 dark:bg-white/10 rounded-t-md" />
        <div className="w-1/6 h-2/5 bg-slate-200 dark:bg-white/10 rounded-t-md" />
        <div className="w-1/6 h-5/6 bg-slate-200 dark:bg-white/10 rounded-t-md" />
        <div className="w-1/6 h-3/4 bg-slate-200 dark:bg-white/10 rounded-t-md" />
        <div className="w-1/6 h-1/2 bg-slate-200 dark:bg-white/10 rounded-t-md" />
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-200/40 dark:border-white/5">
        <div className="h-2 w-8 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="h-2 w-8 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="h-2 w-8 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="h-2 w-8 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="h-2 w-8 bg-slate-200 dark:bg-white/10 rounded" />
      </div>
    </div>
  );
}
