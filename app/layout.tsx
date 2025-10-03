"use client";

import "./globals.css";
import { Toaster } from "sonner";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Lexend } from 'next/font/google';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/components/context/auth-context";
import { TourProvider } from "@/components/context/tour-context";
import { TourTrigger } from "@/components/tour-trigger";

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
      <head>
        <title>HanJaemi - Korean Learning Platform</title>
        <meta name="description" content="Learn Korean with AI-powered lessons, grammar explanations, and vocabulary practice" />
        <link rel="icon" href="/logo-light.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-light.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${lexend.variable} font-sans antialiased`}>
        <AuthProvider>
          <TourProvider>
            <TourTrigger />
            <Toaster closeButton position="bottom-right" />
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
          </TourProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
