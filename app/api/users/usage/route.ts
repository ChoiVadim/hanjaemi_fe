import { NextRequest, NextResponse } from 'next/server';
import { serverUserService } from '@/lib/services/serverUserService';

export async function GET() {
  try {
    const usage = await serverUserService.checkUsageLimits();
    return NextResponse.json(usage);
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestType = 'chat' } = body;
    
    await serverUserService.incrementUsage(requestType);
    
    // Return updated usage limits
    const usage = await serverUserService.checkUsageLimits();
    return NextResponse.json(usage);
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
