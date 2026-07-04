"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export default function AuthInput({
  label,
  icon: Icon,
  error,
  className = "",
  id,
  ...props
}: AuthInputProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const inputId = id || `auth-input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={`block text-sm font-semibold mb-1.5 tracking-wide transition-colors ${
          isDark ? "text-gray-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>
      
      <div className="relative rounded-xl shadow-sm group">
        {Icon && (
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
            isDark 
              ? "text-gray-500 group-focus-within:text-cyan-400" 
              : "text-slate-400 group-focus-within:text-[#3b71cb]"
          }`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            block w-full rounded-xl border outline-none transition-all duration-300 text-sm pr-4 py-3
            ${Icon ? "pl-11" : "px-4"}
            ${
              isDark 
                ? `bg-[#051625] text-white placeholder-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]
                   ${error 
                     ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                     : "border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15),inset_0_2px_4px_rgba(0,0,0,0.4)]"
                   }`
                : `bg-white text-slate-900 placeholder-slate-400
                   ${error 
                     ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                     : "border-slate-300 focus:border-[#3b71cb] focus:ring-1 focus:ring-[#3b71cb] focus:shadow-[0_0_8px_rgba(59,113,203,0.15)]"
                   }`
            }
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className={`mt-1.5 text-xs font-medium flex items-center gap-1 animate-fadeIn ${
          isDark ? "text-red-400" : "text-red-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${isDark ? "bg-red-400" : "bg-red-500"}`} />
          {error}
        </p>
      )}
    </div>
  );
}
