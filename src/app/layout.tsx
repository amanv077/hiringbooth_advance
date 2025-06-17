import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HiringBooth - Find Your Dream Job",
  description: "Connect talented job seekers with innovative companies. Modern job portal for efficient hiring.",
  keywords: ["jobs", "hiring", "recruitment", "career", "employment"],
  authors: [{ name: "HiringBooth Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased hiringbooth-theme`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '8px',
              padding: '12px 16px',
              maxWidth: 'calc(100vw - 32px)',
              width: 'auto',
              minWidth: '200px',
              wordBreak: 'break-word',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#f9fafb',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f9fafb',
              },
            },
          }}
          containerStyle={{
            zIndex: 9999,
          }}
          containerClassName="!fixed !top-4 !left-1/2 !transform !-translate-x-1/2 !z-[9999] !w-auto !max-w-[calc(100vw-2rem)] !mx-4"
        />
      </body>
    </html>
  );
}
