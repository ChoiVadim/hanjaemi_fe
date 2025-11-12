"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearLocalChatData } from "@/lib/chat-utils";
import { useAuthStore } from "@/store/auth-store";
import type { Session } from '@supabase/supabase-js';

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  backendData: BackendUserData | null;
  loading: boolean;
  syncingBackend: boolean;
  signOut: () => Promise<void>;
  syncUserWithBackend: () => Promise<void>;
  refreshBackendData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  backendData: null,
  loading: true,
  syncingBackend: false,
  signOut: async () => {},
  syncUserWithBackend: async () => {},
  refreshBackendData: async () => {},
});

// Compatibility provider that wraps Zustand store
export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    session,
    backendData,
    loading,
    syncingBackend,
    signOut,
    syncUserWithBackend,
    refreshBackendData,
    setUser,
    setSession,
    setLoading,
    setBackendData,
  } = useAuthStore();

  useEffect(() => {
    // Clear old localStorage chat data when auth context initializes
    clearLocalChatData();
    
    // Initialize auth state
    const supabase = createClient();
    
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('🔄 Initial session found');
        console.log('🆔 Supabase User ID:', session.user.id);
        console.log('📧 User Email:', session.user.email);
      } else {
        console.log('❌ No initial session found');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        await syncUserWithBackend(session);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('🔄 Auth state changed:', event);
        
        if (session?.user) {
          console.log('🆔 Supabase User ID:', session.user.id);
          console.log('📧 User Email:', session.user.email);
          console.log('👤 User Metadata:', session.user.user_metadata);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, syncing with backend...');
          await syncUserWithBackend(session);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out, clearing backend data');
          setBackendData(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const authValue: AuthContextType = {
    user,
    session,
    backendData,
    loading,
    syncingBackend,
    signOut,
    syncUserWithBackend: () => syncUserWithBackend(),
    refreshBackendData: () => refreshBackendData(),
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
