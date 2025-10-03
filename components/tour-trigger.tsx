"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/context/auth-context";
import { useTour } from "@/components/context/tour-context";
import { usePathname } from "next/navigation";

export function TourTrigger() {
  const { user, loading } = useAuth();
  const { startFullOnboarding } = useTour();
  const pathname = usePathname();

  useEffect(() => {
    // Only trigger tours for new users on functional pages (not homepage)
    const isFunctionalPage = !["/", "/login", "/register"].includes(pathname);
    
    if (!loading && user && isFunctionalPage) {
      const hasSeenTours = localStorage.getItem('hanjaemi-tours-completed');
      
      if (!hasSeenTours) {
        // Small delay to ensure page is fully loaded
        const timer = setTimeout(() => {
          startFullOnboarding();
          localStorage.setItem('hanjaemi-tours-completed', 'true');
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [user, loading, startFullOnboarding, pathname]);

  return null; // This component doesn't render anything
}
