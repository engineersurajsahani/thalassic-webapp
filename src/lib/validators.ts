import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  referralCode: z.string().optional(),
  indosNumber: z.string().max(20).optional(),
}).refine(data => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const seafarerProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone is required').optional(),
  dob: z.string().optional(),
  birthPlace: z.string().optional(),
  fatherName: z.string().optional(),
  passportNum: z.string().max(9, 'Passport number must be at most 9 characters').optional(),
  indosNum: z.string().max(8, 'INDoS number must be at most 8 characters').optional(),
  cdcNum: z.string().max(12, 'CDC number must be at most 12 characters').optional(),
  education: z.string().optional(),
});

export const settlementBatchSchema = z.object({
  referenceNumber: z.string().min(4, 'UTR / Reference is required').max(22, 'Bank UTR must be at most 22 characters'),
  paymentMethod: z.string(),
  paymentDate: z.string(),
  remarks: z.string().max(250).optional(),
});

export const courseBookingSchema = z.object({
  courseId: z.string().uuid('Invalid course selection'),
  referralCode: z.string().optional(),
  batchSchedule: z.string().optional(),
  instituteId: z.string().optional(),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent']).default('Normal'),
});
