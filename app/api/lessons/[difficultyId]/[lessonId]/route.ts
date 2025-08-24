import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { difficultyId: string; lessonId: string } }
) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('❌ BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { message: 'Backend configuration error' },
        { status: 500 }
      );
    }

    console.log('🔗 Fetching lesson details from backend:', `${backendUrl}/difficulty/${params.difficultyId}/lessons/${params.lessonId}`);

    const response = await fetch(`${backendUrl}/difficulty/${params.difficultyId}/lessons/${params.lessonId}`, {
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
        { message: 'Failed to fetch lesson data from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched lesson details from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Lesson API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}