"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Phone, Check, UserCheck, Shield, Anchor, Plus, Hash } from "lucide-react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: any;
}

const ROLES: RoleOption[] = [
  {
    value: "seafarer",
    label: "Seafarer",
    description: "Browse courses, upload CDC/documents & track certification",
    icon: Anchor,
  },
  {
    value: "company-admin",
    label: "Company Admin",
    description: "Manage bookings, view invoices & coordinate crew training",
    icon: UserCheck,
  },
  {
    value: "master",
    label: "Master / Admin",
    description: "Administrative access for system logs & approvals",
    icon: Shield,
  },
];

export default function RegisterForm() {
  const { theme, mounted } = useTheme();

  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    indosNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [role, setRole] = useState("seafarer");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  

  const isDark = mounted ? theme === "dark" : true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // 1. First Name & Last Name (mandatory, separate fields)
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    // 2. Email Address (valid format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }
    
    // 3. Phone Number (required and valid)
    const digitsOnly = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // 4. INDOS Number (mandatory)
    if (!formData.indosNumber.trim()) {
      newErrors.indosNumber = "INDOS Number is required";
    }
    
    // 5. Password Requirements (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const pwd = formData.password;
    const hasMinLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

    if (!pwd) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }

    // 6. Confirm Password (must match)
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // 7. Terms & Privacy Checkbox
    if (!agreed) {
      newErrors.agree = "You must agree to the Terms of Service and Privacy Policy";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    setIsLoading(true);
    register({
      name: fullName,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      indosNumber: formData.indosNumber.trim().toUpperCase(),
      password: formData.password,
      role: role,
    })
      .then(() => {
        setIsSuccess(true);
      })
      .catch((err) => {
        setErrors({ submit: err.message || "Registration failed" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 animate-fadeIn">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${
          isDark 
            ? "bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
            : "bg-blue-50 border border-blue-200 shadow-sm"
        }`}>
          <Check className={`w-7 h-7 ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>Registration Successful!</h3>
        <p className={`mb-6 max-w-sm mx-auto text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
          Welcome to Hari Om Thalassic. An activation link has been sent to <span className={`${isDark ? "text-cyan-400" : "text-[#3b71cb] font-semibold"}`}>{formData.email}</span>.
        </p>
        <Link
          href="/login"
          className={`
            inline-block w-full py-3 font-semibold rounded-xl text-xs text-center shadow-md transition-all duration-300 transform hover:scale-[1.01]
            ${
              isDark 
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white" 
                : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
            }
          `}
        >
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-3">
      {errors.submit && (
        <div className={`p-3 rounded-lg text-xs font-semibold ${isDark ? "bg-red-950/40 border border-red-500/30 text-red-400" : "bg-red-50 border border-red-200 text-red-600"}`}>
          {errors.submit}
        </div>
      )}

      {/* First Name & Last Name - Side by Side on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <AuthInput
          label="First Name"
          name="firstName"
          placeholder="First name"
          icon={User}
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />

        <AuthInput
          label="Last Name"
          name="lastName"
          placeholder="Last name"
          icon={User}
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
      </div>

      {/* Email & Phone Number - Side by Side on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <AuthInput
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="Phone number"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
        />
      </div>

      {/* INDOS Number - 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="md:col-span-2">
          <AuthInput
            label="INDOS Number *"
            name="indosNumber"
            type="text"
            placeholder="e.g. 22GL4567"
            icon={Hash}
            value={formData.indosNumber}
            onChange={handleChange}
            error={errors.indosNumber}
            required
          />
        </div>
      </div>

      {/* Passwords - Side by Side on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <PasswordInput
          label="Password"
          name="password"
          placeholder="••••••••"
          showStrength
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
      </div>

      {/* Terms & Conditions Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (errors.agree) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.agree;
                  return copy;
                });
              }
            }}
            className="sr-only"
          />
          <div className={`
            mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200
            ${
              isDark 
                ? agreed ? "bg-[#3D5EF6] border-[#3D5EF6]" : "border-[#374151] bg-[#111827] group-hover:border-gray-500"
                : agreed ? "bg-[#3D5EF6] border-[#3D5EF6]" : "border-[#E5E7EB] bg-white group-hover:border-gray-400"
            }
          `}>
            {agreed && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
          </div>
          <span className={`text-xs leading-normal transition-colors duration-200 ${
            isDark ? "text-gray-400 group-hover:text-gray-300" : "text-[#6B7280] group-hover:text-[#111827]"
          }`}>
            I agree to the <Link href="/terms" className="font-semibold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors duration-200">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="font-semibold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors duration-200">Privacy Policy</Link>
          </span>
        </label>
        
        {errors.agree && (
          <p className={`mt-1.5 text-xs font-medium flex items-center gap-1 ${isDark ? "text-red-400" : "text-[#DC2626]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${isDark ? "bg-red-400" : "bg-[#DC2626]"}`} />
            {errors.agree}
          </p>
        )}
      </div>

      {/* Register Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-sm bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Plus className="w-4.5 h-4.5" />
            Register
          </>
        )}
      </button>

      <p className={`text-center text-xs mt-4 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors duration-200">
          Login
        </Link>
      </p>
    </form>
  );
}
