export type Role = 'MASTER' | 'COMPANY_ADMIN' | 'AGENT_ADMIN' | 'AGENT' | 'SEAFARER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  status?: string;
  onboardingStatus?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  expiresIn?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
  indosNumber?: string;
}
