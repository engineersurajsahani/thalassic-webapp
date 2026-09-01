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
    ? "bg-[#09162c]/80 border-white/5 shadow-sm"
    : "bg-white border-slate-200/80 shadow-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}
          >
            Activity Stream
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
          Notifications Inbox
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          System updates regarding settlement verification status, course enrollments, and compliance reminders.
        </p>
      </div>

      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center border border-dashed rounded-2xl border-white/10 text-slate-400 text-xs">
            <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">No notifications at this time.</p>
            <p className="mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  n.isRead
                    ? "bg-white/[0.01] border-white/5"
                    : "bg-cyan-500/10 border-cyan-500/20"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-xs">{n.title || "Notification"}</p>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {new Date(n.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 text-xs"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs"
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
