"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(({
  label,
  icon: Icon,
  error,
  className = "",
  id,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;
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
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
            isDark 
              ? "text-gray-400 group-focus-within:text-[#3D5EF6]" 
              : "text-gray-400 group-focus-within:text-[#3D5EF6]"
          }`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-xl border outline-none transition-colors duration-200 text-sm pr-4 py-3
            ${Icon ? "pl-11" : "px-4"}
            ${
              isDark 
                ? `bg-[#111827] text-white placeholder-gray-500
                   ${error 
                     ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]" 
                     : "border-[#374151] focus:border-[#3D5EF6] focus:ring-1 focus:ring-[#3D5EF6]"
                   }`
                : `bg-white text-[#111827] placeholder-[#6B7280]
                   ${error 
                     ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]" 
                     : "border-[#E5E7EB] focus:border-[#3D5EF6] focus:ring-1 focus:ring-[#3D5EF6]"
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
});

AuthInput.displayName = "AuthInput";

export default AuthInput;
