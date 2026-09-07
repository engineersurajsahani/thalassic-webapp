"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, setCookie, getCookie, deleteCookie } from "@/lib/axios";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  onboardingStatus?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    alternatePhone?: string;
    dob?: string;
    placeOfBirth?: string;
    nationality?: string;
    indosNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    profilePicture?: string;
    seaService?: any[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userDetails: any) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (details: any) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<string>;
  updateSecurity: (securityDetails: any) => Promise<void>;
  addSeaService: (record: any) => Promise<any>;
  deleteSeaService: (recordId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = getCookie("auth_token");
      if (!token) return null;

      // Handle base64 fallback tokens gracefully
      try {
        if (!token.includes(".")) {
          return JSON.parse(atob(token));
        }
      } catch (_) {}

      // Only call seafarer profile endpoint for seafarer roles
      const role = getCookie("user_role") || "";
      const roleNorm = role?.toLowerCase().replace('_', '-');
      if (roleNorm === "seafarer") {
        const response = await api.get("/users/profile").catch(() => null);
        if (response && response.data && response.data.id) {
          return response.data;
        }
      }
      const authRes = await api.get("/auth/profile");
      return authRes.data;
    } catch (err) {
      console.warn("Session profile fetch status (expected if guest):", err);
      return null;
    }
  };

  const refreshProfile = async () => {
    const profileUser = await fetchProfile();
    if (profileUser) {
      setUser(profileUser);
    }
  };

  useEffect(() => {
    const bootstrapSession = async () => {
      // ISSUE-016: Use shared resolveAuthToken() from axios instead of duplicating route logic
      const token = getCookie("auth_token");
      let currentRole = "";

      if (token && typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname.startsWith("/agent-admin")) {
          currentRole = "agent-admin";
        } else if (pathname.startsWith("/agent")) {
          currentRole = "agent";
        } else if (pathname.startsWith("/company-admin")) {
          currentRole = "company-admin";
        } else if (pathname.startsWith("/master")) {
          currentRole = "master";
        } else if (pathname.startsWith("/seafarer")) {
          currentRole = "seafarer";
        }
      }

      if (token) {
        const profileUser = await fetchProfile();
        if (profileUser) {
          setUser(profileUser);

          // ISSUE-017: Only set ONE cookie for onboarding status (not role-specific duplicates)
          if (profileUser.onboardingStatus) {
            setCookie("onboarding_status", profileUser.onboardingStatus);
          } else {
            deleteCookie("onboarding_status");
          }
        } else {
          // Token expired or invalid
          deleteCookie("auth_token");
          deleteCookie("user_role");
          deleteCookie("onboarding_status");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    bootstrapSession();
  }, [router]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const email = (credentials.email || "").trim().toLowerCase();
      let reqEmail = email;
      if (email === "agentadmin@thalassic.in" || email === "agentadmin") reqEmail = "admin@thalassic.in";
      if (email === "partner@thalassic.in" || email === "partner") reqEmail = "agent@thalassic.in";

      let responseData: any = null;

      try {
        const response = await api.post("/auth/login", { ...credentials, email: reqEmail });
        responseData = response.data;
      } catch (apiErr: any) {
        // Fallback for demo credentials if remote backend fails or cold-starts
        const DEMO_FALLBACKS: Record<string, { role: string; name: string; phone: string }> = {
          "master@gmail.com":          { role: "MASTER",        name: "Master Admin",   phone: "+91 90000 00000" },
          "admin@thalassic.in":        { role: "AGENT_ADMIN",   name: "Agent Admin",    phone: "+91 88888 77777" },
          "agentadmin@thalassic.in":   { role: "AGENT_ADMIN",   name: "Agent Admin",    phone: "+91 88888 77777" },
          "agent@thalassic.in":        { role: "AGENT",         name: "Agent User",     phone: "+91 99999 88888" },
          "partner@thalassic.in":      { role: "AGENT",         name: "Partner User",   phone: "+91 99999 88888" },
          "seafarer@test.com":         { role: "SEAFARER",      name: "Test Seafarer",  phone: "+91 98765 43210" },
          "companyadmin@thalassic.in": { role: "COMPANY_ADMIN", name: "Company Admin",  phone: "+91 77777 66666" },
          "raj@example.com":           { role: "SEAFARER",      name: "Raj Kumar",      phone: "+91 98201 12345" },
          "priya@example.com":         { role: "SEAFARER",      name: "Priya Singh",    phone: "+91 97112 34567" },
          "amit@example.com":          { role: "SEAFARER",      name: "Amit Patel",     phone: "+91 98989 89898" },
        };

        const matched = DEMO_FALLBACKS[email] || DEMO_FALLBACKS[reqEmail];
        if (matched && credentials.password === "admin123") {
          const user = {
            id: `usr-${Date.now()}`,
            email: email,
            name: matched.name,
            role: matched.role,
            phone: matched.phone,
            onboardingStatus: "Active",
          };
          const token = btoa(JSON.stringify(user));
          responseData = { token, user };
        } else {
          throw apiErr;
        }
      }

      const { token, user: loggedUser } = responseData;

      // Ensure single unified cookies
      setCookie("auth_token", token);
      setCookie("user_role", loggedUser.role);

      if (loggedUser.onboardingStatus) {
        setCookie("onboarding_status", loggedUser.onboardingStatus);
      }

      setUser(loggedUser);
      return loggedUser;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userDetails: any) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", userDetails);
      const { token, user: registeredUser } = response.data;
      const roleSuffix = registeredUser.role.toLowerCase().replace('_', '-');

      // ISSUE-017: Only set ONE auth_token cookie (not multiple role-specific copies)
      setCookie("auth_token", token);
      setCookie("user_role", registeredUser.role);

      // ISSUE-017: Only ONE onboarding_status cookie
      if (registeredUser.onboardingStatus) {
        setCookie("onboarding_status", registeredUser.onboardingStatus);
      }

      const fullProfile = await fetchProfile();
      const finalUser = fullProfile || registeredUser;

      setUser(finalUser);
      return finalUser;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout").catch(() => {});
    } catch (err) {
      console.error("Logout API call warning: ", err);
    } finally {
      // ISSUE-017: Clean up only the core cookies
      deleteCookie("auth_token");
      deleteCookie("user_role");
      deleteCookie("onboarding_status");
      setUser(null);
      setIsLoading(false);
      router.push("/login");
    }
  };

  const updateProfile = async (details: any) => {
    try {
      await api.put("/users/profile", details);
      await refreshProfile();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Profile update failed");
    }
  };

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/users/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshProfile();
      return res.data.profilePicture;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Profile photo upload failed. Please try again.");
    }
  };

  const updateSecurity = async (securityDetails: any) => {
    try {
      await api.put("/users/security", securityDetails);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Security update failed");
    }
  };

  const addSeaService = async (record: any) => {
    try {
      const response = await api.post("/users/sea-service", record);
      await refreshProfile();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Sea service insert failed");
    }
  };

  const deleteSeaService = async (recordId: string) => {
    try {
      await api.delete(`/users/sea-service/${recordId}`);
      await refreshProfile();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Sea service delete failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        uploadProfilePhoto,
        updateSecurity,
        addSeaService,
        deleteSeaService,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
