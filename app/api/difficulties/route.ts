import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('❌ BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { message: 'Backend configuration error' },
        { status: 500 }
      );
    }

    console.log('🔗 Fetching difficulties from backend:', `${backendUrl}/difficulties`);

    const response = await fetch(`${backendUrl}/difficulties`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed
        // 'Authorization': `Bearer ${process.env.BACKEND_SECRET}`,
      },
    });

    if (!response.ok) {
      console.error(`❌ Backend API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { message: 'Failed to fetch difficulties from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched difficulties from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Difficulties API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
