import { NextRequest, NextResponse } from 'next/server';
import { fetchLessonData } from '@/data/dataService';

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    // Parse lessonId format: "difficultyId-lessonNumber" or just lesson number
    const parts = params.lessonId.split('-');
    let difficultyId: string;
    let lessonNumber: string;
    
    if (parts.length >= 2) {
      difficultyId = parts[0];
      lessonNumber = parts.slice(1).join('-');
    } else {
      // If no difficulty ID, try to find the lesson across all difficulties
      // For now, return error - we need difficulty ID
      return NextResponse.json(
        { message: 'Lesson ID must include difficulty ID (format: difficultyId-lessonNumber)' },
        { status: 400 }
      );
    }

    console.log('📚 Fetching vocabulary from local JSON data for lesson:', { difficultyId, lessonNumber });
    const lesson = await fetchLessonData(difficultyId, lessonNumber);
    
    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Successfully fetched vocabulary from local data');
    return NextResponse.json(lesson.vocabulary || []);
  } catch (error) {
    console.error('Vocabulary API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
