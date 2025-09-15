import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext"; // Make sure the path is correct

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ERP Portal",
  description: "College ERP System - Manage Students, Teachers, Attendance, and Reports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          {/* Global Navigation */}

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>

          {/* Notifications + Helpers */}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
