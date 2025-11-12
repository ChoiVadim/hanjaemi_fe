import { NextRequest, NextResponse } from 'next/server';
import { fetchLessonData } from '@/data/dataService';

export async function GET(
  request: NextRequest,
  { params }: { params: { difficultyId: string; lessonId: string } }
) {
  try {
    const { difficultyId, lessonId } = params;
    console.log('📚 Fetching lesson details from local JSON data:', { difficultyId, lessonId });
    const lesson = await fetchLessonData(difficultyId, lessonId);
    
    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Successfully fetched lesson details from local data');
    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Lesson API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}