import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  is_new_user?: boolean;
  lesson_tour_completed?: boolean;
  [key: string]: any;
}

export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return response.json();
    },
  });
}

