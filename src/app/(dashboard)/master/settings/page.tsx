"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Settings, Globe, Bell, Shield, CreditCard,
  Mail, Key, Palette, Database, ChevronRight,
  Save, ToggleLeft, ToggleRight, Eye, EyeOff,
  Plus, Trash2, Check, AlertTriangle,
} from "lucide-react";

const TABS = [
  { key: "general",      label: "General",        Icon: Globe      },
  { key: "notifications",label: "Notifications",   Icon: Bell       },
  { key: "security",     label: "Security",        Icon: Shield     },
  { key: "billing",      label: "Billing & Fees",  Icon: CreditCard },
  { key: "email",        label: "Email Templates", Icon: Mail       },
  { key: "api",          label: "API & Integrations", Icon: Key     },
];

function Toggle({ enabled, onChange, dk }: { enabled: boolean; onChange: () => void; dk: boolean }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-sky-500" : dk ? "bg-white/10" : "bg-slate-200"}`}
      style={{ width: 40, height: 22 }}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-[18px]" : "translate-x-0"}`}
        style={{ width: 18, height: 18 }} />
    </button>
  );
}

function Section({ title, description, children, dk }: { title: string; description?: string; children: React.ReactNode; dk: boolean }) {
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/40" : "text-slate-400";
  const border = dk ? "border-white/5" : "border-slate-100";
  return (
    <div className={`border-b pb-8 mb-8 ${border} last:border-0 last:pb-0 last:mb-0`}>
      <div className="mb-5">
        <h3 className={`text-sm font-semibold ${ht}`}>{title}</h3>
        {description && <p className={`text-xs mt-1 ${mt}`}>{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children, dk }: { label: string; hint?: string; children: React.ReactNode; dk: boolean }) {
  const ht = dk ? "text-white/80" : "text-slate-700";
  const mt = dk ? "text-white/35" : "text-slate-400";
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 items-start">
      <div>
        <p className={`text-[13px] font-medium ${ht}`}>{label}</p>
        {hint && <p className={`text-[11px] mt-0.5 ${mt}`}>{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [tab, setTab] = useState("general");
  const [saved, setSaved] = useState(false);

  // General
  const [platformName, setPlatformName] = useState("Thalassic");
  const [supportEmail, setSupportEmail] = useState("support@thalassic.in");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notifications
  const [newRegistration, setNewRegistration] = useState(true);
  const [paymentAlert, setPaymentAlert]       = useState(true);
  const [commissionAlert, setCommissionAlert] = useState(true);
  const [weeklyReport, setWeeklyReport]       = useState(false);
  const [systemAlerts, setSystemAlerts]       = useState(true);

  // Security
  const [twoFactor, setTwoFactor]       = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [showApiKey, setShowApiKey]     = useState(false);
  const apiKey = "sk-thal-xxxxxxxxxxxx-2025-prod";

  // Billing
  const [courseFee, setCourseFee]           = useState("5");
  const [agentCommission, setAgentCommission] = useState("8");
  const [gstEnabled, setGstEnabled]         = useState(true);
  const [autoInvoice, setAutoInvoice]       = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // theme tokens
  const ht   = dk ? "text-white"       : "text-slate-800";
  const mt   = dk ? "text-white/40"    : "text-slate-400";
  const card = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk
    ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-sky-500/50 outline-none"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";
  const selectCls = dk
    ? "bg-[#0f2035] border border-white/8 text-white outline-none focus:border-sky-500/50"
    : "bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-sky-400";
  const sidebarBg = dk ? "bg-[#0c1a2e] border border-white/5" : "bg-slate-50 border border-slate-200";
  const activeTab = dk ? "bg-sky-500/15 text-sky-400" : "bg-sky-50 text-sky-600";
  const inactiveTab = dk ? "text-white/40 hover:bg-white/5 hover:text-white/70" : "text-slate-500 hover:bg-white hover:text-slate-700";
  const borderCls = dk ? "border-white/5" : "border-slate-200";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Settings</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage platform configuration, security, and integrations</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 shadow-md ${
            saved
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20"
          }`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar tabs */}
        <div className={`w-52 shrink-0 rounded-2xl p-2 space-y-0.5 ${sidebarBg}`}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                tab === t.key ? activeTab : inactiveTab
              }`}
            >
              <t.Icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`flex-1 ${card} p-8`}>

          {/* ── General ─────────────────────────────────────────────────────── */}
          {tab === "general" && (
            <div>
              <Section title="Platform Identity" description="Basic information about your platform." dk={dk}>
                <Field label="Platform Name" hint="Shown in emails and UI headers." dk={dk}>
                  <input value={platformName} onChange={e => setPlatformName(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </Field>
                <Field label="Support Email" hint="Users will contact you at this address." dk={dk}>
                  <input value={supportEmail} onChange={e => setSupportEmail(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </Field>
              </Section>

              <Section title="Regional Settings" description="Timezone, currency, and locale." dk={dk}>
                <Field label="Timezone" dk={dk}>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${selectCls}`}>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8)</option>
                  </select>
                </Field>
                <Field label="Currency" dk={dk}>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${selectCls}`}>
                    <option value="INR">INR — Indian Rupee (₹)</option>
                    <option value="USD">USD — US Dollar ($)</option>
                    <option value="AED">AED — UAE Dirham (د.إ)</option>
                    <option value="SGD">SGD — Singapore Dollar (S$)</option>
                  </select>
                </Field>
              </Section>

              <Section title="Maintenance" description="Control platform availability." dk={dk}>
                <Field label="Maintenance Mode" hint="Blocks all user logins except Master Admin." dk={dk}>
                  <div className="flex items-center gap-3">
                    <Toggle enabled={maintenanceMode} onChange={() => setMaintenanceMode(v => !v)} dk={dk} />
                    <span className={`text-sm ${maintenanceMode ? "text-amber-400 font-semibold" : mt}`}>
                      {maintenanceMode ? "⚠ Platform is in maintenance mode" : "Platform is live"}
                    </span>
                  </div>
                </Field>
              </Section>
            </div>
          )}

          {/* ── Notifications ────────────────────────────────────────────────── */}
          {tab === "notifications" && (
            <div>
              <Section title="Email Notifications" description="Choose which events trigger email alerts to you." dk={dk}>
                {[
                  { label: "New Registration",     hint: "When a new Company Admin or Agent Admin signs up.", val: newRegistration, set: setNewRegistration },
                  { label: "Payment Alerts",        hint: "On every successful or failed payment.",             val: paymentAlert,    set: setPaymentAlert    },
                  { label: "Commission Alerts",     hint: "When a commission becomes payable or is settled.",   val: commissionAlert, set: setCommissionAlert },
                  { label: "Weekly Summary Report", hint: "Automated weekly digest every Monday 8AM.",          val: weeklyReport,    set: setWeeklyReport    },
                  { label: "System Alerts",         hint: "Critical system errors and downtime notifications.", val: systemAlerts,    set: setSystemAlerts    },
                ].map(item => (
                  <Field key={item.label} label={item.label} hint={item.hint} dk={dk}>
                    <Toggle enabled={item.val} onChange={() => item.set(v => !v)} dk={dk} />
                  </Field>
                ))}
              </Section>
            </div>
          )}

          {/* ── Security ─────────────────────────────────────────────────────── */}
          {tab === "security" && (
            <div>
              <Section title="Authentication" description="Control login and session security." dk={dk}>
                <Field label="Two-Factor Authentication" hint="Require 2FA for all master admin logins." dk={dk}>
                  <Toggle enabled={twoFactor} onChange={() => setTwoFactor(v => !v)} dk={dk} />
                </Field>
                <Field label="Session Timeout" hint="Auto-logout after inactivity (minutes)." dk={dk}>
                  <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                    className={`w-48 px-3 py-2 text-sm rounded-lg border transition-colors ${selectCls}`}>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </Field>
              </Section>

              <Section title="API Key" description="Use this key to authenticate platform API requests." dk={dk}>
                <Field label="Live API Key" hint="Keep this secret. Regenerate if compromised." dk={dk}>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 px-3 py-2 text-sm rounded-lg border font-mono ${inputCls}`}>
                      {showApiKey ? apiKey : "sk-thal-••••••••••••-2025-prod"}
                    </div>
                    <button onClick={() => setShowApiKey(v => !v)}
                      className={`p-2 rounded-lg border transition-colors ${dk ? "border-white/8 text-white/40 hover:text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}>
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Regenerate Key" hint="This will immediately invalidate the old key." dk={dk}>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                    <Key className="w-4 h-4" /> Regenerate API Key
                  </button>
                </Field>
              </Section>

              <Section title="Danger Zone" description="Irreversible platform actions." dk={dk}>
                <div className={`flex items-start gap-4 p-4 rounded-xl border ${dk ? "border-red-500/20 bg-red-500/5" : "border-red-200 bg-red-50"}`}>
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${dk ? "text-red-400" : "text-red-600"}`}>Delete All Platform Data</p>
                    <p className={`text-xs mt-1 ${dk ? "text-red-400/60" : "text-red-400"}`}>Permanently deletes all users, invoices, and platform records. Cannot be undone.</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shrink-0">
                    Delete
                  </button>
                </div>
              </Section>
            </div>
          )}

          {/* ── Billing & Fees ───────────────────────────────────────────────── */}
          {tab === "billing" && (
            <div>
              <Section title="Platform Fees" description="Configure default fee percentages applied platform-wide." dk={dk}>
                <Field label="Course Platform Fee" hint="Percentage charged on every course transaction." dk={dk}>
                  <div className="flex items-center gap-2 w-48">
                    <input type="number" value={courseFee} onChange={e => setCourseFee(e.target.value)}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                    <span className={`text-sm font-semibold ${mt}`}>%</span>
                  </div>
                </Field>
                <Field label="Agent Commission Rate" hint="Default commission % paid to agent admins." dk={dk}>
                  <div className="flex items-center gap-2 w-48">
                    <input type="number" value={agentCommission} onChange={e => setAgentCommission(e.target.value)}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                    <span className={`text-sm font-semibold ${mt}`}>%</span>
                  </div>
                </Field>
              </Section>

              <Section title="Tax & Invoicing" description="GST and invoice automation settings." dk={dk}>
                <Field label="GST Enabled" hint="Apply 18% GST to all platform invoices." dk={dk}>
                  <Toggle enabled={gstEnabled} onChange={() => setGstEnabled(v => !v)} dk={dk} />
                </Field>
                <Field label="Auto-Generate Invoices" hint="Automatically raise invoices on each successful payment." dk={dk}>
                  <Toggle enabled={autoInvoice} onChange={() => setAutoInvoice(v => !v)} dk={dk} />
                </Field>
              </Section>

              <Section title="Payment Methods" description="Accepted payment modes on the platform." dk={dk}>
                {["UPI / QR Code", "Credit / Debit Card", "Net Banking", "Wallet (Paytm, PhonePe)"].map((method, i) => (
                  <Field key={method} label={method} dk={dk}>
                    <Toggle enabled={i < 3} onChange={() => {}} dk={dk} />
                  </Field>
                ))}
              </Section>
            </div>
          )}

          {/* ── Email Templates ──────────────────────────────────────────────── */}
          {tab === "email" && (
            <div>
              <Section title="Transactional Emails" description="Manage email templates sent to users." dk={dk}>
                {[
                  { name: "Welcome Email",           trigger: "On new account creation",    status: "active"   },
                  { name: "Payment Confirmation",    trigger: "After successful payment",   status: "active"   },
                  { name: "Invoice Generated",       trigger: "When invoice is raised",     status: "active"   },
                  { name: "Course Completion",       trigger: "On completing a course",     status: "active"   },
                  { name: "Password Reset",          trigger: "On reset password request",  status: "active"   },
                  { name: "Commission Payout",       trigger: "When commission is settled", status: "inactive" },
                  { name: "Account Suspended",       trigger: "On account deactivation",    status: "inactive" },
                ].map(t => (
                  <div key={t.name} className={`flex items-center justify-between py-3 border-b ${dk ? "border-white/5" : "border-slate-100"} last:border-0`}>
                    <div>
                      <p className={`text-sm font-medium ${ht}`}>{t.name}</p>
                      <p className={`text-[11px] mt-0.5 ${mt}`}>{t.trigger}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        t.status === "active"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : dk ? "bg-white/5 text-white/30" : "bg-slate-100 text-slate-400"
                      }`}>{t.status}</span>
                      <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${dk ? "border-white/8 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </Section>
            </div>
          )}

          {/* ── API & Integrations ───────────────────────────────────────────── */}
          {tab === "api" && (
            <div>
              <Section title="Connected Integrations" description="Third-party services connected to Thalassic." dk={dk}>
                {[
                  { name: "Supabase",     desc: "Database & Auth provider",        status: "connected",    color: "text-emerald-400" },
                  { name: "Razorpay",     desc: "Payment gateway",                  status: "connected",    color: "text-emerald-400" },
                  { name: "SendGrid",     desc: "Transactional email service",      status: "connected",    color: "text-emerald-400" },
                  { name: "Twilio",       desc: "SMS & WhatsApp notifications",     status: "disconnected", color: "text-red-400"     },
                  { name: "AWS S3",       desc: "Document & certificate storage",   status: "connected",    color: "text-emerald-400" },
                  { name: "Google Maps",  desc: "Location services",                status: "disconnected", color: "text-red-400"     },
                ].map(item => (
                  <div key={item.name} className={`flex items-center justify-between py-3.5 border-b ${dk ? "border-white/5" : "border-slate-100"} last:border-0`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                        item.status === "connected" ? "bg-emerald-500" : dk ? "bg-white/10" : "bg-slate-200"
                      }`}>
                        {item.name[0]}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${ht}`}>{item.name}</p>
                        <p className={`text-[11px] mt-0.5 ${mt}`}>{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-semibold ${item.color}`}>● {item.status}</span>
                      <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${dk ? "border-white/8 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                        {item.status === "connected" ? "Configure" : "Connect"}
                      </button>
                    </div>
                  </div>
                ))}
              </Section>

              <Section title="Webhooks" description="Configure external endpoints for platform events." dk={dk}>
                <div className={`flex items-center justify-between py-2`}>
                  <p className={`text-sm ${mt}`}>No webhooks configured yet.</p>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Webhook
                  </button>
                </div>
              </Section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
