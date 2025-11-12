import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

export interface UserData {
  chatHistory?: any[];
  preferences?: any;
  progress?: any;
  settings?: any;
}

export function useUserData() {
  const { session } = useAuthStore();

  return useQuery<UserData>({
    queryKey: ["userData", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user session");
      
      const response = await fetch(`/api/users/data?userId=${session.user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
    enabled: !!session?.user?.id,
  });
}

export function useSyncUser() {
  const queryClient = useQueryClient();
  const { session, syncUserWithBackend } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("No session");
      await syncUserWithBackend(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}

