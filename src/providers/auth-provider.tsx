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
      // Only call seafarer profile endpoint for seafarer roles
      const role = getCookie("user_role_seafarer") || getCookie("user_role");
      const roleNorm = role?.toLowerCase().replace('_', '-');
      if (roleNorm === "seafarer" || roleNorm === "seafearer") {
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
      let token = getCookie("auth_token");
      let currentRole = "";
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname.startsWith("/agent-admin")) {
          token = getCookie("auth_token_agent-admin") || token;
          currentRole = "agent-admin";
        } else if (pathname.startsWith("/agent")) {
          token = getCookie("auth_token_agent") || token;
          currentRole = "agent";
        } else if (pathname.startsWith("/company-admin")) {
          token = getCookie("auth_token_company-admin") || token;
          currentRole = "company-admin";
        } else if (pathname.startsWith("/master")) {
          token = getCookie("auth_token_master") || token;
          currentRole = "master";
        } else if (pathname.startsWith("/seafarer") || pathname.startsWith("/seafearer")) {
          token = getCookie("auth_token_seafarer") || token;
          currentRole = "seafarer";
        }
      }

      if (token) {
        const profileUser = await fetchProfile();
        if (profileUser) {
          setUser(profileUser);
          const roleSuffix = profileUser.role.toLowerCase().replace('_', '-');
          if (profileUser.onboardingStatus) {
            setCookie("onboarding_status", profileUser.onboardingStatus);
            setCookie(`onboarding_status_${roleSuffix}`, profileUser.onboardingStatus);
          } else {
            deleteCookie("onboarding_status");
            deleteCookie(`onboarding_status_${roleSuffix}`);
          }
        } else {
          // Token expired or invalid
          deleteCookie("auth_token");
          deleteCookie("user_role");
          deleteCookie("onboarding_status");
          if (currentRole) {
            deleteCookie(`auth_token_${currentRole}`);
            deleteCookie(`user_role_${currentRole}`);
            deleteCookie(`onboarding_status_${currentRole}`);
          }
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    bootstrapSession();
  }, [router]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user: loggedUser } = response.data;
      const roleSuffix = loggedUser.role.toLowerCase().replace('_', '-');

      setCookie("auth_token", token);
      setCookie("user_role", loggedUser.role);
      setCookie(`auth_token_${roleSuffix}`, token);
      setCookie(`user_role_${roleSuffix}`, loggedUser.role);
      
      // Fetch full profile (includes nested seaService logs)
      const fullProfile = await fetchProfile();
      const finalUser = fullProfile || loggedUser;
      
      if (finalUser.onboardingStatus) {
        setCookie("onboarding_status", finalUser.onboardingStatus);
        setCookie(`onboarding_status_${roleSuffix}`, finalUser.onboardingStatus);
      } else {
        deleteCookie("onboarding_status");
        deleteCookie(`onboarding_status_${roleSuffix}`);
      }

      setUser(finalUser);
      return finalUser;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
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

      setCookie("auth_token", token);
      setCookie("user_role", registeredUser.role);
      setCookie(`auth_token_${roleSuffix}`, token);
      setCookie(`user_role_${roleSuffix}`, registeredUser.role);
      
      const fullProfile = await fetchProfile();
      const finalUser = fullProfile || registeredUser;

      if (finalUser.onboardingStatus) {
        setCookie("onboarding_status", finalUser.onboardingStatus);
        setCookie(`onboarding_status_${roleSuffix}`, finalUser.onboardingStatus);
      } else {
        deleteCookie("onboarding_status");
        deleteCookie(`onboarding_status_${roleSuffix}`);
      }

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
      const currentRole = user?.role?.toLowerCase().replace('_', '-');
      deleteCookie("auth_token");
      deleteCookie("user_role");
      deleteCookie("onboarding_status");
      if (currentRole) {
        deleteCookie(`auth_token_${currentRole}`);
        deleteCookie(`user_role_${currentRole}`);
        deleteCookie(`onboarding_status_${currentRole}`);
      }
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
