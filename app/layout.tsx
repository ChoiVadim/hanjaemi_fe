import "./globals.css";
import { type ReactNode } from "react";
import { Lexend } from 'next/font/google';
import { AppProviders } from "@/components/providers/app-providers";

// Configure Lexend font
const lexend = Lexend({ 
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap'
});

export const metadata = {
  title: "HanJaemi - Korean Learning Platform",
  description: "Learn Korean with AI-powered lessons, grammar explanations, and vocabulary practice",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-light.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-light.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${lexend.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}