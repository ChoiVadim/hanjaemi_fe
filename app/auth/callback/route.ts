import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverUserService } from "@/lib/services/serverUserService";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/study";

  console.log("Auth callback received:", { code: !!code, error, origin, next });

  // Check if OAuth provider returned an error
  if (error) {
    console.error("OAuth provider error:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  if (code) {
    const cookieStore = cookies();
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Exchange the code for a session using PKCE
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    console.log("Code exchange result:", {
      success: !exchangeError,
      error: exchangeError?.message,
    });

    if (!exchangeError) {
      // Get user data after successful authentication
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          // Check if user profile exists using service role
          const { data: existingProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            console.log("Creating new user profile for:", user.email);
            await serverUserService.createUserProfile({
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name,
              preferred_language: 'en',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
          } else if (profileError) {
            console.error("Error checking profile:", profileError);
          } else {
            console.log("User profile already exists");
          }
        } catch (profileError) {
          console.error("Error creating user profile:", profileError);
          // Don't fail the auth flow if profile creation fails
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return response;
      }
    } else {
      console.error("Failed to exchange code for session:", exchangeError);
    }
  } else {
    console.error("No authorization code received in callback");
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
