import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { difficultyId: string } }
) {
  try {
    const { difficultyId } = params;
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('❌ BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { message: 'Backend configuration error' },
        { status: 500 }
      );
    }

    console.log('🔗 Fetching lessons from backend:', `${backendUrl}/difficulty/${difficultyId}/lessons`);
    
    const response = await fetch(`${backendUrl}/difficulty/${difficultyId}/lessons`, {
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
        { message: `Failed to fetch lessons for difficulty ${difficultyId}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched lessons from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
