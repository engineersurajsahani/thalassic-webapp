"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentService } from "@/services/agent.service";
import { Bell, Eye, Trash2, CheckCircle2, AlertTriangle, MessageSquare, Info, RefreshCw } from "lucide-react";

export default function NotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Styling helpers
  const card = `rounded-[16px] p-6 md:p-8 border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden ${
    isDark
      ? "bg-[#0B0F19] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
      : "bg-white text-[#111827]"
  }`;
  const ht = isDark ? "text-white/95" : "text-[#111827]";
  const mt = isDark ? "text-white/35" : "text-[#6B7280]";
  const labelText = isDark ? "text-white/50" : "text-[#6B7280]";
  const borderB = isDark ? "border-[#1F2937]" : "border-[#E5E7EB]";

  const fetchNotifications = async () => {
    try {
      const data = await agentService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await agentService.markNotificationRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await agentService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const getNotifIcon = (title: string) => {
    const cleanTitle = title.toLowerCase();
    if (cleanTitle.includes("verify") || cleanTitle.includes("approve")) {
      return <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />;
    }
    if (cleanTitle.includes("reject") || cleanTitle.includes("expired")) {
      return <AlertTriangle className="w-4 h-4 text-[#DC2626]" />;
    }
    if (cleanTitle.includes("commission") || cleanTitle.includes("payout")) {
      return <Info className="w-4 h-4 text-[#3D5EF6]" />;
    }
    return <Bell className="w-4 h-4 text-[#9CA3AF]" />;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Agent Notifications</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Stay updated with real-time alerts regarding referral leads, document verifications, and commission status.</p>
        </div>
        <button
          onClick={fetchNotifications}
          className={`p-2.5 rounded-full border flex items-center justify-center cursor-pointer transition-colors duration-200 ${isDark ? "border-[#1F2937] hover:bg-white/5 text-white/50" : "border-[#E5E7EB] hover:bg-[#EEF1FE] hover:text-[#3D5EF6] text-[#6B7280] shadow-sm"}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className={card}>
        <div className={`flex items-center gap-2 border-b pb-4 mb-6 ${borderB}`}>
          <Bell className="w-4 h-4 text-[#3D5EF6]" />
          <h3 className="text-sm font-bold">Inbox Messages</h3>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EEF1FE] dark:bg-[#3D5EF6]/10 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6 text-[#3D5EF6]" />
            </div>
            <p className={`text-xs ${mt}`}>All caught up! You have no active notifications.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-[16px] border transition-colors duration-200 flex items-start gap-4 justify-between ${
                  notif.isRead
                    ? isDark
                      ? "bg-[#0B0F19]/50 border-[#1F2937] opacity-60"
                      : "bg-[#FAFAFA] border-[#E5E7EB] opacity-70"
                    : isDark
                    ? "bg-[#0B0F19] border-[#3D5EF6]/30 shadow-sm"
                    : "bg-white border-[#3D5EF6]/20 shadow-sm"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isDark ? "bg-[#111827]" : "bg-[#F3F4F6]"
                  }`}>
                    {getNotifIcon(notif.title)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">{notif.title}</p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3D5EF6] animate-ping" />
                      )}
                    </div>
                    <p className={`text-[11px] mt-1.5 leading-relaxed ${
                      isDark ? "text-slate-300" : "text-[#6B7280]"
                    }`}>
                      {notif.message}
                    </p>
                    <p className={`text-[9px] mt-2 font-semibold ${isDark ? "text-white/40" : "text-[#9CA3AF]"}`}>
                      {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={`p-1.5 rounded-full border transition-colors duration-200 cursor-pointer ${
                        isDark ? "border-[#1F2937] hover:bg-white/5 text-slate-400 hover:text-white" : "border-[#E5E7EB] hover:bg-[#EEF1FE] text-[#6B7280] hover:text-[#3D5EF6]"
                      }`}
                      title="Mark as read"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className={`p-1.5 rounded-full border transition-colors duration-200 cursor-pointer ${
                      isDark ? "border-[#1F2937] hover:bg-white/5 text-slate-400 hover:text-[#DC2626]" : "border-[#E5E7EB] hover:bg-[#FEE2E2] text-[#6B7280] hover:text-[#DC2626]"
                    }`}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
