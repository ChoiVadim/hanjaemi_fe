"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/auth-context";
import { useTour } from "@/components/context/tour-context";
import { usePathname } from "next/navigation";

export function TourTrigger() {
  const { user, loading } = useAuth();
  const { startFullOnboarding } = useTour();
  const pathname = usePathname();
  const [hasCheckedUserStatus, setHasCheckedUserStatus] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!loading && user && !hasCheckedUserStatus) {
        // Only show tour on study pages
        const isStudyPage = pathname.startsWith('/study');
        
        if (isStudyPage) {
          try {
            // Check if user is new from database
            const response = await fetch('/api/users/profile', {
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            });
            
            if (response.ok) {
              const profile = await response.json();
              
              if (profile.is_new_user) {
                console.log('New user detected on study page, starting tour');
                // Small delay to ensure page is fully loaded
                const timer = setTimeout(() => {
                  startFullOnboarding();
                }, 2000);

                return () => clearTimeout(timer);
              } else {
                console.log('Existing user on study page, skipping tour');
              }
            } else {
              console.log('Failed to fetch profile, skipping tour');
            }
          } catch (error) {
            console.error('Error checking user status:', error);
            console.log('Error checking user status, skipping tour');
          }
        }
        setHasCheckedUserStatus(true);
      }
    };

    checkUserStatus();
  }, [user, loading, startFullOnboarding, pathname, hasCheckedUserStatus]);

  return null; // This component doesn't render anything
}
