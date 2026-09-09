"use client";

import React, { useEffect, useState } from "react";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Bell,
  CheckCircle2,
  Trash2,
  Clock,
  Info,
} from "lucide-react";

export default function PartnerNotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await partnerService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await partnerService.markNotificationRead(id);
      await loadNotifications();
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await partnerService.deleteNotification(id);
      await loadNotifications();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-[#111827]"}`}>
          Notifications Inbox
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
          System updates regarding settlement verification status, course enrollments, and compliance reminders.
        </p>
      </div>

      <div className={`p-6 ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className={`p-10 text-center border border-dashed rounded-[16px] text-xs ${isDark ? "border-white/10 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
            <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className={`font-semibold ${isDark ? "text-slate-200" : "text-[#111827]"}`}>No notifications at this time.</p>
            <p className="mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-[16px] transition-all flex items-start justify-between gap-4 ${
                  n.isRead
                    ? isDark
                      ? "bg-white/[0.01]"
                      : "bg-[#FAFAFA]"
                    : isDark
                    ? "bg-[#3D5EF6]/10"
                    : "bg-[#EEF1FE]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-xs ${isDark ? "text-white" : "text-[#111827]"}`}>{n.title || "Notification"}</p>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#3D5EF6]" />
                    )}
                  </div>
                  <p className={`text-[11px] mt-1 ${isDark ? "text-slate-300" : "text-[#6B7280]"}`}>{n.message}</p>
                  <span className={`text-[10px] mt-2 block ${isDark ? "text-slate-400" : "text-[#9CA3AF]"}`}>
                    {new Date(n.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-2 rounded-full text-[#3D5EF6] hover:bg-[#EEF1FE] dark:hover:bg-white/10 transition-colors duration-200 text-xs"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-2 rounded-full text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-white/10 transition-colors duration-200 text-xs"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
