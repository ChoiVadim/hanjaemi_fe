import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/study'

  console.log('Auth callback received:', { code: !!code, error, origin, next })

  // Check if OAuth provider returned an error
  if (error) {
    console.error('OAuth provider error:', error)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  if (code) {
    const cookieStore = cookies()
    const response = NextResponse.redirect(`${origin}${next}`)
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Exchange the code for a session using PKCE
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Code exchange result:', { success: !exchangeError, error: exchangeError?.message })
    
    if (!exchangeError) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return response
      }
    } else {
      console.error('Failed to exchange code for session:', exchangeError)
    }
  } else {
    console.error('No authorization code received in callback')
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
