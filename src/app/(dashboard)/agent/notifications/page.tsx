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
  const card = `rounded-3xl p-6 md:p-8 border shadow-xl relative overflow-hidden backdrop-blur-xl ${
    isDark
      ? "bg-[#0d1f35]/80 border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white"
      : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
  }`;
  const ht = isDark ? "text-white/95" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const borderB = isDark ? "border-white/5" : "border-slate-100";

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
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
    if (cleanTitle.includes("reject") || cleanTitle.includes("expired")) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    if (cleanTitle.includes("commission") || cleanTitle.includes("payout")) {
      return <Info className="w-4 h-4 text-cyan-400" />;
    }
    return <Bell className="w-4 h-4 text-slate-450" />;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className={card}>
        <div className="flex items-center gap-2 border-b pb-4 mb-6 border-white/5">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold">Inbox Messages</h3>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6 text-slate-500" />
            </div>
            <p className={`text-xs ${mt}`}>All caught up! You have no active notifications.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 justify-between ${
                  notif.isRead
                    ? isDark
                      ? "bg-slate-950/20 border-slate-900/60 opacity-60"
                      : "bg-slate-50/50 border-slate-150/40 opacity-70"
                    : isDark
                    ? "bg-[#0b182d] border-cyan-500/10 shadow-[0_2px_8px_rgba(6,182,212,0.05)]"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isDark ? "bg-slate-900" : "bg-slate-100"
                  }`}>
                    {getNotifIcon(notif.title)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">{notif.title}</p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                      )}
                    </div>
                    <p className={`text-[11px] mt-1.5 leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {notif.message}
                    </p>
                    <p className={`text-[9px] mt-2 font-semibold ${isDark ? "text-slate-600" : "text-slate-400"}`}>
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
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        isDark ? "border-slate-800 hover:bg-white/5 text-slate-400 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                      title="Mark as read"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                      isDark ? "border-slate-800 hover:bg-white/5 text-slate-450 hover:text-red-400" : "border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-red-600"
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
