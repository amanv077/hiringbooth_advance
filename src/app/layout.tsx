import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
