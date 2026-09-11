export const THEME_COLORS = {
  primary: '#3D5EF6',
  primaryHover: '#2E4FE0',
  primaryLight: '#EEF1FE',
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  successBg: '#DCFCE7',
  successText: '#16A34A',
  warningBg: '#FEF3C7',
  warningText: '#B45309',
  dangerBg: '#FEE2E2',
  dangerText: '#DC2626',
} as const;

export type ThemeColorKey = keyof typeof THEME_COLORS;
