import { loginSchema, registerSchema, seafarerProfileSchema } from '../lib/validators';

describe('Frontend Form Validators', () => {
  describe('loginSchema', () => {
    it('should validate valid email and password', () => {
      const validData = { email: 'seafarer@example.com', password: 'password123' };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = { email: 'not-an-email', password: 'password123' };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject passwords shorter than 6 characters', () => {
      const invalidData = { email: 'user@example.com', password: '123' };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate registration data with matching passwords', () => {
      const validData = {
        name: 'Raj Kumar',
        email: 'raj@example.com',
        password: 'Password@123',
        confirmPassword: 'Password@123',
        phone: '9876543210',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'Raj Kumar',
        email: 'raj@example.com',
        password: 'Password@123',
        confirmPassword: 'DifferentPassword@123',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('seafarerProfileSchema', () => {
    it('should validate seafarer profile fields', () => {
      const validProfile = {
        name: 'Amit Patel',
        phone: '9898989898',
        passportNum: 'Z1234567',
        indosNum: '20N1234',
        cdcNum: 'MUM123456',
      };
      const result = seafarerProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });
  });
});
