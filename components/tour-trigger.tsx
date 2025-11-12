"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/context/auth-context";
import { useTour } from "@/components/context/tour-context";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";

export function TourTrigger() {
  const { user, loading } = useAuth();
  const { startFullOnboarding } = useTour();
  const pathname = usePathname();
  const { data: profile } = useUserProfile();

  useEffect(() => {
    if (!loading && user && profile) {
      // Only show tour on study pages
      const isStudyPage = pathname.startsWith('/study');
      
      if (isStudyPage && profile.is_new_user) {
        console.log('New user detected on study page, starting tour');
        // Small delay to ensure page is fully loaded
        const timer = setTimeout(() => {
          startFullOnboarding();
        }, 2000);

        return () => clearTimeout(timer);
      } else if (isStudyPage && !profile.is_new_user) {
        console.log('Existing user on study page, skipping tour');
      }
    }
  }, [user, loading, profile, startFullOnboarding, pathname]);

  return null; // This component doesn't render anything
}
