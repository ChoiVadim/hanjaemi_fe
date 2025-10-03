"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearLocalChatData } from "@/lib/chat-utils";
import { useTour } from "./tour-context";
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
  // Add other backend data types here
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [backendData, setBackendData] = useState<BackendUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingBackend, setSyncingBackend] = useState(false);
  
  const supabase = createClient();

  // Sync user with backend
  const syncUserWithBackend = async (userSession?: Session) => {
    const currentSession = userSession || session;
    if (!currentSession?.user) return;

    console.log('🔗 Syncing user with backend...');
    console.log('🆔 Sending Supabase User ID to backend:', currentSession.user.id);

    setSyncingBackend(true);
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
      
      // Fetch user's backend data
      await refreshBackendData(currentSession);
    } catch (error) {
      console.error('❌ Error syncing user with backend:', error);
    } finally {
      setSyncingBackend(false);
    }
  };

  // Fetch user data from backend
  const refreshBackendData = async (userSession?: Session) => {
    const currentSession = userSession || session;
    if (!currentSession?.user) return;

    try {
      const response = await fetch(`/api/users/data?userId=${currentSession.user.id}`, {
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBackendData(data);
        console.log('📊 Backend data loaded:', data);
      }
    } catch (error) {
      console.error('❌ Error fetching backend data:', error);
    }
  };

  useEffect(() => {
    // Clear old localStorage chat data when auth context initializes
    clearLocalChatData();
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Log initial session info
      if (session?.user) {
        console.log('🔄 Initial session found');
        console.log('🆔 Supabase User ID:', session.user.id);
        console.log('📧 User Email:', session.user.email);
      } else {
        console.log('❌ No initial session found');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is logged in, sync with backend
      if (session?.user) {
        await syncUserWithBackend(session);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('🔄 Auth state changed:', event);
        
        // Log Supabase user ID when user logs in
        if (session?.user) {
          console.log('🆔 Supabase User ID:', session.user.id);
          console.log('📧 User Email:', session.user.email);
          console.log('👤 User Metadata:', session.user.user_metadata);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle auth state changes
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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const authValue: AuthContextType = {
    user,
    session,
    backendData,
    loading,
    syncingBackend,
    signOut,
    syncUserWithBackend,
    refreshBackendData,
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
