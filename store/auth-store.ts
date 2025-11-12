import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    provider?: string;
    [key: string]: any;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
    [key: string]: any;
  };
}

interface BackendUserData {
  chatHistory?: any[];
  preferences?: any;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  backendData: BackendUserData | null;
  loading: boolean;
  syncingBackend: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setBackendData: (data: BackendUserData | null) => void;
  setLoading: (loading: boolean) => void;
  setSyncingBackend: (syncing: boolean) => void;
  signOut: () => Promise<void>;
  syncUserWithBackend: (session?: Session) => Promise<void>;
  refreshBackendData: (session?: Session) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const supabase = createClient();

  return {
    user: null,
    session: null,
    backendData: null,
    loading: true,
    syncingBackend: false,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setBackendData: (data) => set({ backendData: data }),
    setLoading: (loading) => set({ loading }),
    setSyncingBackend: (syncing) => set({ syncingBackend: syncing }),

    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, session: null, backendData: null });
    },

    syncUserWithBackend: async (session?: Session) => {
      const currentSession = session || get().session;
      if (!currentSession?.user) return;

      console.log('🔗 Syncing user with backend...');
      set({ syncingBackend: true });

      try {
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`
          },
          body: JSON.stringify({
            supabaseId: currentSession.user.id
          })
        });

        if (!response.ok) {
          throw new Error('Failed to sync user with backend');
        }

        const data = await response.json();
        console.log('✅ User synced with backend:', data);
        
        await get().refreshBackendData(currentSession);
      } catch (error) {
        console.error('❌ Error syncing user with backend:', error);
      } finally {
        set({ syncingBackend: false });
      }
    },

    refreshBackendData: async (session?: Session) => {
      const currentSession = session || get().session;
      if (!currentSession?.user) return;

      try {
        const response = await fetch(`/api/users/data?userId=${currentSession.user.id}`, {
          headers: {
            'Authorization': `Bearer ${currentSession.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          set({ backendData: data });
          console.log('📊 Backend data loaded:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching backend data:', error);
      }
    },
  };
});


