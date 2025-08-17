"use client";

import "./globals.css";
import { Toaster } from "sonner";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Lexend } from 'next/font/google';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggleCorner } from "@/components/theme-toggle-corner";

// Configure Lexend font
const lexend = Lexend({ 
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap'
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !["/", "/login", "/register"].includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Toaster closeButton position="bottom-right" theme="system" />
          <ThemeToggleCorner />
          <div className="flex min-h-screen">
            {showSidebar ? (
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1">{children}</main>
              </SidebarProvider>
            ) : (
              <div className="flex-1">
                <main>{children}</main>
              </div>
            )}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
