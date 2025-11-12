import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { userService } from '@/lib/services/userService';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get usage limits
    const usageLimits = await userService.checkUsageLimits();
    
    return NextResponse.json({
      success: true,
      data: usageLimits
    });

  } catch (error) {
    console.error('Error checking usage limits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { requestType } = body;

    // Check if user can make request
    const usageLimits = await userService.checkUsageLimits();
    if (!usageLimits.canMakeRequest) {
      return NextResponse.json(
        { 
          error: 'Usage limit exceeded',
          usageLimits 
        },
        { status: 429 }
      );
    }

    // Increment usage
    await userService.incrementUsage(requestType || 'chat');

    return NextResponse.json({
      success: true,
      message: 'Usage incremented successfully'
    });

  } catch (error) {
    console.error('Error incrementing usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
