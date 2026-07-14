"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Check, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import { useTheme } from "@/providers/theme-provider";

export default function LoginForm() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "master") {
        router.push("/master/dashboard");
      } else {
        // Default redirect for other roles
        router.push("/dashboard");
      }
    } catch (error) {
      setApiError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {/* API Error Message */}
      {apiError && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          isDark 
            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
            : "bg-red-50 text-red-600 border border-red-200"
        }`}>
          {apiError}
        </div>
      )}

      {/* Email Address */}
      <AuthInput
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        icon={Mail}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) {
            setErrors((prev) => {
              const copy = { ...prev };
              delete copy.email;
              return copy;
            });
          }
          if (apiError) {
            setApiError("");
          }
        }}
        error={errors.email}
        required
      />

      {/* Password */}
      <PasswordInput
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) {
            setErrors((prev) => {
              const copy = { ...prev };
              delete copy.password;
              return copy;
            });
          }
          if (apiError) {
            setApiError("");
          }
        }}
        error={errors.password}
        required
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="sr-only"
          />
          <div className={`
            w-5 h-5 rounded border flex items-center justify-center transition-all duration-300
            ${
              isDark 
                ? rememberMe ? "bg-cyan-600 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "border-gray-800 bg-[#051625] group-hover:border-gray-700"
                : rememberMe ? "bg-[#3b71cb] border-[#3b71cb] shadow-sm" : "border-slate-300 bg-white group-hover:border-slate-400"
            }
          `}>
            {rememberMe && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
          </div>
          <span className={`text-xs transition-colors ${
            isDark ? "text-gray-400 group-hover:text-gray-300" : "text-slate-500 group-hover:text-slate-600"
          }`}>
            Remember me
          </span>
        </label>

        <Link
          href="/reset-password"
          className={`text-xs font-semibold transition-colors ${
            isDark ? "text-cyan-400 hover:text-cyan-300" : "text-[#3b71cb] hover:text-blue-700"
          }`}
        >
          Forgot password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full mt-2 py-3.5 font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed
          ${
            isDark 
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white" 
              : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
          }
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Login
          </>
        )}
      </button>

      <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
        Don't have an account?{" "}
        <Link href="/register" className={`font-semibold transition-colors ${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-[#3b71cb] hover:text-blue-700"}`}>
          Sign Up
        </Link>
      </p>
    </form>
  );
}