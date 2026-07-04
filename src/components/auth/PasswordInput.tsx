"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

export default function PasswordInput({
  label,
  error,
  showStrength = false,
  className = "",
  id,
  value = "",
  onChange,
  ...props
}: PasswordInputProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0); // 0 to 3
  const [strengthLabel, setStrengthLabel] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  const inputId = id || `password-input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  // Evaluate password strength
  useEffect(() => {
    if (!showStrength) return;
    
    const val = String(value);
    if (!val) {
      setStrength(0);
      setStrengthLabel("");
      setStrengthColor(isDark ? "bg-gray-800" : "bg-slate-200");
      return;
    }

    let score = 0;
    if (val.length >= 8) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[A-Z]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 1;

    setStrength(score);

    if (score === 1) {
      setStrengthLabel("Weak password");
      setStrengthColor("bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]");
    } else if (score === 2) {
      setStrengthLabel("Medium strength");
      setStrengthColor("bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]");
    } else if (score === 3) {
      setStrengthLabel(isDark ? "Strong maritime password" : "Strong password");
      setStrengthColor(
        isDark 
          ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
          : "bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.3)]"
      );
    } else {
      setStrengthLabel("Too short");
      setStrengthColor("bg-red-500");
    }
  }, [value, showStrength, isDark]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
          isDark ? "text-gray-500" : "text-slate-400"
        }`}>
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`
            block w-full rounded-xl border outline-none transition-all duration-300 text-sm pl-11 pr-12 py-3
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
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none transition-colors ${
            isDark ? "text-gray-500 hover:text-cyan-400" : "text-slate-400 hover:text-[#3b71cb]"
          }`}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-2.5">
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-900" : "bg-slate-100"}`}>
            <div
              className={`h-full ${strengthColor} transition-all duration-500`}
              style={{ width: `${(strength / 3) * 100}%` }}
            />
          </div>
          <span className={`text-[11px] mt-1 block font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            {strengthLabel}
          </span>
        </div>
      )}
      
      {error && !showStrength && (
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
