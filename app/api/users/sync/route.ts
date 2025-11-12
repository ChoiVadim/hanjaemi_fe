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
    
    // If no backend URL, return success without syncing
    if (!backendUrl) {
      console.log('📝 No BACKEND_URL configured, skipping sync');
      return NextResponse.json({
        success: true,
        message: 'No backend configured - sync skipped',
        data: { supabaseId: user.id }
      });
    }

    console.log('🔗 Syncing user with backend:', `${backendUrl}/sync`);

    // Send to backend - only user ID for verification
    try {
      const backendResponse = await fetch(`${backendUrl}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseId: user.id
        })
      });

      if (!backendResponse.ok) {
        console.error(`❌ Backend sync failed: ${backendResponse.status} ${backendResponse.statusText}`);
        // Return success anyway to not break the flow
        return NextResponse.json({
          success: true,
          message: 'Backend sync failed, but continuing',
          data: { supabaseId: user.id }
        });
      }

      const backendData = await backendResponse.json();
      console.log('✅ Successfully synced user with backend');

      return NextResponse.json({
        success: true,
        message: 'User synced successfully',
        data: backendData
      });
    } catch (error) {
      console.error('❌ Error during backend sync:', error);
      // Return success anyway to not break the flow
      return NextResponse.json({
        success: true,
        message: 'Backend sync error, but continuing',
        data: { supabaseId: user.id }
      });
    }

  } catch (error) {
    console.error('❌ Error syncing user:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to sync user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
