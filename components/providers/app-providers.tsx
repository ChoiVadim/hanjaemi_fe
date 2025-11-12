"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { AuthProvider } from "@/components/context/auth-context";
import { TourProvider } from "@/components/context/tour-context";
import { TourTrigger } from "@/components/tour-trigger";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/app-layout";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <PostHogProvider>
        <AuthProvider>
          <TourProvider>
            <TourTrigger />
            <Toaster closeButton position="bottom-right" />
            <AppLayout>{children}</AppLayout>
          </TourProvider>
        </AuthProvider>
      </PostHogProvider>
    </QueryProvider>
  );
}

