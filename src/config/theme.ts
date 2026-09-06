export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  defaultTheme: Theme;
  storageKey: string;
}

export const themeConfig: ThemeConfig = {
  defaultTheme: 'light',
  storageKey: 'thalassic_theme',
};

export const colors = {
  primary: {
    DEFAULT: '#0284c7', // Sky 600
    dark: '#0369a1',    // Sky 700
    light: '#38bdf8',   // Sky 400
  },
  accent: {
    DEFAULT: '#0d9488', // Teal 600
    dark: '#0f766e',
    light: '#2dd4bf',
  },
  navy: {
    DEFAULT: '#0f172a', // Slate 900
    light: '#1e293b',   // Slate 800
  },
};
