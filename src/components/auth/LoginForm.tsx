"use client";

import React from "react";
import Link from "next/link";
import { Mail, Check, LogIn } from "lucide-react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email address is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const { theme, mounted } = useTheme();

  const isDark = mounted ? theme === "dark" : true;
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setError,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const cleanData = {
        email: (data.email || "").trim(),
        password: (data.password || "").trim(),
      };
      const user = await login(cleanData);
      const role = (user.role || "").toLowerCase().replace("_", "-");
      const redirectUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect")
          : null;

      let targetPath = "/master/dashboard";
      if (role === "seafarer") {
        targetPath = "/seafarer/dashboard";
      } else if (role === "company-admin") {
        targetPath = "/company-admin/dashboard";
      } else if (role === "partner-admin" || role === "agent-admin") {
        targetPath = "/agent-admin/dashboard";
      } else if (role === "partner" || role === "agent") {
        targetPath = "/partner/dashboard";
      } else {
        targetPath = "/master/dashboard";
      }

      if (
        redirectUrl &&
        redirectUrl.startsWith("/") &&
        !redirectUrl.startsWith("//")
      ) {
        const roleFolder =
          role === "master"
            ? "/master"
            : role === "partner-admin" || role === "agent-admin"
              ? "/agent-admin"
              : `/${role}`;
        if (
          redirectUrl.startsWith(roleFolder) ||
          (roleFolder === "/agent-admin" &&
            redirectUrl.startsWith("/partner-admin"))
        ) {
          targetPath = redirectUrl;
        }
      }

      router.push(targetPath);
      toast.success("Login successful! Redirecting...");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {formErrors.root && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold ${isDark ? "bg-red-950/40 border border-red-500/30 text-red-400" : "bg-red-50 border border-red-200 text-red-600"}`}
        >
          {formErrors.root.message}
        </div>
      )}

      <AuthInput
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        icon={Mail}
        error={formErrors.email?.message}
        required
        {...register("email")}
      />

      <PasswordInput
        label="Password"
        placeholder="••••••••"
        error={formErrors.password?.message}
        required
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer group select-none">
          <input type="checkbox" className="sr-only" />
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 ${isDark ? "border-[#374151] bg-[#111827] group-hover:border-gray-500" : "border-[#E5E7EB] bg-white group-hover:border-gray-400"}`}
          >
            <Check className="w-3.5 h-3.5 text-white stroke-[3px] opacity-0" />
          </div>
          <span
            className={`text-xs transition-colors duration-200 ${isDark ? "text-gray-400 group-hover:text-gray-300" : "text-[#6B7280] group-hover:text-[#111827]"}`}
          >
            Remember me
          </span>
        </label>

        <Link
          href="/reset-password"
          className={`text-xs font-semibold transition-colors duration-200 ${isDark ? "text-[#3D5EF6] hover:text-[#2E4FE0]" : "text-[#3D5EF6] hover:text-[#2E4FE0]"}`}
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="w-full mt-2 py-3.5 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
      >
        <LogIn className="w-5 h-5" />
        Login
      </button>

      <p
        className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className={`font-semibold transition-colors duration-200 ${isDark ? "text-[#3D5EF6] hover:text-[#2E4FE0]" : "text-[#3D5EF6] hover:text-[#2E4FE0]"}`}
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
