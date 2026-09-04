"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Check, LogIn } from "lucide-react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
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
    login({ email, password })
      .then((user) => {
        console.log("LoginForm login resolved with user:", user);
        const role = user.role?.toLowerCase();
        console.log("LoginForm target role:", role);
        if (role === "seafarer" || role === "seafearer") {
          console.log("LoginForm pushing /seafearer/dashboard");
          router.push("/seafearer/dashboard");
        } else if (role === "company_admin" || role === "company-admin") {
          console.log("LoginForm pushing /company-admin/dashboard");
          router.push("/company-admin/dashboard");
        } else if (role === "agent_admin" || role === "agent-admin") {
          console.log("LoginForm pushing /agent-admin/dashboard");
          router.push("/agent-admin/dashboard");
        } else if (role === "agent") {
          console.log("LoginForm pushing /agent/dashboard");
          router.push("/agent/dashboard");
        } else {
          console.log("LoginForm pushing /master/dashboard");
          router.push("/master/dashboard");
        }
      })
      .catch((err) => {
        setErrors({ submit: err.message || "Invalid email or password" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {errors.submit && (
        <div className={`p-3 rounded-lg text-xs font-semibold ${isDark ? "bg-red-950/40 border border-red-500/30 text-red-400" : "bg-red-50 border border-red-200 text-red-600"}`}>
          {errors.submit}
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
            w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200
            ${
              isDark 
                ? rememberMe ? "bg-[#3D5EF6] border-[#3D5EF6]" : "border-[#374151] bg-[#111827] group-hover:border-gray-500"
                : rememberMe ? "bg-[#3D5EF6] border-[#3D5EF6]" : "border-[#E5E7EB] bg-white group-hover:border-gray-400"
            }
          `}>
            {rememberMe && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
          </div>
          <span className={`text-xs transition-colors duration-200 ${
            isDark ? "text-gray-400 group-hover:text-gray-300" : "text-[#6B7280] group-hover:text-[#111827]"
          }`}>
            Remember me
          </span>
        </label>

        <Link
          href="/reset-password"
          className={`text-xs font-semibold transition-colors duration-200 ${
            isDark ? "text-[#3D5EF6] hover:text-[#2E4FE0]" : "text-[#3D5EF6] hover:text-[#2E4FE0]"
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
          w-full mt-2 py-3.5 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed
          bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white
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

      <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
        Don't have an account?{" "}
        <Link href="/register" className={`font-semibold transition-colors duration-200 ${isDark ? "text-[#3D5EF6] hover:text-[#2E4FE0]" : "text-[#3D5EF6] hover:text-[#2E4FE0]"}`}>
          Sign Up
        </Link>
      </p>
    </form>
  );
}