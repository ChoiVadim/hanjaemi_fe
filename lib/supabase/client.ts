"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// Server-side utility function
export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
}

export async function signInWithGoogle() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/study`,
        flowType: "pkce",
        scopes: "email profile",
      },
    });

    if (error) {
      console.error("Google OAuth error:", error);
    }

    return { data, error };
  } catch (err) {
    console.error("Google OAuth exception:", err);
    return { data: null, error: { message: "Google OAuth failed" } };
  }
}

export async function signInWithKakaoTalk() {
  const supabase = createClient();

  try {
    console.log("Attempting Kakao OAuth with config:", {
      provider: "kakao",
      redirectTo: `${window.location.origin}/auth/callback?next=/study`,
      flowType: "pkce",
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/study`,
        flowType: "pkce",
        scopes: "profile_nickname profile_image account_email",
      },
    });

    console.log("Kakao OAuth response:", { data, error });

    if (error) {
      console.error("Kakao OAuth error details:", {
        message: error.message,
        status: error.status,
        details: error,
      });
    }

    return { data, error };
  } catch (err) {
    console.error("Kakao OAuth exception:", err);
    return { data: null, error: { message: "Kakao OAuth failed" } };
  }
}
