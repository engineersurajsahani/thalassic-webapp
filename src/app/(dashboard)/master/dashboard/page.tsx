"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Users,
  BookOpen,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// Mock data
const statistics = [
  {
    title: "Total Registered Seafarers",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "blue",
  },
  {
    title: "Total Courses",
    value: "48",
    change: "+3",
    icon: BookOpen,
    color: "green",
  },
  {
    title: "Total Course Purchases",
    value: "5,234",
    change: "+8%",
    icon: ShoppingCart,
    color: "purple",
  },
  {
    title: "Total Revenue",
    value: "₹24.5L",
    change: "+15%",
    icon: TrendingUp,
    color: "orange",
  },
];

const recentRegistrations = [
  { id: 1, name: "Raj Kumar", email: "raj@example.com", date: "Today" },
  { id: 2, name: "Priya Singh", email: "priya@example.com", date: "Yesterday" },
  { id: 3, name: "Amit Patel", email: "amit@example.com", date: "2 days ago" },
  { id: 4, name: "Suresh Verma", email: "suresh@example.com", date: "3 days ago" },
];

const recentPurchases = [
  { id: 1, user: "Raj Kumar", course: "STCW Safety Training", amount: "₹5,000", date: "Today" },
  { id: 2, user: "Priya Singh", course: "Basic Safety Training", amount: "₹3,500", date: "Yesterday" },
  { id: 3, user: "Amit Patel", course: "Advanced Fire Fighting", amount: "₹7,200", date: "2 days ago" },
];

const recentCourses = [
  { id: 1, title: "STCW Basic Safety", category: "Safety", status: "Active" },
  { id: 2, title: "Maritime Law Basics", category: "Compliance", status: "Active" },
  { id: 3, title: "Ship Navigation", category: "Technical", status: "Draft" },
];

const quickActions = [
  { label: "Add Course", icon: "+" },
  { label: "Manage Users", icon: "👥" },
  { label: "View Reports", icon: "📊" },
];

export default function MasterDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colorMap = {
    blue: isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-600",
    green: isDark ? "bg-green-600/20 text-green-400" : "bg-green-50 text-green-600",
    purple: isDark
      ? "bg-purple-600/20 text-purple-400"
      : "bg-purple-50 text-purple-600",
    orange: isDark
      ? "bg-orange-600/20 text-orange-400"
      : "bg-orange-50 text-orange-600",
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statistics.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border ${
                isDark
                  ? "bg-[#0A1929] border-gray-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${colorMap[stat.color as keyof typeof colorMap]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                {stat.title}
              </p>
              <p
                className={`text-2xl font-bold mt-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Registrations */}
        <div
          className={`p-6 rounded-2xl border ${
            isDark
              ? "bg-[#0A1929] border-gray-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Latest Registrations
          </h3>
          <div className="space-y-3">
            {recentRegistrations.map((reg) => (
              <div
                key={reg.id}
                className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-800/30" : "bg-slate-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {reg.name}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  {reg.email}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  {reg.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases */}
        <div
          className={`p-6 rounded-2xl border ${
            isDark
              ? "bg-[#0A1929] border-gray-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Recent Purchases
          </h3>
          <div className="space-y-3">
            {recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-800/30" : "bg-slate-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {purchase.course}
                </p>
                <div className="flex justify-between items-end mt-2">
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-slate-600"
                    }`}
                  >
                    {purchase.user}
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {purchase.amount}
                  </p>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  {purchase.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Courses */}
        <div
          className={`p-6 rounded-2xl border ${
            isDark
              ? "bg-[#0A1929] border-gray-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Recently Added Courses
          </h3>
          <div className="space-y-3">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-800/30" : "bg-slate-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {course.title}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-slate-600"
                    }`}
                  >
                    {course.category}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      course.status === "Active"
                        ? isDark
                          ? "bg-green-600/20 text-green-400"
                          : "bg-green-50 text-green-600"
                        : isDark
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h3
          className={`text-lg font-bold mb-4 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className={`p-4 rounded-xl border-2 border-dashed transition-all hover:border-solid ${
                isDark
                  ? "border-gray-700 hover:bg-gray-800/50 hover:border-blue-500"
                  : "border-slate-300 hover:bg-slate-100 hover:border-blue-500"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{action.icon}</span>
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {action.label}
                </span>
                <ArrowRight className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-slate-500"}`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

