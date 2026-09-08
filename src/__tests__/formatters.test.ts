import { formatCurrency, formatDate, getInitials } from '../lib/formatters';

describe('Frontend Formatter Utilities', () => {
  it('should format currency to Indian Rupees', () => {
    expect(formatCurrency(12000)).toContain('12,000');
    expect(formatCurrency('₹25,000')).toContain('25,000');
    expect(formatCurrency(0)).toContain('0');
  });

  it('should extract correct initials from full name', () => {
    expect(getInitials('Raj Kumar')).toBe('RK');
    expect(getInitials('Priya')).toBe('PR');
    expect(getInitials('')).toBe('U');
  });

  it('should format ISO date strings properly', () => {
    const formatted = formatDate('2026-09-06T00:00:00.000Z');
    expect(formatted).toContain('2026');
  });
});
