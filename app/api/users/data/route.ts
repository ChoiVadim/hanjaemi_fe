import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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

    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Verify the requested userId matches the authenticated user
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

        const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('❌ BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { message: 'Backend configuration error' },
        { status: 500 }
      );
    }

    console.log('🔗 Fetching user data from backend:', `${backendUrl}/users/${userId}/data`);

    // Fetch user data from backend
    try {
      const response = await fetch(`${backendUrl}/users/${userId}/data`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${process.env.BACKEND_SECRET}`,
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('📝 User not found in backend, returning empty data');
          return NextResponse.json({ 
            chatHistory: [],
            preferences: {},
            progressData: {},
            message: 'User not found in backend, will be created on first sync'
          });
        }
        
        console.error(`❌ Backend API error: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { error: 'Failed to fetch user data from backend' },
          { status: response.status }
        );
      }

      const backendData = await response.json();
      console.log('✅ Successfully fetched user data from backend');

      // Return the data in the format expected by frontend
      return NextResponse.json({
        chatHistory: backendData.chatHistory || [],
        preferences: backendData.preferences || {},
        progressData: backendData.progressData || {},
        lastSeen: backendData.lastSeen,
        // Add other backend data fields
      });
    } catch (fetchError) {
      console.error('❌ Error fetching from backend:', fetchError);
      return NextResponse.json(
        { error: 'Failed to communicate with backend' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
