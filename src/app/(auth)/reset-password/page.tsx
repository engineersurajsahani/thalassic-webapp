"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Check, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import api from "@/lib/axios";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      toast.success("Instructions have been sent if an account exists.");
      setIsSuccess(true);
    } catch {
      // Graceful fallback for UI continuity
      toast.success("Instructions have been sent if an account exists.");
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive recovery instructions"
    >
      {isSuccess ? (
        <div className="text-center py-6 animate-fadeIn">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Check className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Instructions Sent!</h3>
          <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
            We've sent recovery details to <span className="text-cyan-400">{email}</span> if it matches an active account.
          </p>
          <Link
            href="/login"
            className="inline-flex w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            error={error}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Send Instructions"
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Remembered your password?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
