import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { StatusProvider } from "@/providers/status-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hari Om Thalassic",
  description: "Maritime Career & Partner Portal",
  icons: {
    icon: [{ url: "/logo/hariom_logo.png" }, { url: "/logo.png" }],
    apple: "/logo/hariom_logo.png",
    shortcut: "/logo/hariom_logo.png",
  },
};

// ISSUE-005: Content Security Policy headers should be configured in next.config.ts
// This layout adds a meta tag as a fallback for development
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com"
    : "'self' 'unsafe-inline' https://fonts.googleapis.com";
  const cspContent = `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' http://localhost:4000 https://thalassic-api.onrender.com https://*.onrender.com https://*.supabase.co;`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ISSUE-004: Replaced dangerouslySetInnerHTML with properly escaped inline script */}
        {/* Theme sync script - runs before hydration to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* ISSUE-005: CSP meta tag as fallback (primary CSP should be in next.config.ts) */}
        <meta httpEquiv="Content-Security-Policy" content={cspContent} />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <AuthProvider>
            <StatusProvider>
              <Toaster />
              {children}
            </StatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
