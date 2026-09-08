import { Role } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SeafarerDetail extends UserProfile {
  dob?: string;
  birthPlace?: string;
  fatherName?: string;
  passportNum?: string;
  passportIssue?: string;
  passportExpiry?: string;
  indosNum?: string;
  indosStatus?: string;
  cdcNum?: string;
  cdcExpiry?: string;
  education?: string;
}

export interface SeaServiceRecord {
  id: string;
  userId: string;
  rpsl: string;
  vessel: string;
  vesselType?: string;
  imo?: string;
  rank: string;
  signOn: string;
  signOff?: string;
}
