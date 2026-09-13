"use client";

import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* Top Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 dark:bg-white/10 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 dark:bg-white/5 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-200 dark:bg-white/10 rounded-lg" />
          <div className="h-9 w-32 bg-slate-200 dark:bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* KPI Stats Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-[#0c1a2e] border border-slate-200/80 dark:border-white/[0.06] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5" />
            </div>
            <div className="h-8 w-32 bg-slate-200 dark:bg-white/10 rounded-lg" />
            <div className="h-3 w-20 bg-slate-100 dark:bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content / Table / Chart Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0c1a2e] border border-slate-200/80 dark:border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-slate-200 dark:bg-white/10 rounded-md" />
            <div className="h-4 w-20 bg-slate-100 dark:bg-white/5 rounded" />
          </div>
          <div className="h-64 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] flex items-end gap-3 p-4">
            <div className="w-1/6 h-2/5 bg-slate-200 dark:bg-white/10 rounded-t" />
            <div className="w-1/6 h-4/5 bg-slate-200 dark:bg-white/10 rounded-t" />
            <div className="w-1/6 h-3/5 bg-slate-200 dark:bg-white/10 rounded-t" />
            <div className="w-1/6 h-5/6 bg-slate-200 dark:bg-white/10 rounded-t" />
            <div className="w-1/6 h-1/2 bg-slate-200 dark:bg-white/10 rounded-t" />
            <div className="w-1/6 h-3/4 bg-slate-200 dark:bg-white/10 rounded-t" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1a2e] border border-slate-200/80 dark:border-white/[0.06] space-y-4">
          <div className="h-5 w-32 bg-slate-200 dark:bg-white/10 rounded-md" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-white/10" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-24 bg-slate-200 dark:bg-white/10 rounded" />
                    <div className="h-2.5 w-16 bg-slate-100 dark:bg-white/5 rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-slate-200 dark:bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
