import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token with Supabase
    const cookieStore = cookies();
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
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Get user from Supabase session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from request
    const userData = await request.json();
    
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('❌ BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { error: 'Backend configuration error' },
        { status: 500 }
      );
    }

    console.log('🔗 Syncing user with backend:', `${backendUrl}/users/sync`);

    // Send to backend
    const backendResponse = await fetch(`${backendUrl}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed
        // 'Authorization': `Bearer ${process.env.BACKEND_SECRET}`,
      },
      body: JSON.stringify({
        supabaseUserId: user.id,
        email: userData.email,
        fullName: userData.fullName,
        avatarUrl: userData.avatarUrl,
        provider: userData.provider,
        syncedAt: new Date().toISOString()
      })
    });

    if (!backendResponse.ok) {
      console.error(`❌ Backend sync failed: ${backendResponse.status} ${backendResponse.statusText}`);
      return NextResponse.json(
        { error: 'Failed to sync user with backend' },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log('✅ Successfully synced user with backend');

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      data: backendData
    });

  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}
