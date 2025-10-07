import { NextRequest, NextResponse } from 'next/server';
import { serverUserService } from '@/lib/services/serverUserService';

export async function GET() {
  try {
    const progress = await serverUserService.getUserProgress();
    
    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const progress = await serverUserService.updateLearningProgress(body);
    
    if (!progress) {
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 400 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating learning progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
