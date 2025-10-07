import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/study";
  
  // Get the actual domain from headers for production
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");
  const actualOrigin = forwardedHost ? `https://${forwardedHost}` : 
                      (host && !host.includes("localhost")) ? `https://${host}` : 
                      origin;

  console.log("Auth callback received:", { 
    code: !!code, 
    error, 
    origin, 
    next,
    url: request.url,
    headers: {
      host: request.headers.get("host"),
      "x-forwarded-host": request.headers.get("x-forwarded-host"),
      "x-forwarded-proto": request.headers.get("x-forwarded-proto"),
    }
  });

  // Check if OAuth provider returned an error
  if (error) {
    console.error("OAuth provider error:", error);
    return NextResponse.redirect(`${actualOrigin}/auth/auth-code-error`);
  }

  if (code) {
    const cookieStore = cookies();
    const response = NextResponse.redirect(`${actualOrigin}${next}`);

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
      console.log("Redirect logic:", {
        actualOrigin,
        next,
        isLocalEnv: process.env.NODE_ENV === "development"
      });

      console.log("Redirecting to:", `${actualOrigin}${next}`);
      return NextResponse.redirect(`${actualOrigin}${next}`);
    } else {
      console.error("Failed to exchange code for session:", exchangeError);
    }
  } else {
    console.error("No authorization code received in callback");
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${actualOrigin}/auth/auth-code-error`);
}
