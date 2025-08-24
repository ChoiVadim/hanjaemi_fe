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

    // Get chat data from request
    const chatData = await request.json();
    
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('❌ BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { error: 'Backend configuration error' },
        { status: 500 }
      );
    }

    console.log('🔗 Saving chat message to backend:', `${backendUrl}/users/${user.id}/chat`);

    // Send chat message to backend - user ID in URL for verification
    const backendResponse = await fetch(`${backendUrl}/users/${user.id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed
        // 'Authorization': `Bearer ${process.env.BACKEND_SECRET}`,
      },
      body: JSON.stringify({
        message: chatData.message,
        response: chatData.response,
        lessonContext: chatData.lessonContext
      })
    });

    if (!backendResponse.ok) {
      console.error(`❌ Backend chat save failed: ${backendResponse.status} ${backendResponse.statusText}`);
      return NextResponse.json(
        { error: 'Failed to save chat message to backend' },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log('✅ Successfully saved chat message to backend');

    return NextResponse.json({
      success: true,
      message: 'Chat message saved successfully',
      data: backendData
    });

  } catch (error) {
    console.error('Error saving chat message:', error);
    return NextResponse.json(
      { error: 'Failed to save chat message' },
      { status: 500 }
    );
  }
}
